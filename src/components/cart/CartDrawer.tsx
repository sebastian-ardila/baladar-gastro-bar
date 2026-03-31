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
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/60 z-[70] backdrop-blur-sm"
        onClick={closeCart}
      />

      {/* Drawer */}
      <div className="fixed top-0 right-0 h-full w-full sm:w-[420px] bg-dark z-[80] flex flex-col shadow-2xl border-l border-gray-800">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-800">
          <h2 className="text-xl font-bold text-white">{t('title')}</h2>
          <button
            onClick={closeCart}
            className="p-2 text-gray-400 hover:text-white transition-colors rounded-lg hover:bg-white/5"
            aria-label={t('close')}
          >
            <HiOutlineX className="w-6 h-6" />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto">
          {step === 1 ? <CartStep1 /> : <CartStep2 />}
        </div>
      </div>
    </>
  );
}
