'use client';

import { useState } from 'react';
import { useTranslations, useLocale } from 'next-intl';
import { usePathname, useRouter, Link } from '@/i18n/navigation';
import { useCart } from '@/context/CartContext';
import { HiOutlineShoppingCart, HiOutlineMenu, HiOutlineX } from 'react-icons/hi';
import {
  HiOutlineHome,
  HiOutlineBookOpen,
  HiOutlineCalendar,
  HiOutlineClock,
  HiOutlineHeart,
  HiOutlineEnvelope,
} from 'react-icons/hi2';
import { IoLanguage } from 'react-icons/io5';
import MobileMenu from './MobileMenu';

const navLinks = [
  { href: '/', labelKey: 'home', icon: HiOutlineHome },
  { href: '/#menu', labelKey: 'menu', icon: HiOutlineBookOpen },
  { href: '/reservas', labelKey: 'reservations', icon: HiOutlineCalendar },
  { href: '/horarios', labelKey: 'schedule', icon: HiOutlineClock },
  { href: '/historia', labelKey: 'history', icon: HiOutlineHeart },
  { href: '/contacto', labelKey: 'contact', icon: HiOutlineEnvelope },
];

export default function Navbar() {
  const t = useTranslations('nav');
  const tLang = useTranslations('lang');
  const locale = useLocale();
  const pathname = usePathname();
  const router = useRouter();
  const { totalItems, openCart } = useCart();
  const [mobileOpen, setMobileOpen] = useState(false);

  const switchLocale = () => {
    const newLocale = locale === 'es' ? 'en' : 'es';
    router.replace(pathname, { locale: newLocale });
  };

  const isActive = (href: string) => {
    if (href === '/') return pathname === '/';
    if (href === '/#menu') return pathname === '/' && typeof window !== 'undefined' && window.location.hash === '#menu';
    return pathname.startsWith(href);
  };

  return (
    <>
      <nav className="fixed top-0 left-0 right-0 z-50 bg-dark/95 backdrop-blur-md border-b border-gray-800/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <Link href="/" className="flex items-center gap-2 shrink-0">
              <div className="w-8 h-8 bg-accent rounded-full flex items-center justify-center">
                <span className="text-white font-bold text-sm">B</span>
              </div>
              <span className="text-white font-bold text-lg hidden sm:block">Baladar</span>
            </Link>

            {/* Desktop Nav */}
            <div className="hidden lg:flex items-center gap-1">
              {navLinks.map((link) => {
                const Icon = link.icon;
                const active = isActive(link.href);
                return link.href === '/#menu' ? (
                  <a
                    key={link.labelKey}
                    href={`/${locale}/#menu`}
                    className={`flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                      active ? 'text-accent border-b-2 border-accent' : 'text-gray-300 hover:text-white hover:bg-white/5'
                    }`}
                  >
                    <Icon className="w-4 h-4" />
                    {t(link.labelKey)}
                  </a>
                ) : (
                  <Link
                    key={link.labelKey}
                    href={link.href}
                    className={`flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                      active ? 'text-accent border-b-2 border-accent' : 'text-gray-300 hover:text-white hover:bg-white/5'
                    }`}
                  >
                    <Icon className="w-4 h-4" />
                    {t(link.labelKey)}
                  </Link>
                );
              })}
            </div>

            {/* Right actions */}
            <div className="flex items-center gap-2">
              <button
                onClick={switchLocale}
                className="flex items-center gap-1 px-3 py-2 text-sm text-gray-300 hover:text-white transition-colors"
                aria-label="Switch language"
              >
                <IoLanguage className="w-4 h-4" />
                <span className="font-medium">{tLang('switch')}</span>
              </button>

              <button
                onClick={openCart}
                className="relative p-2 text-gray-300 hover:text-white transition-colors"
                aria-label="Cart"
              >
                <HiOutlineShoppingCart className="w-6 h-6" />
                {totalItems > 0 && (
                  <span className="absolute -top-1 -right-1 bg-accent text-white text-xs w-5 h-5 rounded-full flex items-center justify-center font-bold">
                    {totalItems}
                  </span>
                )}
              </button>

              <button
                onClick={() => setMobileOpen(true)}
                className="lg:hidden p-2 text-gray-300 hover:text-white transition-colors"
                aria-label="Open menu"
              >
                <HiOutlineMenu className="w-6 h-6" />
              </button>
            </div>
          </div>
        </div>
      </nav>

      <MobileMenu
        isOpen={mobileOpen}
        onClose={() => setMobileOpen(false)}
        navLinks={navLinks}
        switchLocale={switchLocale}
      />
    </>
  );
}
