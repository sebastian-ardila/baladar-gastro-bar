'use client';

import { useState } from 'react';
import { useTranslations, useLocale } from 'next-intl';
import { buildContactMessage, buildWhatsAppUrl } from '@/lib/whatsapp';
import { FaWhatsapp } from 'react-icons/fa';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';
import Select from '@/components/ui/Select';

export default function ContactForm() {
  const t = useTranslations('contact');
  const locale = useLocale();
  const [form, setForm] = useState({
    name: '',
    email: '',
    phone: '',
    interest: '',
    message: '',
  });

  const isValid = form.name.trim() && form.email.trim() && form.interest && form.message.trim();

  const interestOptions = [
    { value: '', label: t('interest') },
    { value: t('interests.franchise'), label: t('interests.franchise') },
    { value: t('interests.supplier'), label: t('interests.supplier') },
    { value: t('interests.collaboration'), label: t('interests.collaboration') },
    { value: t('interests.events'), label: t('interests.events') },
    { value: t('interests.birthday'), label: t('interests.birthday') },
    { value: t('interests.other'), label: t('interests.other') },
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!isValid) return;
    const message = buildContactMessage(form, locale);
    const url = buildWhatsAppUrl(message);
    window.open(url, '_blank');
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <Input
        label={t('name')}
        id="contact-name"
        placeholder={t('namePlaceholder')}
        value={form.name}
        onChange={(e) => setForm({ ...form, name: e.target.value })}
        required
      />

      <Input
        label={t('email')}
        id="contact-email"
        type="email"
        placeholder={t('emailPlaceholder')}
        value={form.email}
        onChange={(e) => setForm({ ...form, email: e.target.value })}
        required
      />

      <Input
        label={t('phone')}
        id="contact-phone"
        type="tel"
        placeholder={t('phonePlaceholder')}
        value={form.phone}
        onChange={(e) => setForm({ ...form, phone: e.target.value })}
      />

      <Select
        label={t('interest')}
        id="contact-interest"
        options={interestOptions}
        value={form.interest}
        onChange={(e) => setForm({ ...form, interest: e.target.value })}
        required
      />

      <div className="w-full">
        <label htmlFor="contact-message" className="block text-sm font-medium text-gray-300 mb-1">
          {t('message')}
        </label>
        <textarea
          id="contact-message"
          rows={4}
          placeholder={t('messagePlaceholder')}
          value={form.message}
          onChange={(e) => setForm({ ...form, message: e.target.value })}
          className="w-full bg-dark-light border border-gray-700 rounded-lg px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-accent focus:ring-1 focus:ring-accent transition-colors text-base resize-none"
          required
        />
      </div>

      <Button type="submit" variant="whatsapp" className="w-full" size="lg" disabled={!isValid}>
        <FaWhatsapp className="w-5 h-5" />
        {t('submit')}
      </Button>
    </form>
  );
}
