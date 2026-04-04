'use client';

import { useTypedLocale } from '@/hooks/useTypedLocale';
import { useCart } from '@/context/CartContext';
import { formatPrice } from '@/lib/utils';
import { HiOutlineShoppingCart } from 'react-icons/hi';

export default function FloatingCartBadge() {
  const locale = useTypedLocale();
  const { totalItems, subtotal, openCart } = useCart();

  if (totalItems === 0) return null;

  return (
    <button
      onClick={openCart}
      className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 flex items-center gap-3 bg-accent hover:bg-accent-light text-white pl-4 pr-5 py-3 rounded-full shadow-lg shadow-accent/30 transition-all active:scale-95"
    >
      <div className="relative">
        <HiOutlineShoppingCart className="w-5 h-5" />
        <span className="absolute -top-2 -right-2 bg-white text-dark text-[10px] w-4 h-4 rounded-full flex items-center justify-center font-bold">
          {totalItems}
        </span>
      </div>
      <span className="font-semibold text-sm">
        {locale === 'es' ? 'Ver carrito' : 'View cart'}
      </span>
      <span className="text-white/70 text-sm font-medium">
        {formatPrice(subtotal)}
      </span>
    </button>
  );
}
