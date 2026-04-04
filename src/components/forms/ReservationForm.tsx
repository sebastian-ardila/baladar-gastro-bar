'use client';

import { useState, useRef, useMemo } from 'react';
import { useTranslations, useLocale } from 'next-intl';
import { buildReservationMessage, buildWhatsAppUrl } from '@/lib/whatsapp';
import { FaWhatsapp } from 'react-icons/fa';
import { HiPlus, HiMinus } from 'react-icons/hi';
import { HiOutlineCalendar } from 'react-icons/hi2';
import { PiSunFill, PiCloudSunFill, PiMoonFill } from 'react-icons/pi';
import { IconType } from 'react-icons';
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

interface TimeSlot { value: string; label: string }
interface TimeGroup { name: { es: string; en: string }; icon: IconType; slots: TimeSlot[] }

function getTimeGroups(dateStr: string): TimeGroup[] {
  if (!dateStr) return [];
  const [year, month, day] = dateStr.split('-').map(Number);
  const dow = new Date(year, month - 1, day).getDay();
  if (dow === 0) return []; // Sunday — closed

  const startHour = dow === 6 ? 12 : 11;
  const endHour = dow === 6 ? 24 : 21;

  const morning: TimeSlot[] = [];
  const afternoon: TimeSlot[] = [];
  const evening: TimeSlot[] = [];

  for (let h = startHour; h < endHour; h++) {
    const h12 = h > 12 ? h - 12 : h === 0 ? 12 : h;
    const ampm = h >= 12 && h < 24 ? 'PM' : 'AM';
    const slot: TimeSlot = { value: `${h12}:00 ${ampm}`, label: `${h12}:00` };
    if (h < 12) morning.push(slot);
    else if (h < 18) afternoon.push(slot);
    else evening.push(slot);
  }

  const groups: TimeGroup[] = [];
  if (morning.length) groups.push({ name: { es: 'Mañana', en: 'Morning' }, icon: PiSunFill, slots: morning });
  if (afternoon.length) groups.push({ name: { es: 'Tarde', en: 'Afternoon' }, icon: PiCloudSunFill, slots: afternoon });
  if (evening.length) groups.push({ name: { es: 'Noche', en: 'Evening' }, icon: PiMoonFill, slots: evening });
  return groups;
}

function isClosed(dateStr: string): boolean {
  if (!dateStr) return false;
  const [year, month, day] = dateStr.split('-').map(Number);
  return new Date(year, month - 1, day).getDay() === 0;
}

/* ── Component ── */

export default function ReservationForm() {
  const t = useTranslations('reservation');
  const locale = useLocale();
  const isEs = locale === 'es';
  const dateInputRef = useRef<HTMLInputElement>(null);

  const [form, setForm] = useState({ name: '', guests: '2', date: '', time: '', comments: '' });
  const [tried, setTried] = useState(false);

  const guestsNum = parseInt(form.guests) || 1;
  const closed = useMemo(() => isClosed(form.date), [form.date]);
  const timeGroups = useMemo(() => getTimeGroups(form.date), [form.date]);

  const missingName = !form.name.trim();
  const missingDate = !form.date || closed;
  const missingTime = !form.time;
  const isValid = !missingName && !missingDate && !missingTime;

  const today = new Date().toISOString().split('T')[0];

  const handleDateChange = (dateStr: string) => {
    const groups = getTimeGroups(dateStr);
    const allSlots = groups.flatMap((g) => g.slots);
    const timeStillValid = allSlots.some((s) => s.value === form.time);
    setForm({ ...form, date: dateStr, time: timeStillValid ? form.time : '' });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setTried(true);
    if (!isValid) return;
    const formattedDate = formatDateLabel(form.date, locale);
    const message = buildReservationMessage(
      { name: form.name, guests: form.guests, date: formattedDate, time: form.time, comments: form.comments },
      locale,
    );
    window.open(buildWhatsAppUrl(message), '_blank');
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
          autoComplete="name"
          value={form.name}
          onChange={(e) => setForm({ ...form, name: e.target.value })}
          className={showError(missingName) ? 'border-red-500/60 focus:border-red-500 focus:ring-red-500/30' : ''}
        />
        {showError(missingName) && (
          <p className="text-red-400 text-xs mt-1.5">{isEs ? 'Ingresa tu nombre' : 'Enter your name'}</p>
        )}
      </div>

      {/* Guests */}
      <div className="w-full">
        <label className="block text-sm font-medium text-gray-300 mb-2">{t('guests')}</label>
        <div className="flex items-center gap-4">
          <button type="button" onClick={() => setForm({ ...form, guests: String(Math.max(1, guestsNum - 1)) })} className="w-10 h-10 rounded-lg bg-dark border border-gray-700 flex items-center justify-center text-white hover:border-accent transition-colors">
            <HiMinus className="w-4 h-4" />
          </button>
          <span className="text-white font-bold text-xl w-8 text-center">{guestsNum}</span>
          <button type="button" onClick={() => setForm({ ...form, guests: String(Math.min(20, guestsNum + 1)) })} className="w-10 h-10 rounded-lg bg-dark border border-gray-700 flex items-center justify-center text-white hover:border-accent transition-colors">
            <HiPlus className="w-4 h-4" />
          </button>
          <span className="text-gray-500 text-sm">{guestsNum === 1 ? (isEs ? 'persona' : 'person') : (isEs ? 'personas' : 'people')}</span>
        </div>
      </div>

      {/* Date */}
      <div className="w-full">
        <label className="block text-sm font-medium text-gray-300 mb-2">{t('date')}</label>
        <input ref={dateInputRef} type="date" min={today} value={form.date} onChange={(e) => handleDateChange(e.target.value)} className="sr-only" tabIndex={-1} />
        <button
          type="button"
          onClick={openDatePicker}
          className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg border transition-colors text-left ${
            closed
              ? 'border-orange-500/60 bg-orange-500/5 text-orange-300'
              : form.date
                ? 'border-accent/40 bg-accent/5 text-white'
                : showError(missingDate)
                  ? 'border-red-500/60 bg-dark-light text-gray-500'
                  : 'border-gray-700 bg-dark-light text-gray-500 hover:border-gray-500'
          }`}
        >
          <HiOutlineCalendar className={`w-5 h-5 shrink-0 ${closed ? 'text-orange-400' : form.date ? 'text-accent' : showError(missingDate) ? 'text-red-400' : 'text-gray-500'}`} />
          <span className="text-base">
            {form.date ? formatDateLabel(form.date, locale) : (isEs ? 'Seleccionar fecha' : 'Select date')}
          </span>
        </button>
        {closed && (
          <p className="text-orange-400 text-xs mt-1.5">
            {isEs ? 'No hay servicio este día. Selecciona otra fecha.' : 'No service on this day. Select another date.'}
          </p>
        )}
        {showError(missingDate) && !closed && (
          <p className="text-red-400 text-xs mt-1.5">{isEs ? 'Selecciona una fecha' : 'Select a date'}</p>
        )}
      </div>

      {/* Time */}
      <div className="w-full">
        <label className={`block text-sm font-medium mb-3 ${showError(missingTime) && !closed ? 'text-red-400' : 'text-gray-300'}`}>
          {t('time')}
        </label>

        {!form.date ? (
          <button type="button" onClick={openDatePicker} className="w-full flex items-center gap-3 px-4 py-3 rounded-lg border border-gray-700 bg-dark-light text-gray-500 hover:border-gray-500 transition-colors text-left text-sm">
            <HiOutlineCalendar className="w-4 h-4 shrink-0" />
            {isEs ? 'Selecciona una fecha primero' : 'Select a date first'}
          </button>
        ) : closed ? (
          <p className="text-orange-400/60 text-sm px-4 py-3 rounded-lg border border-orange-500/20 bg-orange-500/5">
            {isEs ? 'No hay horarios disponibles para este día' : 'No available times for this day'}
          </p>
        ) : (
          <div className="space-y-3">
            {timeGroups.map((group) => {
              const Icon = group.icon;
              return (
                <div key={group.name.en}>
                  <p className="text-white/30 text-[11px] uppercase tracking-wider mb-1.5 flex items-center gap-1.5">
                    <Icon className="w-3 h-3" />
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
              );
            })}
          </div>
        )}

        {showError(missingTime) && form.date && !closed && (
          <p className="text-red-400 text-xs mt-2">{isEs ? 'Selecciona una hora' : 'Select a time'}</p>
        )}
      </div>

      {/* Comments */}
      <div className="w-full">
        <label htmlFor="res-comments" className="block text-sm font-medium text-gray-300 mb-1">{t('comments')}</label>
        <textarea
          id="res-comments" rows={3} placeholder={t('commentsPlaceholder')} value={form.comments}
          onChange={(e) => setForm({ ...form, comments: e.target.value })}
          className="w-full bg-dark-light border border-gray-700 rounded-lg px-3 sm:px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-accent focus:ring-1 focus:ring-accent transition-colors text-base resize-none"
        />
      </div>

      {/* Submit */}
      <div>
        <button
          type="submit"
          className={`w-full font-semibold rounded-lg transition-all duration-300 inline-flex items-center justify-center gap-2 px-8 py-4 text-lg ${
            isValid ? 'bg-accent hover:bg-accent-light text-white' : 'bg-accent/30 text-white/40 cursor-not-allowed'
          }`}
        >
          <FaWhatsapp className="w-5 h-5" />
          {t('submit')}
        </button>
        {tried && !isValid && (
          <p className="text-white/30 text-xs text-center mt-2">{isEs ? 'Completa los campos requeridos' : 'Fill in the required fields'}</p>
        )}
      </div>
    </form>
  );
}
