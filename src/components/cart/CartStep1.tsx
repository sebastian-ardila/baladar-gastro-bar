'use client';

import { useTranslations, useLocale } from 'next-intl';
import { useCart } from '@/context/CartContext';
import { formatPrice } from '@/lib/utils';
import { HiOutlineTrash, HiPlus, HiMinus } from 'react-icons/hi';
import Button from '@/components/ui/Button';

export default function CartStep1() {
  const t = useTranslations('cart');
  const locale = useLocale() as 'es' | 'en';
  const { items, updateQuantity, removeItem, clearCart, setStep, subtotal, closeCart } = useCart();

  if (items.length === 0) {
    return (
      <div className="flex-1 flex items-center justify-center p-8">
        <p className="text-gray-500 text-lg">{t('empty')}</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full">
      {/* Items list */}
      <div className="flex-1 overflow-y-auto p-4 space-y-3">
        {items.map((item) => {
          const itemTotal = item.price * item.quantity + (item.withExtra && item.extraOptionPrice ? item.extraOptionPrice * item.quantity : 0);
          return (
            <div
              key={item.id + (item.withExtra ? '-extra' : '')}
              className="bg-dark-light rounded-xl p-4 border border-gray-800"
            >
              <div className="flex items-start justify-between gap-3">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="text-lg">{item.emoji}</span>
                    <h4 className="text-white font-medium text-sm truncate">
                      {item.name[locale]}
                    </h4>
                  </div>
                  {item.withExtra && item.extraOptionLabel && (
                    <p className="text-accent text-xs mt-1">
                      + {item.extraOptionLabel[locale]}
                    </p>
                  )}
                  {item.comboSelection && (
                    <p className="text-gray-400 text-xs mt-1">
                      🍕 {item.comboSelection.half1} / {item.comboSelection.half2}
                    </p>
                  )}
                </div>
                <button
                  onClick={() => removeItem(item.id)}
                  className="p-1.5 text-gray-500 hover:text-red-400 transition-colors"
                  aria-label="Remove"
                >
                  <HiOutlineTrash className="w-4 h-4" />
                </button>
              </div>

              <div className="flex items-center justify-between mt-3">
                {/* Quantity controls */}
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => updateQuantity(item.id, item.quantity - 1)}
                    className="w-8 h-8 rounded-lg bg-dark border border-gray-700 flex items-center justify-center text-white hover:border-accent transition-colors"
                  >
                    <HiMinus className="w-3 h-3" />
                  </button>
                  <span className="text-white font-medium w-8 text-center">
                    {item.quantity}
                  </span>
                  <button
                    onClick={() => updateQuantity(item.id, item.quantity + 1)}
                    className="w-8 h-8 rounded-lg bg-dark border border-gray-700 flex items-center justify-center text-white hover:border-accent transition-colors"
                  >
                    <HiPlus className="w-3 h-3" />
                  </button>
                </div>
                <span className="text-accent font-semibold">
                  {formatPrice(itemTotal)}
                </span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Bottom section */}
      <div className="p-4 border-t border-gray-800 space-y-3">
        <div className="flex items-center justify-between text-lg">
          <span className="text-gray-300">{t('subtotal')}</span>
          <span className="text-white font-bold">{formatPrice(subtotal)}</span>
        </div>
        <Button onClick={() => setStep(2)} className="w-full" size="lg">
          {t('continue')}
        </Button>
        <button
          onClick={() => {
            clearCart();
            closeCart();
          }}
          className="w-full py-3 text-red-400 hover:text-red-300 text-sm font-medium transition-colors"
        >
          {t('deleteOrder')}
        </button>
      </div>
    </div>
  );
}
