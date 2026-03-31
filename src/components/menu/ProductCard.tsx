'use client';

import { useState } from 'react';
import { useTranslations, useLocale } from 'next-intl';
import { MenuItem } from '@/types/menu';
import { CartItem } from '@/types/cart';
import { useCart } from '@/context/CartContext';
import { formatPrice } from '@/lib/utils';
import { HiOutlineEye, HiPlus, HiMinus } from 'react-icons/hi';
import ProductDetail from './ProductDetail';

interface ProductCardProps {
  item: MenuItem;
}

export default function ProductCard({ item }: ProductCardProps) {
  const t = useTranslations('menu');
  const locale = useLocale() as 'es' | 'en';
  const { items, addItem, updateQuantity, removeItem } = useCart();
  const [showDetail, setShowDetail] = useState(false);

  const cartItem = items.find((ci) => ci.id === item.id);
  const quantity = cartItem?.quantity || 0;

  const handleAdd = () => {
    if (item.isSpecialNote) return;
    const newItem: CartItem = {
      ...item,
      quantity: 1,
      withExtra: false,
    };
    addItem(newItem);
  };

  const handleIncrement = () => {
    if (cartItem) {
      updateQuantity(item.id, quantity + 1);
    } else {
      handleAdd();
    }
  };

  const handleDecrement = () => {
    if (quantity <= 1) {
      removeItem(item.id);
    } else {
      updateQuantity(item.id, quantity - 1);
    }
  };

  if (item.isSpecialNote) {
    return (
      <div className="bg-dark-card rounded-2xl border border-gray-800 p-6 flex items-center justify-center min-h-[200px]">
        <div className="text-center">
          <span className="text-4xl mb-3 block">{item.emoji}</span>
          <p className="text-white font-medium text-lg">{item.name[locale]}</p>
          {item.description && (
            <p className="text-gray-400 text-sm mt-2">{item.description[locale]}</p>
          )}
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="bg-dark-card rounded-2xl border border-gray-800 overflow-hidden group hover:border-accent/30 transition-all duration-300 flex flex-col">
        {/* Image area - Baladar placeholder */}
        <div className="relative h-40 bg-gradient-to-br from-dark-light to-dark-card flex items-center justify-center overflow-hidden">
          <div className="flex flex-col items-center opacity-20 group-hover:opacity-30 transition-opacity duration-300">
            <div className="w-14 h-14 border-2 border-white/40 rounded-full flex items-center justify-center mb-2">
              <span className="text-white/60 font-bold text-xl">B</span>
            </div>
            <span className="text-white/40 text-[10px] tracking-[0.2em] uppercase font-light">Baladar</span>
          </div>
          {/* View button */}
          <button
            onClick={() => setShowDetail(true)}
            className="absolute top-3 right-3 bg-black/60 hover:bg-accent text-white px-3 py-1.5 rounded-lg text-xs font-medium flex items-center gap-1.5 transition-all opacity-0 group-hover:opacity-100"
          >
            <HiOutlineEye className="w-4 h-4" />
            {t('viewDish')}
          </button>
        </div>

        {/* Content */}
        <div className="p-4 flex flex-col flex-1">
          <h4 className="text-white font-semibold text-sm mb-1 truncate">
            {item.name[locale]}
          </h4>
          {item.description && (
            <p className="text-gray-500 text-xs line-clamp-2 mb-3 leading-relaxed">
              {item.description[locale]}
            </p>
          )}

          {item.hasExtraOption && (
            <p className="text-accent/70 text-xs mb-3">
              {t('extraIceCream')}
            </p>
          )}

          {/* Price + controls - always at bottom */}
          <div className="flex items-center justify-between mt-auto pt-2">
            <span className="text-accent font-bold text-base">
              {formatPrice(item.price)}
            </span>

            {quantity === 0 ? (
              <button
                onClick={handleAdd}
                className="w-10 h-10 rounded-full flex items-center justify-center transition-all bg-accent/10 text-accent hover:bg-accent hover:text-white"
              >
                <HiPlus className="w-5 h-5" />
              </button>
            ) : (
              <div className="flex items-center gap-2">
                <button
                  onClick={handleDecrement}
                  className="w-8 h-8 rounded-full flex items-center justify-center bg-dark-light border border-gray-700 text-white hover:border-accent transition-colors"
                >
                  <HiMinus className="w-3.5 h-3.5" />
                </button>
                <span className="text-white font-bold text-sm w-6 text-center">
                  {quantity}
                </span>
                <button
                  onClick={handleIncrement}
                  className="w-8 h-8 rounded-full flex items-center justify-center bg-accent text-white hover:bg-accent-light transition-colors"
                >
                  <HiPlus className="w-3.5 h-3.5" />
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {showDetail && (
        <ProductDetail item={item} onClose={() => setShowDetail(false)} />
      )}
    </>
  );
}
