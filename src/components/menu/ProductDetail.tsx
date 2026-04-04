'use client';

import { useState } from 'react';
import { useTranslations } from 'next-intl';
import { useTypedLocale } from '@/hooks/useTypedLocale';
import { MenuItem } from '@/types/menu';
import { CartItem } from '@/types/cart';
import { useCart } from '@/context/CartContext';
import { formatPrice } from '@/lib/utils';
import { getAssetPath } from '@/lib/constants';
import { HiOutlineX, HiPlus, HiMinus } from 'react-icons/hi';
import { FaShoppingCart } from 'react-icons/fa';
import Button from '@/components/ui/Button';

interface ProductDetailProps {
  item: MenuItem;
  onClose: () => void;
}

export default function ProductDetail({ item, onClose }: ProductDetailProps) {
  const t = useTranslations('menu');
  const locale = useTypedLocale();
  const { addItem } = useCart();
  const [quantity, setQuantity] = useState(1);
  const [withExtra, setWithExtra] = useState(false);
  const [comboHalf1, setComboHalf1] = useState('');
  const [comboHalf2, setComboHalf2] = useState('');

  const totalPrice = (item.price + (withExtra && item.extraOptionPrice ? item.extraOptionPrice : 0)) * quantity;

  const handleAddToCart = () => {
    const cartItem: CartItem = {
      ...item,
      quantity,
      withExtra,
      ...(item.isCombo && comboHalf1 && comboHalf2
        ? { comboSelection: { half1: comboHalf1, half2: comboHalf2 } }
        : {}),
    };
    addItem(cartItem);
    onClose();
  };

  const canAdd = item.isCombo ? comboHalf1 && comboHalf2 : true;

  return (
    <div className="fixed inset-0 z-[90] flex items-end sm:items-center justify-center" onClick={onClose}>
      <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" />
      <div
        className="relative bg-dark-card border border-gray-800 rounded-t-2xl sm:rounded-2xl w-full sm:max-w-md max-h-[85vh] sm:max-h-[90vh] overflow-y-auto sm:mx-4"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Drag handle — mobile only */}
        <div className="sm:hidden flex justify-center pt-3 pb-1">
          <div className="w-10 h-1 rounded-full bg-white/20" />
        </div>

        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-3 right-3 sm:top-4 sm:right-4 z-10 p-2 bg-black/60 rounded-full text-white hover:bg-accent transition-colors"
        >
          <HiOutlineX className="w-5 h-5" />
        </button>

        {/* Header area */}
        <div className="h-32 sm:h-40 bg-gradient-to-br from-dark-light to-dark-card flex items-center justify-center sm:rounded-t-2xl">
          <img
            src={getAssetPath('/logo-company.webp')}
            alt="Baladar"
            width={64}
            height={64}
            className="w-12 h-12 sm:w-16 sm:h-16 rounded-full opacity-20"
          />
        </div>

        {/* Content */}
        <div className="p-5 sm:p-6">
          <h3 className="text-lg sm:text-xl font-bold text-white mb-1">{item.name[locale]}</h3>
          {item.description && (
            <p className="text-gray-400 text-sm leading-relaxed mb-4">
              {item.description[locale]}
            </p>
          )}

          <div className="text-accent font-bold text-xl sm:text-2xl mb-5">
            {formatPrice(item.price)}
          </div>

          {/* Extra option */}
          {item.hasExtraOption && (
            <button
              onClick={() => setWithExtra(!withExtra)}
              className={`w-full flex items-center gap-3 mb-5 p-3 rounded-xl border transition-all ${
                withExtra
                  ? 'border-accent/40 bg-accent/10'
                  : 'border-gray-700 hover:border-gray-600'
              }`}
            >
              <div
                className={`w-5 h-5 rounded border-2 flex items-center justify-center shrink-0 transition-all ${
                  withExtra ? 'bg-accent border-accent' : 'border-gray-600'
                }`}
              >
                {withExtra && <HiPlus className="w-3 h-3 text-white rotate-45" />}
              </div>
              <span className="text-gray-300 text-sm text-left">
                {item.extraOptionLabel?.[locale]} (+{formatPrice(item.extraOptionPrice || 0)})
              </span>
            </button>
          )}

          {/* Combo selection */}
          {item.isCombo && item.comboOptions && (
            <div className="space-y-4 mb-5">
              <div>
                <label className="text-sm text-gray-300 mb-2 block">{t('selectHalf1')}</label>
                <div className="grid grid-cols-2 gap-2">
                  {item.comboOptions.map((opt) => (
                    <button
                      key={`h1-${opt}`}
                      onClick={() => setComboHalf1(opt)}
                      className={`py-2.5 px-3 rounded-xl text-xs font-medium transition-all border ${
                        comboHalf1 === opt
                          ? 'border-accent bg-accent/10 text-accent'
                          : 'border-gray-700 text-gray-400 hover:border-gray-500'
                      }`}
                    >
                      {opt}
                    </button>
                  ))}
                </div>
              </div>
              <div>
                <label className="text-sm text-gray-300 mb-2 block">{t('selectHalf2')}</label>
                <div className="grid grid-cols-2 gap-2">
                  {item.comboOptions.map((opt) => (
                    <button
                      key={`h2-${opt}`}
                      onClick={() => setComboHalf2(opt)}
                      className={`py-2.5 px-3 rounded-xl text-xs font-medium transition-all border ${
                        comboHalf2 === opt
                          ? 'border-accent bg-accent/10 text-accent'
                          : 'border-gray-700 text-gray-400 hover:border-gray-500'
                      }`}
                    >
                      {opt}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Quantity + Add to cart */}
          <div className="flex items-center gap-3">
            <div className="flex items-center bg-dark-light rounded-xl border border-gray-700">
              <button
                onClick={() => setQuantity(Math.max(1, quantity - 1))}
                className="w-10 h-10 flex items-center justify-center text-white hover:bg-white/10 rounded-l-xl transition-colors"
              >
                <HiMinus className="w-4 h-4" />
              </button>
              <span className="text-white font-bold w-8 text-center tabular-nums">{quantity}</span>
              <button
                onClick={() => setQuantity(quantity + 1)}
                className="w-10 h-10 flex items-center justify-center text-white hover:bg-white/10 rounded-r-xl transition-colors"
              >
                <HiPlus className="w-4 h-4" />
              </button>
            </div>

            <Button
              onClick={handleAddToCart}
              className="flex-1"
              disabled={!canAdd}
            >
              <FaShoppingCart className="w-4 h-4" />
              {t('addToCart')} - {formatPrice(totalPrice)}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
