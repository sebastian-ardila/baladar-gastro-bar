'use client';

import { useState, useRef } from 'react';
import { useTranslations, useLocale } from 'next-intl';
import { buildReservationMessage, buildWhatsAppUrl } from '@/lib/whatsapp';
import { FaWhatsapp } from 'react-icons/fa';
import { HiPlus, HiMinus } from 'react-icons/hi';
import { HiOutlineCalendar } from 'react-icons/hi2';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';
import Select from '@/components/ui/Select';

function formatDateLabel(dateStr: string, locale: string): string {
  if (!dateStr) return '';
  const [year, month, day] = dateStr.split('-').map(Number);
  const date = new Date(year, month - 1, day);
  const isEs = locale === 'es';

  const dayNames = isEs
    ? ['Domingo', 'Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado']
    : ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
  const monthNames = isEs
    ? ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre']
    : ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];

  return `${dayNames[date.getDay()]} ${day} ${isEs ? 'de' : ''} ${monthNames[month - 1]}`.replace('  ', ' ');
}

export default function ReservationForm() {
  const t = useTranslations('reservation');
  const locale = useLocale();
  const isEs = locale === 'es';
  const dateInputRef = useRef<HTMLInputElement>(null);

  const [form, setForm] = useState({
    name: '',
    guests: '2',
    date: '',
    time: '',
    comments: '',
  });

  const guestsNum = parseInt(form.guests) || 1;
  const isValid = form.name.trim() && form.date && form.time;

  const today = new Date().toISOString().split('T')[0];

  const timeOptions = [
    { value: '', label: t('time') },
    ...Array.from({ length: 13 }, (_, i) => {
      const hour = 11 + i;
      const h = hour > 12 ? hour - 12 : hour;
      const ampm = hour >= 12 ? 'PM' : 'AM';
      return { value: `${h}:00 ${ampm}`, label: `${h}:00 ${ampm}` };
    }),
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!isValid) return;
    const formattedDate = formatDateLabel(form.date, locale);
    const message = buildReservationMessage(
      { name: form.name, guests: form.guests, date: formattedDate, time: form.time, comments: form.comments },
      locale,
    );
    const url = buildWhatsAppUrl(message);
    window.open(url, '_blank');
  };

  const openDatePicker = () => {
    dateInputRef.current?.showPicker?.();
    dateInputRef.current?.focus();
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <Input
        label={t('name')}
        id="res-name"
        placeholder={t('namePlaceholder')}
        value={form.name}
        onChange={(e) => setForm({ ...form, name: e.target.value })}
        required
      />

      {/* Guests counter */}
      <div className="w-full">
        <label className="block text-sm font-medium text-gray-300 mb-2">
          {t('guests')}
        </label>
        <div className="flex items-center gap-4">
          <button
            type="button"
            onClick={() => setForm({ ...form, guests: String(Math.max(1, guestsNum - 1)) })}
            className="w-10 h-10 rounded-lg bg-dark border border-gray-700 flex items-center justify-center text-white hover:border-accent transition-colors"
          >
            <HiMinus className="w-4 h-4" />
          </button>
          <span className="text-white font-bold text-xl w-8 text-center">{guestsNum}</span>
          <button
            type="button"
            onClick={() => setForm({ ...form, guests: String(Math.min(20, guestsNum + 1)) })}
            className="w-10 h-10 rounded-lg bg-dark border border-gray-700 flex items-center justify-center text-white hover:border-accent transition-colors"
          >
            <HiPlus className="w-4 h-4" />
          </button>
          <span className="text-gray-500 text-sm">
            {guestsNum === 1 ? (isEs ? 'persona' : 'person') : (isEs ? 'personas' : 'people')}
          </span>
        </div>
      </div>

      {/* Date — hidden native input + visible button */}
      <div className="w-full">
        <label className="block text-sm font-medium text-gray-300 mb-2">
          {t('date')}
        </label>
        <input
          ref={dateInputRef}
          type="date"
          min={today}
          value={form.date}
          onChange={(e) => setForm({ ...form, date: e.target.value })}
          className="sr-only"
          tabIndex={-1}
          required
        />
        <button
          type="button"
          onClick={openDatePicker}
          className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg border transition-colors text-left ${
            form.date
              ? 'border-accent/40 bg-accent/5 text-white'
              : 'border-gray-700 bg-dark-light text-gray-500 hover:border-gray-500'
          }`}
        >
          <HiOutlineCalendar className={`w-5 h-5 shrink-0 ${form.date ? 'text-accent' : 'text-gray-500'}`} />
          <span className="text-base">
            {form.date
              ? formatDateLabel(form.date, locale)
              : (isEs ? 'Seleccionar fecha' : 'Select date')}
          </span>
        </button>
      </div>

      {/* Time */}
      <Select
        label={t('time')}
        id="res-time"
        options={timeOptions}
        value={form.time}
        onChange={(e) => setForm({ ...form, time: e.target.value })}
        required
      />

      {/* Comments */}
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
          className="w-full bg-dark-light border border-gray-700 rounded-lg px-3 sm:px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-accent focus:ring-1 focus:ring-accent transition-colors text-base resize-none"
        />
      </div>

      <Button type="submit" className="w-full" size="lg" disabled={!isValid}>
        <FaWhatsapp className="w-5 h-5" />
        {t('submit')}
      </Button>
    </form>
  );
}
