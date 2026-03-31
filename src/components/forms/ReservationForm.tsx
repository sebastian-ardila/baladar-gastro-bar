'use client';

import { useState } from 'react';
import { useTranslations, useLocale } from 'next-intl';
import { buildReservationMessage, buildWhatsAppUrl } from '@/lib/whatsapp';
import { FaWhatsapp } from 'react-icons/fa';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';
import Select from '@/components/ui/Select';

export default function ReservationForm() {
  const t = useTranslations('reservation');
  const locale = useLocale();
  const [form, setForm] = useState({
    name: '',
    guests: '2',
    date: '',
    time: '',
    comments: '',
  });

  const isValid = form.name.trim() && form.date && form.time;

  const timeOptions = [
    { value: '', label: t('time') },
    ...Array.from({ length: 13 }, (_, i) => {
      const hour = 11 + i;
      const h = hour > 12 ? hour - 12 : hour;
      const ampm = hour >= 12 ? 'PM' : 'AM';
      return { value: `${h}:00 ${ampm}`, label: `${h}:00 ${ampm}` };
    }),
  ];

  const guestOptions = [
    ...Array.from({ length: 20 }, (_, i) => ({
      value: String(i + 1),
      label: String(i + 1),
    })),
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!isValid) return;
    const message = buildReservationMessage(form, locale);
    const url = buildWhatsAppUrl(message);
    window.open(url, '_blank');
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <Input
        label={t('name')}
        id="res-name"
        placeholder={t('namePlaceholder')}
        value={form.name}
        onChange={(e) => setForm({ ...form, name: e.target.value })}
        required
      />

      <Select
        label={t('guests')}
        id="res-guests"
        options={guestOptions}
        value={form.guests}
        onChange={(e) => setForm({ ...form, guests: e.target.value })}
      />

      <Input
        label={t('date')}
        id="res-date"
        type="date"
        value={form.date}
        onChange={(e) => setForm({ ...form, date: e.target.value })}
        required
      />

      <Select
        label={t('time')}
        id="res-time"
        options={timeOptions}
        value={form.time}
        onChange={(e) => setForm({ ...form, time: e.target.value })}
        required
      />

      <div className="w-full">
        <label htmlFor="res-comments" className="block text-sm font-medium text-gray-300 mb-1">
          {t('comments')}
        </label>
        <textarea
          id="res-comments"
          rows={3}
          placeholder={t('commentsPlaceholder')}
          value={form.comments}
          onChange={(e) => setForm({ ...form, comments: e.target.value })}
          className="w-full bg-dark-light border border-gray-700 rounded-lg px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-accent focus:ring-1 focus:ring-accent transition-colors text-base resize-none"
        />
      </div>

      <Button type="submit" variant="whatsapp" className="w-full" size="lg" disabled={!isValid}>
        <FaWhatsapp className="w-5 h-5" />
        {t('submit')}
      </Button>
    </form>
  );
}
