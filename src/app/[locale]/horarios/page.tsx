'use client';

import { useTranslations, useLocale } from 'next-intl';
import { restaurant } from '@/data/restaurant';
import { Link } from '@/i18n/navigation';
import { buildWhatsAppUrl } from '@/lib/whatsapp';
import { HiOutlineMapPin, HiOutlineClock } from 'react-icons/hi2';
import { FaWhatsapp } from 'react-icons/fa';
import Button from '@/components/ui/Button';

export default function HorariosPage() {
  const t = useTranslations('schedule');
  const locale = useLocale() as 'es' | 'en';

  return (
    <div className="pt-24 pb-16 min-h-screen">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-3xl sm:text-4xl font-bold text-white text-center mb-2">
          {t('title')}
        </h1>
        <p className="text-gray-400 text-center mb-10">{t('subtitle')}</p>

        {/* Schedule cards */}
        <div className="space-y-4 mb-12">
          {restaurant.schedule.map((s, i) => {
            const isClosed = s.hours[locale] === 'Cerrado' || s.hours[locale] === 'Closed';
            return (
              <div
                key={i}
                className={`bg-dark-light rounded-2xl p-6 sm:p-8 border ${
                  isClosed ? 'border-gray-800/50' : 'border-gray-800'
                } flex items-center justify-between`}
              >
                <div className="flex items-center gap-4">
                  <HiOutlineClock className={`w-8 h-8 ${isClosed ? 'text-gray-600' : 'text-gray-400'}`} />
                  <h3 className="text-white font-bold text-lg sm:text-xl">
                    {s.days[locale]}
                  </h3>
                </div>
                <span className={`font-bold text-lg sm:text-xl ${isClosed ? 'text-gray-600' : 'text-gray-300'}`}>
                  {s.hours[locale]}
                </span>
              </div>
            );
          })}
        </div>

        {/* Location */}
        <div className="bg-dark-card rounded-2xl p-6 sm:p-8 border border-gray-800 mb-8 text-center">
          <HiOutlineMapPin className="w-10 h-10 text-gray-500 mx-auto mb-4" />
          <h3 className="text-white font-bold text-xl mb-2">{t('location')}</h3>
          <p className="text-gray-400">{restaurant.address}</p>
          <p className="text-gray-500 text-sm mt-1">({restaurant.addressSubtitle[locale]})</p>
          <p className="text-gray-400 font-medium mt-4">{t('delivery')}</p>
        </div>

        {/* CTA buttons */}
        <div className="flex flex-col sm:flex-row gap-4 items-center justify-center">
          <a
            href={buildWhatsAppUrl(locale === 'es' ? 'Hola! Quiero hacer un pedido' : 'Hi! I want to place an order')}
            target="_blank"
            rel="noopener noreferrer"
          >
            <Button size="lg">
              <FaWhatsapp className="w-5 h-5" />
              {t('orderWhatsApp')}
            </Button>
          </a>
          <Link
            href="/reservas"
            className="px-6 py-3 text-base font-medium text-white/70 hover:text-white transition-all underline underline-offset-4 decoration-white/30 hover:decoration-white/70"
          >
            {t('reserveTable')}
          </Link>
        </div>
      </div>
    </div>
  );
}
