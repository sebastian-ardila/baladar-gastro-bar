'use client';

import { useTranslations, useLocale } from 'next-intl';
import { Link } from '@/i18n/navigation';
import { restaurant } from '@/data/restaurant';
import { FaInstagram, FaWhatsapp } from 'react-icons/fa';
import { HiOutlineEnvelope, HiOutlineMapPin } from 'react-icons/hi2';

export default function Footer() {
  const t = useTranslations('footer');
  const locale = useLocale() as 'es' | 'en';
  const basePath = process.env.NEXT_PUBLIC_BASE_PATH || '';

  return (
    <footer className="bg-dark-light/30">
      {/* Top accent line */}
      <div className="h-px bg-gradient-to-r from-transparent via-white/10 to-transparent" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Main content */}
        <div className="py-14 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 lg:gap-8">

          {/* Brand column */}
          <div className="lg:col-span-1">
            <Link href="/">
              <img
                src={`${basePath}/logo-company-2.webp`}
                alt="Baladar Gastro Bar"
                width={140}
                height={50}
                className="h-14 w-auto mb-5 opacity-90 hover:opacity-100 transition-opacity"
              />
            </Link>
            <div className="flex items-start gap-2 mb-2">
              <HiOutlineMapPin className="w-4 h-4 mt-0.5 shrink-0 text-white/20" />
              <p className="text-white/40 text-sm leading-relaxed">
                {restaurant.address}
                <span className="block text-white/25 text-xs mt-0.5">
                  ({restaurant.addressSubtitle[locale]})
                </span>
              </p>
            </div>
            <p className="text-white/30 text-xs mt-3 tracking-wide">
              {t('delivery')}
            </p>
          </div>

          {/* Hours column */}
          <div>
            <h4 className="text-white/50 text-[11px] font-medium uppercase tracking-[0.2em] mb-5">
              {t('hours')}
            </h4>
            <div className="space-y-3">
              {restaurant.schedule.map((s, i) => {
                const isClosed = s.hours[locale] === 'Cerrado' || s.hours[locale] === 'Closed';
                return (
                  <div key={i} className="flex justify-between items-baseline gap-4">
                    <span className="text-white/35 text-sm">{s.days[locale]}</span>
                    <span className="text-sm whitespace-nowrap" style={{ color: isClosed ? 'rgba(255,255,255,0.2)' : 'rgba(255,255,255,0.55)' }}>
                      {s.hours[locale]}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Quick links */}
          <div>
            <h4 className="text-white/50 text-[11px] font-medium uppercase tracking-[0.2em] mb-5">
              Menu
            </h4>
            <nav className="space-y-3">
              {[
                { href: '/#menu', label: locale === 'es' ? 'Nuestra Carta' : 'Our Menu' },
                { href: '/reservas', label: locale === 'es' ? 'Reservar Mesa' : 'Book a Table' },
                { href: '/horarios', label: locale === 'es' ? 'Horarios' : 'Hours' },
                { href: '/historia', label: locale === 'es' ? 'Historia' : 'Our Story' },
                { href: '/contacto', label: locale === 'es' ? 'Contacto' : 'Contact' },
              ].map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className="block text-white/35 text-sm hover:text-white/70 transition-colors"
                >
                  {item.label}
                </Link>
              ))}
            </nav>
          </div>

          {/* Connect column */}
          <div>
            <h4 className="text-white/50 text-[11px] font-medium uppercase tracking-[0.2em] mb-5">
              {t('followUs')}
            </h4>
            <div className="space-y-3">
              <a
                href={restaurant.instagramUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-3 text-white/35 hover:text-white/70 transition-colors"
              >
                <FaInstagram className="w-4 h-4" />
                <span className="text-sm">{restaurant.instagram}</span>
              </a>
              <a
                href={`https://wa.me/${restaurant.whatsappNumber}`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-3 text-white/35 hover:text-white/70 transition-colors"
              >
                <FaWhatsapp className="w-4 h-4" />
                <span className="text-sm">{restaurant.whatsapp}</span>
              </a>
              <a
                href={`mailto:${restaurant.email}`}
                className="flex items-center gap-3 text-white/35 hover:text-white/70 transition-colors"
              >
                <HiOutlineEnvelope className="w-4 h-4" />
                <span className="text-sm">{restaurant.email}</span>
              </a>
            </div>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="h-px bg-white/5" />
        <div className="py-5 flex flex-col sm:flex-row items-center justify-between gap-2">
          <p className="text-white/20 text-xs">&copy; 2026 Baladar Gastro Bar. {t('rights')}.</p>
          <p className="text-white/15 text-xs">
            {t('madeBy')}{' '}
            <a
              href="https://sebastianardila.com"
              target="_blank"
              rel="noopener noreferrer"
              className="text-white/25 hover:text-white/50 transition-colors"
            >
              sebastianardila.com
            </a>
          </p>
        </div>
      </div>
    </footer>
  );
}
