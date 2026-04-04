'use client';

import { useTranslations } from 'next-intl';
import { useTypedLocale } from '@/hooks/useTypedLocale';
import { usePathname } from '@/i18n/navigation';
import { getAssetPath } from '@/lib/constants';
import { getLocalePath } from '@/lib/navigation';
import { HiOutlineX } from 'react-icons/hi';
import { IoLanguage } from 'react-icons/io5';
import { IconType } from 'react-icons';

interface NavLink {
  href: string;
  labelKey: string;
  icon: IconType;
}

interface MobileMenuProps {
  isOpen: boolean;
  onClose: () => void;
  navLinks: NavLink[];
  switchLocale: () => void;
}

export default function MobileMenu({ isOpen, onClose, navLinks, switchLocale }: MobileMenuProps) {
  const t = useTranslations('nav');
  const tLang = useTranslations('lang');
  const pathname = usePathname();
  const locale = useTypedLocale();

  const isActive = (href: string) => {
    if (href === '/') return pathname === '/';
    if (href === '/#menu') return false;
    return pathname.startsWith(href.replace(/\/$/, ''));
  };

  const getHref = (href: string) => {
    if (href === '/#menu') return getLocalePath('/', locale) + '#menu';
    return getLocalePath(href, locale);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[60] bg-dark flex flex-col">
      <div className="flex items-center justify-between p-6">
        <div className="flex items-center gap-3">
          <img
            src={getAssetPath('/logo-company.webp')}
            alt="Baladar Gastro Bar"
            width={40}
            height={40}
            className="w-10 h-10 rounded-full"
          />
          <span className="text-white font-bold text-xl">Baladar</span>
        </div>
        <button
          onClick={onClose}
          className="p-2 text-gray-300 hover:text-white transition-colors"
          aria-label="Close menu"
        >
          <HiOutlineX className="w-8 h-8" />
        </button>
      </div>

      <nav className="flex-1 flex flex-col justify-center px-8 gap-2">
        {navLinks.map((link) => {
          const Icon = link.icon;
          const active = isActive(link.href);

          return (
            <a
              key={link.labelKey}
              href={getHref(link.href)}
              onClick={onClose}
              className={`flex items-center gap-4 px-6 py-5 rounded-xl text-xl font-semibold transition-colors ${
                active
                  ? 'text-accent bg-accent/10 border-l-4 border-accent'
                  : 'text-gray-200 hover:text-white hover:bg-white/5'
              }`}
            >
              <Icon className="w-7 h-7" />
              {t(link.labelKey)}
            </a>
          );
        })}
      </nav>

      <div className="p-8">
        <button
          onClick={() => {
            switchLocale();
            onClose();
          }}
          className="w-full flex items-center justify-center gap-2 py-4 rounded-xl bg-dark-light text-gray-300 hover:text-white text-lg font-medium transition-colors"
        >
          <IoLanguage className="w-6 h-6" />
          {tLang('switch')}
        </button>
      </div>
    </div>
  );
}
