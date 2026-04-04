'use client';

import { useState, useEffect } from 'react';
import { useTranslations } from 'next-intl';
import { useTypedLocale } from '@/hooks/useTypedLocale';
import { usePathname } from '@/i18n/navigation';
import { useCart } from '@/context/CartContext';
import { getAssetPath } from '@/lib/constants';
import { getLocalePath } from '@/lib/navigation';
import { HiOutlineShoppingCart, HiOutlineMenu } from 'react-icons/hi';
import {
  HiOutlineBookOpen,
  HiOutlineCalendar,
  HiOutlineClock,
  HiOutlineHeart,
  HiOutlineEnvelope,
} from 'react-icons/hi2';
import { IoLanguage } from 'react-icons/io5';
import MobileMenu from './MobileMenu';

const navLinks = [
  { href: '/#menu', labelKey: 'menu', icon: HiOutlineBookOpen },
  { href: '/reservas/', labelKey: 'reservations', icon: HiOutlineCalendar },
  { href: '/horarios/', labelKey: 'schedule', icon: HiOutlineClock },
  { href: '/historia/', labelKey: 'history', icon: HiOutlineHeart },
  { href: '/contacto/', labelKey: 'contact', icon: HiOutlineEnvelope },
];

export default function Navbar() {
  const t = useTranslations('nav');
  const tLang = useTranslations('lang');
  const locale = useTypedLocale();
  const pathname = usePathname();
  const { totalItems, openCart } = useCart();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [menuVisible, setMenuVisible] = useState(false);

  useEffect(() => {
    const el = document.getElementById('menu');
    if (!el) return;

    const observer = new IntersectionObserver(
      ([entry]) => setMenuVisible(entry.isIntersecting),
      { threshold: 0.1 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, [pathname]);

  const switchLocale = () => {
    const newLocale = locale === 'es' ? 'en' : 'es';
    window.location.href = getLocalePath(pathname === '/' ? '/' : `${pathname}/`, newLocale);
  };

  const isActive = (href: string) => {
    if (href === '/#menu') return menuVisible && pathname === '/';
    if (href === '/') return pathname === '/';
    return pathname.startsWith(href.replace(/\/$/, ''));
  };

  // /#menu is a hash link on the home page — handle with scroll if already on home
  const handleMenuClick = (e: React.MouseEvent) => {
    if (pathname === '/') {
      e.preventDefault();
      const el = document.getElementById('menu');
      if (el) el.scrollIntoView({ behavior: 'smooth' });
    }
    // Otherwise, the <a> tag navigates to /{locale}/#menu (full reload)
  };

  const getHref = (href: string) => {
    if (href === '/#menu') return getLocalePath('/', locale) + '#menu';
    return getLocalePath(href, locale);
  };

  const linkClass = (active: boolean) =>
    `relative flex items-center gap-1.5 px-3 py-5 text-sm font-medium transition-colors ${
      active
        ? 'text-white'
        : 'text-gray-400 hover:text-white'
    }`;

  const activeBar = <span className="absolute bottom-0 left-3 right-3 h-[2px] bg-emerald-500" />;

  return (
    <>
      <nav className="fixed top-0 left-0 right-0 z-50 bg-dark border-b border-gray-800/40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-14">
            {/* Logo */}
            <a href={getLocalePath('/', locale)} className="shrink-0">
              <img
                src={getAssetPath('/logo-company-mini.webp')}
                alt="Baladar Gastro Bar"
                width={40}
                height={40}
                className="h-10 w-auto nav-logo"
              />
            </a>

            {/* Desktop Nav */}
            <div className="hidden lg:flex items-center h-14">
              {navLinks.map((link) => {
                const Icon = link.icon;
                const active = isActive(link.href);
                return (
                  <a
                    key={link.labelKey}
                    href={getHref(link.href)}
                    onClick={link.href === '/#menu' ? handleMenuClick : undefined}
                    className={linkClass(active)}
                  >
                    <Icon className="w-4 h-4" />
                    {t(link.labelKey)}
                    {active && activeBar}
                  </a>
                );
              })}
            </div>

            {/* Right actions */}
            <div className="flex items-center gap-1">
              <button
                onClick={switchLocale}
                className="flex items-center gap-1 px-3 py-2 text-sm text-gray-400 hover:text-white transition-colors"
                aria-label="Switch language"
              >
                <IoLanguage className="w-4 h-4" />
                <span className="font-medium">{tLang('switch')}</span>
              </button>

              <button
                onClick={openCart}
                className="relative p-2 text-gray-400 hover:text-white transition-colors"
                aria-label="Cart"
              >
                <HiOutlineShoppingCart className="w-5 h-5" />
                {totalItems > 0 && (
                  <span className="absolute -top-0.5 -right-0.5 bg-white text-dark text-[10px] w-4 h-4 rounded-full flex items-center justify-center font-bold">
                    {totalItems}
                  </span>
                )}
              </button>

              <button
                onClick={() => setMobileOpen(true)}
                className="lg:hidden p-2 text-gray-400 hover:text-white transition-colors"
                aria-label="Open menu"
              >
                <HiOutlineMenu className="w-5 h-5" />
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
