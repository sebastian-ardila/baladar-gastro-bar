'use client';

import { useTranslations, useLocale } from 'next-intl';
import { restaurant } from '@/data/restaurant';
import { FaInstagram, FaWhatsapp, FaEnvelope } from 'react-icons/fa';
import { HiOutlineMapPin } from 'react-icons/hi2';

export default function Footer() {
  const t = useTranslations('footer');
  const locale = useLocale() as 'es' | 'en';

  return (
    <footer className="bg-dark-light border-t border-gray-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
          {/* Column 1: Logo + Address */}
          <div>
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 bg-accent rounded-full flex items-center justify-center">
                <span className="text-white font-bold text-lg">B</span>
              </div>
              <div>
                <h3 className="text-white font-bold text-xl">Baladar</h3>
                <p className="text-accent text-sm font-medium">{t('gastroBar')}</p>
              </div>
            </div>
            <div className="flex items-start gap-2 text-gray-400 mt-4">
              <HiOutlineMapPin className="w-5 h-5 mt-0.5 shrink-0 text-accent" />
              <div>
                <p>{restaurant.address}</p>
                <p className="text-sm text-gray-500">
                  ({restaurant.addressSubtitle[locale]})
                </p>
              </div>
            </div>
            <p className="text-accent font-medium mt-3 text-sm">
              {t('delivery')}
            </p>
          </div>

          {/* Column 2: Hours */}
          <div>
            <h4 className="text-white font-semibold text-lg mb-4">{t('hours')}</h4>
            <div className="space-y-3">
              {restaurant.schedule.map((s, i) => (
                <div
                  key={i}
                  className="bg-dark rounded-lg px-4 py-3 border border-gray-800"
                >
                  <p className="text-white font-medium text-sm">{s.days[locale]}</p>
                  <p className={`text-sm mt-1 ${s.hours[locale] === 'Cerrado' || s.hours[locale] === 'Closed' ? 'text-red-400' : 'text-accent'}`}>
                    {s.hours[locale]}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* Column 3: Social */}
          <div>
            <h4 className="text-white font-semibold text-lg mb-4">{t('followUs')}</h4>
            <div className="space-y-3">
              <a
                href={restaurant.instagramUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-3 text-gray-400 hover:text-white transition-colors"
              >
                <FaInstagram className="w-5 h-5 text-pink-400" />
                <span>{restaurant.instagram}</span>
              </a>
              <a
                href={`https://wa.me/${restaurant.whatsappNumber}`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-3 text-gray-400 hover:text-white transition-colors"
              >
                <FaWhatsapp className="w-5 h-5 text-green-400" />
                <span>{restaurant.whatsapp}</span>
              </a>
              <a
                href={`mailto:${restaurant.email}`}
                className="flex items-center gap-3 text-gray-400 hover:text-white transition-colors"
              >
                <FaEnvelope className="w-5 h-5 text-blue-400" />
                <span>{restaurant.email}</span>
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* Copyright bar */}
      <div className="border-t border-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex flex-col sm:flex-row items-center justify-between gap-2 text-sm text-gray-500">
          <p>&copy; 2026 Baladar Gastro Bar. {t('rights')}.</p>
          <p>
            {t('madeBy')}{' '}
            <a
              href="https://sebastianardila.com"
              target="_blank"
              rel="noopener noreferrer"
              className="text-accent hover:text-accent-light transition-colors"
            >
              sebastianardila.com
            </a>
          </p>
        </div>
      </div>
    </footer>
  );
}
