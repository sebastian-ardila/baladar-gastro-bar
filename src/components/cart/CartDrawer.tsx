'use client';

import { useTranslations } from 'next-intl';
import { useCart } from '@/context/CartContext';
import { HiOutlineX } from 'react-icons/hi';
import CartStep1 from './CartStep1';
import CartStep2 from './CartStep2';

export default function CartDrawer() {
  const t = useTranslations('cart');
  const { isOpen, closeCart, step } = useCart();

  if (!isOpen) return null;

  return (
    <>
      <div
        className="fixed inset-0 bg-black/80 z-[70]"
        onClick={closeCart}
      />
      <div className="fixed top-0 right-0 h-full w-full sm:w-[400px] bg-dark z-[80] flex flex-col shadow-2xl">
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4">
          <h2 className="text-white font-bold text-lg">{t('title')}</h2>
          <button
            onClick={closeCart}
            className="p-1.5 text-white/30 hover:text-white transition-colors rounded-lg hover:bg-white/5"
            aria-label={t('close')}
          >
            <HiOutlineX className="w-5 h-5" />
          </button>
        </div>
        <div className="h-px bg-white/5" />
        <div className="flex-1 overflow-y-auto">
          {step === 1 ? <CartStep1 /> : <CartStep2 />}
        </div>
      </div>
    </>
  );
}
