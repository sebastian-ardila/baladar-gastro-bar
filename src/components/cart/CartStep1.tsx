'use client';

import { useTranslations } from 'next-intl';
import { useTypedLocale } from '@/hooks/useTypedLocale';
import { useCart } from '@/context/CartContext';
import { formatPrice } from '@/lib/utils';
import { HiPlus, HiMinus, HiX } from 'react-icons/hi';

export default function CartStep1() {
  const t = useTranslations('cart');
  const locale = useTypedLocale();
  const { items, incrementItem, decrementItem, removeItem, clearCart, setStep, subtotal, closeCart } = useCart();

  if (items.length === 0) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center p-8 gap-4">
        <p className="text-white/30 text-sm">{t('empty')}</p>
        <button
          onClick={closeCart}
          className="px-5 py-2.5 bg-accent hover:bg-accent-light text-white rounded-lg font-medium transition-colors text-sm"
        >
          {locale === 'es' ? 'Ver carta' : 'View menu'}
        </button>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full">
      {/* Items */}
      <div className="flex-1 overflow-y-auto scrollbar-hide">
        {items.map((item, index) => {
          const unitPrice = item.price + (item.withExtra && item.extraOptionPrice ? item.extraOptionPrice : 0);
          const itemTotal = unitPrice * item.quantity;
          return (
            <div
              key={item.id}
              className={`px-5 py-4 ${index < items.length - 1 ? 'border-b border-white/[0.05]' : ''}`}
            >
              {/* Row 1: Name + Total */}
              <div className="flex items-start justify-between gap-3">
                <div className="min-w-0 flex-1">
                  <h4 className="text-white text-sm font-medium leading-snug">
                    <span className="mr-1.5">{item.emoji}</span>
                    {item.name[locale]}
                  </h4>
                  {item.withExtra && item.extraOptionLabel && (
                    <p className="text-white/25 text-xs mt-0.5 pl-7">
                      + {item.extraOptionLabel[locale]}
                    </p>
                  )}
                </div>
                <span className="text-white text-sm font-medium tabular-nums shrink-0">
                  {formatPrice(itemTotal)}
                </span>
              </div>

              {/* Row 2: Stepper + Unit price + Remove */}
              <div className="flex items-center justify-between mt-2.5 pl-7">
                <div className="flex items-center gap-3">
                  {/* Stepper */}
                  <div className="flex items-center">
                    <button
                      onClick={() => decrementItem(item.id)}
                      className="w-7 h-7 rounded-l-lg bg-white/[0.06] hover:bg-white/10 flex items-center justify-center text-white/50 hover:text-white transition-colors"
                    >
                      <HiMinus className="w-3 h-3" />
                    </button>
                    <div className="w-9 h-7 bg-white/[0.03] flex items-center justify-center">
                      <span className="text-white text-xs font-medium tabular-nums">
                        {item.quantity}
                      </span>
                    </div>
                    <button
                      onClick={() => incrementItem(item.id)}
                      className="w-7 h-7 rounded-r-lg bg-white/[0.06] hover:bg-white/10 flex items-center justify-center text-white/50 hover:text-white transition-colors"
                    >
                      <HiPlus className="w-3 h-3" />
                    </button>
                  </div>
                  {item.quantity > 1 && (
                    <span className="text-white/20 text-[11px] tabular-nums">
                      {formatPrice(unitPrice)} c/u
                    </span>
                  )}
                </div>
                <button
                  onClick={() => removeItem(item.id)}
                  className="text-white/15 hover:text-red-400 transition-colors p-1 -mr-1"
                >
                  <HiX className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Footer */}
      <div className="border-t border-white/[0.06] px-5 pb-5 pt-4">
        <div className="flex items-baseline justify-between mb-4">
          <span className="text-white/40 text-sm">{t('subtotal')}</span>
          <span className="text-white font-semibold text-lg tabular-nums">{formatPrice(subtotal)}</span>
        </div>
        <button
          onClick={() => setStep(2)}
          className="w-full py-3 bg-accent hover:bg-accent-light active:scale-[0.98] text-white rounded-xl font-semibold transition-all text-sm"
        >
          {t('continue')}
        </button>
        <button
          onClick={() => { clearCart(); closeCart(); }}
          className="w-full py-2 mt-1 text-white/20 hover:text-red-400 text-xs transition-colors"
        >
          {t('deleteOrder')}
        </button>
      </div>
    </div>
  );
}
