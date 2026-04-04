'use client';

import { useTranslations } from 'next-intl';
import { useTypedLocale } from '@/hooks/useTypedLocale';
import { usePathname } from '@/i18n/navigation';
import { getLocalePath } from '@/lib/navigation';
import { HiOutlineHome, HiChevronRight } from 'react-icons/hi';
import {
  HiOutlineCalendar,
  HiOutlineClock,
  HiOutlineHeart,
  HiOutlineEnvelope,
} from 'react-icons/hi2';

const pageIcons: Record<string, React.ElementType> = {
  reservas: HiOutlineCalendar,
  horarios: HiOutlineClock,
  historia: HiOutlineHeart,
  contacto: HiOutlineEnvelope,
};

const pageKeys: Record<string, string> = {
  reservas: 'reservations',
  horarios: 'schedule',
  historia: 'history',
  contacto: 'contact',
};

export default function Breadcrumb() {
  const t = useTranslations('nav');
  const pathname = usePathname();
  const locale = useTypedLocale();

  if (pathname === '/' || pathname === '') return null;

  const segment = pathname.replace('/', '').split('/')[0];
  const Icon = pageIcons[segment];
  const labelKey = pageKeys[segment];

  if (!labelKey) return null;

  return (
    <div className="fixed top-14 left-0 right-0 z-40 bg-dark/90 backdrop-blur-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center gap-2 py-1.5 text-xs">
          <a
            href={getLocalePath('/', locale)}
            className="flex items-center gap-1 text-gray-400 hover:text-white transition-colors"
          >
            <HiOutlineHome className="w-4 h-4" />
            {t('home')}
          </a>
          <HiChevronRight className="w-3 h-3 text-gray-600" />
          <span className="flex items-center gap-1 text-emerald-400/70 font-medium">
            {Icon && <Icon className="w-4 h-4" />}
            {t(labelKey)}
          </span>
        </div>
      </div>
    </div>
  );
}
