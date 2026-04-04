'use client';

import { useState, useRef } from 'react';
import { useTranslations, useLocale } from 'next-intl';
import { buildReservationMessage, buildWhatsAppUrl } from '@/lib/whatsapp';
import { FaWhatsapp } from 'react-icons/fa';
import { HiPlus, HiMinus } from 'react-icons/hi';
import { HiOutlineCalendar } from 'react-icons/hi2';
import Input from '@/components/ui/Input';

/* ── Helpers ── */

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

interface TimeSlot {
  value: string;
  label: string;
}

interface TimeGroup {
  name: { es: string; en: string };
  emoji: string;
  slots: TimeSlot[];
}

const timeGroups: TimeGroup[] = [
  {
    name: { es: 'Mañana', en: 'Morning' },
    emoji: '☀️',
    slots: [
      { value: '11:00 AM', label: '11:00' },
      { value: '12:00 PM', label: '12:00' },
    ],
  },
  {
    name: { es: 'Tarde', en: 'Afternoon' },
    emoji: '🌤️',
    slots: [
      { value: '1:00 PM', label: '1:00' },
      { value: '2:00 PM', label: '2:00' },
      { value: '3:00 PM', label: '3:00' },
      { value: '4:00 PM', label: '4:00' },
      { value: '5:00 PM', label: '5:00' },
    ],
  },
  {
    name: { es: 'Noche', en: 'Evening' },
    emoji: '🌙',
    slots: [
      { value: '6:00 PM', label: '6:00' },
      { value: '7:00 PM', label: '7:00' },
      { value: '8:00 PM', label: '8:00' },
      { value: '9:00 PM', label: '9:00' },
      { value: '10:00 PM', label: '10:00' },
      { value: '11:00 PM', label: '11:00' },
    ],
  },
];

/* ── Component ── */

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
  const [tried, setTried] = useState(false);

  const guestsNum = parseInt(form.guests) || 1;

  const missingName = !form.name.trim();
  const missingDate = !form.date;
  const missingTime = !form.time;
  const isValid = !missingName && !missingDate && !missingTime;

  const today = new Date().toISOString().split('T')[0];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setTried(true);
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

  const showError = (missing: boolean) => tried && missing;

  return (
    <form onSubmit={handleSubmit} className="space-y-6" noValidate>
      {/* Name */}
      <div>
        <Input
          label={t('name')}
          id="res-name"
          placeholder={t('namePlaceholder')}
          value={form.name}
          onChange={(e) => setForm({ ...form, name: e.target.value })}
          className={showError(missingName) ? 'border-red-500/60 focus:border-red-500 focus:ring-red-500/30' : ''}
        />
        {showError(missingName) && (
          <p className="text-red-400 text-xs mt-1.5">{isEs ? 'Ingresa tu nombre' : 'Enter your name'}</p>
        )}
      </div>

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

      {/* Date */}
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
        />
        <button
          type="button"
          onClick={openDatePicker}
          className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg border transition-colors text-left ${
            form.date
              ? 'border-accent/40 bg-accent/5 text-white'
              : showError(missingDate)
                ? 'border-red-500/60 bg-dark-light text-gray-500'
                : 'border-gray-700 bg-dark-light text-gray-500 hover:border-gray-500'
          }`}
        >
          <HiOutlineCalendar className={`w-5 h-5 shrink-0 ${form.date ? 'text-accent' : showError(missingDate) ? 'text-red-400' : 'text-gray-500'}`} />
          <span className="text-base">
            {form.date
              ? formatDateLabel(form.date, locale)
              : (isEs ? 'Seleccionar fecha' : 'Select date')}
          </span>
        </button>
        {showError(missingDate) && (
          <p className="text-red-400 text-xs mt-1.5">{isEs ? 'Selecciona una fecha' : 'Select a date'}</p>
        )}
      </div>

      {/* Time — grouped by period */}
      <div className="w-full">
        <label className={`block text-sm font-medium mb-3 ${showError(missingTime) ? 'text-red-400' : 'text-gray-300'}`}>
          {t('time')}
        </label>
        <div className="space-y-3">
          {timeGroups.map((group) => (
            <div key={group.name.en}>
              <p className="text-white/30 text-[11px] uppercase tracking-wider mb-1.5 flex items-center gap-1.5">
                <span>{group.emoji}</span>
                {group.name[isEs ? 'es' : 'en']}
              </p>
              <div className="flex flex-wrap gap-1.5">
                {group.slots.map((slot) => {
                  const selected = form.time === slot.value;
                  return (
                    <button
                      key={slot.value}
                      type="button"
                      onClick={() => setForm({ ...form, time: slot.value })}
                      className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all border ${
                        selected
                          ? 'border-accent bg-accent/15 text-white'
                          : showError(missingTime)
                            ? 'border-red-500/30 text-white/40 hover:border-gray-500 hover:text-white/60'
                            : 'border-gray-700 text-white/40 hover:border-gray-500 hover:text-white/60'
                      }`}
                    >
                      {slot.label}
                    </button>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
        {showError(missingTime) && (
          <p className="text-red-400 text-xs mt-2">{isEs ? 'Selecciona una hora' : 'Select a time'}</p>
        )}
      </div>

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

      {/* Submit */}
      <div>
        <button
          type="submit"
          className={`w-full font-semibold rounded-lg transition-all duration-300 inline-flex items-center justify-center gap-2 px-8 py-4 text-lg ${
            isValid
              ? 'bg-accent hover:bg-accent-light text-white'
              : 'bg-accent/30 text-white/40 cursor-not-allowed'
          }`}
        >
          <FaWhatsapp className="w-5 h-5" />
          {t('submit')}
        </button>
        {tried && !isValid && (
          <p className="text-white/30 text-xs text-center mt-2">
            {isEs ? 'Completa los campos requeridos' : 'Fill in the required fields'}
          </p>
        )}
      </div>
    </form>
  );
}
