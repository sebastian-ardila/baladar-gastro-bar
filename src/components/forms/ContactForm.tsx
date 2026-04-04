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
  const isEs = locale === 'es';

  const [form, setForm] = useState({
    name: '',
    email: '',
    phone: '',
    interest: '',
    message: '',
  });
  const [tried, setTried] = useState(false);

  const missingName = !form.name.trim();
  const missingEmail = !form.email.trim();
  const missingInterest = !form.interest;
  const missingMessage = !form.message.trim();
  const isValid = !missingName && !missingEmail && !missingInterest && !missingMessage;

  const showError = (missing: boolean) => tried && missing;

  const interestOptions = [
    { value: '', label: isEs ? 'Seleccionar motivo' : 'Select reason' },
    { value: t('interests.franchise'), label: t('interests.franchise') },
    { value: t('interests.supplier'), label: t('interests.supplier') },
    { value: t('interests.collaboration'), label: t('interests.collaboration') },
    { value: t('interests.events'), label: t('interests.events') },
    { value: t('interests.birthday'), label: t('interests.birthday') },
    { value: t('interests.other'), label: t('interests.other') },
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setTried(true);
    if (!isValid) return;
    const message = buildContactMessage(form, locale);
    const url = buildWhatsAppUrl(message);
    window.open(url, '_blank');
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-5" noValidate>
      <div>
        <Input
          label={t('name')}
          id="contact-name"
          placeholder={t('namePlaceholder')}
          value={form.name}
          onChange={(e) => setForm({ ...form, name: e.target.value })}
          className={showError(missingName) ? 'border-red-500/60 focus:border-red-500 focus:ring-red-500/30' : ''}
        />
        {showError(missingName) && (
          <p className="text-red-400 text-xs mt-1.5">{isEs ? 'Ingresa tu nombre' : 'Enter your name'}</p>
        )}
      </div>

      <div>
        <Input
          label={t('email')}
          id="contact-email"
          type="email"
          placeholder={t('emailPlaceholder')}
          value={form.email}
          onChange={(e) => setForm({ ...form, email: e.target.value })}
          className={showError(missingEmail) ? 'border-red-500/60 focus:border-red-500 focus:ring-red-500/30' : ''}
        />
        {showError(missingEmail) && (
          <p className="text-red-400 text-xs mt-1.5">{isEs ? 'Ingresa tu email' : 'Enter your email'}</p>
        )}
      </div>

      <Input
        label={t('phone')}
        id="contact-phone"
        type="tel"
        placeholder={t('phonePlaceholder')}
        value={form.phone}
        onChange={(e) => setForm({ ...form, phone: e.target.value })}
      />

      <div>
        <Select
          label={t('interest')}
          id="contact-interest"
          options={interestOptions}
          value={form.interest}
          onChange={(e) => setForm({ ...form, interest: e.target.value })}
          className={showError(missingInterest) ? 'border-red-500/60 focus:border-red-500 focus:ring-red-500/30' : ''}
        />
        {showError(missingInterest) && (
          <p className="text-red-400 text-xs mt-1.5">{isEs ? 'Selecciona un motivo' : 'Select a reason'}</p>
        )}
      </div>

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
          className={`w-full bg-dark-light border rounded-lg px-3 sm:px-4 py-3 text-white placeholder-gray-500 focus:outline-none transition-colors text-base resize-none ${
            showError(missingMessage)
              ? 'border-red-500/60 focus:border-red-500 focus:ring-1 focus:ring-red-500/30'
              : 'border-gray-700 focus:border-accent focus:ring-1 focus:ring-accent'
          }`}
        />
        {showError(missingMessage) && (
          <p className="text-red-400 text-xs mt-1.5">{isEs ? 'Escribe tu mensaje' : 'Write your message'}</p>
        )}
      </div>

      <div>
        <Button type="submit" className="w-full" size="lg" disabled={!isValid}>
          <FaWhatsapp className="w-5 h-5" />
          {t('submit')}
        </Button>
        {tried && !isValid && (
          <p className="text-white/30 text-xs text-center mt-2">
            {isEs ? 'Completa los campos requeridos' : 'Fill in the required fields'}
          </p>
        )}
      </div>
    </form>
  );
}
