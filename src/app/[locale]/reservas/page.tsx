'use client';

import { useTranslations, useLocale } from 'next-intl';
import { restaurant } from '@/data/restaurant';
import ReservationForm from '@/components/forms/ReservationForm';
import { HiOutlineMapPin, HiOutlineClock } from 'react-icons/hi2';

export default function ReservasPage() {
  const t = useTranslations('reservation');
  const locale = useLocale() as 'es' | 'en';

  return (
    <div className="pt-28 pb-16 min-h-screen">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-3xl sm:text-4xl font-bold text-white text-center mb-2">
          {t('title')}
        </h1>
        <p className="text-gray-400 text-center mb-10">{t('subtitle')}</p>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Info cards */}
          <div className="space-y-4">
            <div className="bg-dark-light rounded-xl p-5 border border-gray-800">
              <div className="flex items-center gap-2 mb-3">
                <HiOutlineClock className="w-5 h-5 text-accent" />
                <h3 className="text-white font-semibold">{t('hours')}</h3>
              </div>
              {restaurant.schedule.map((s, i) => (
                <div key={i} className="flex justify-between text-sm py-1.5">
                  <span className="text-gray-400">{s.days[locale]}</span>
                  <span className={s.hours[locale] === 'Cerrado' || s.hours[locale] === 'Closed' ? 'text-red-400' : 'text-accent'}>
                    {s.hours[locale]}
                  </span>
                </div>
              ))}
            </div>

            <div className="bg-dark-light rounded-xl p-5 border border-gray-800">
              <div className="flex items-center gap-2 mb-3">
                <HiOutlineMapPin className="w-5 h-5 text-accent" />
                <h3 className="text-white font-semibold">{t('location')}</h3>
              </div>
              <p className="text-gray-400 text-sm">{restaurant.address}</p>
              <p className="text-gray-500 text-xs mt-1">({restaurant.addressSubtitle[locale]})</p>
            </div>
          </div>

          {/* Form */}
          <div className="lg:col-span-2 bg-dark-card rounded-2xl p-6 sm:p-8 border border-gray-800">
            <ReservationForm />
          </div>
        </div>
      </div>
    </div>
  );
}
