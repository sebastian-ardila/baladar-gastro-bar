'use client';

import { useState } from 'react';
import { useTranslations, useLocale } from 'next-intl';
import { MenuItem } from '@/types/menu';
import { CartItem } from '@/types/cart';
import { useCart } from '@/context/CartContext';
import { formatPrice } from '@/lib/utils';
import { HiOutlineX, HiPlus, HiMinus } from 'react-icons/hi';
import { FaShoppingCart } from 'react-icons/fa';
import Button from '@/components/ui/Button';

interface ProductDetailProps {
  item: MenuItem;
  onClose: () => void;
}

export default function ProductDetail({ item, onClose }: ProductDetailProps) {
  const t = useTranslations('menu');
  const locale = useLocale() as 'es' | 'en';
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
    <div className="fixed inset-0 z-[90] flex items-center justify-center p-4" onClick={onClose}>
      <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" />
      <div
        className="relative bg-dark-card border border-gray-800 rounded-2xl max-w-md w-full max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-10 p-2 bg-black/60 rounded-full text-white hover:bg-accent transition-colors"
        >
          <HiOutlineX className="w-5 h-5" />
        </button>

        {/* Image area - Baladar placeholder */}
        <div className="h-48 bg-gradient-to-br from-dark-light to-dark-card flex items-center justify-center rounded-t-2xl">
          <div className="flex flex-col items-center opacity-30">
            <div className="w-20 h-20 border-2 border-white/40 rounded-full flex items-center justify-center mb-3">
              <span className="text-white/60 font-bold text-3xl">B</span>
            </div>
            <span className="text-white/40 text-xs tracking-[0.2em] uppercase font-light">Baladar</span>
          </div>
        </div>

        {/* Content */}
        <div className="p-6">
          <h3 className="text-xl font-bold text-white mb-2">{item.name[locale]}</h3>
          {item.description && (
            <p className="text-gray-400 text-sm leading-relaxed mb-4">
              {item.description[locale]}
            </p>
          )}

          <div className="text-accent font-bold text-2xl mb-6">
            {formatPrice(item.price)}
          </div>

          {/* Extra option for desserts */}
          {item.hasExtraOption && (
            <label className="flex items-center gap-3 mb-4 cursor-pointer group">
              <div
                className={`w-5 h-5 rounded border-2 flex items-center justify-center transition-all ${
                  withExtra ? 'bg-accent border-accent' : 'border-gray-600 group-hover:border-gray-400'
                }`}
                onClick={() => setWithExtra(!withExtra)}
              >
                {withExtra && <HiPlus className="w-3 h-3 text-white rotate-45" />}
              </div>
              <span className="text-gray-300 text-sm" onClick={() => setWithExtra(!withExtra)}>
                {item.extraOptionLabel?.[locale]} (+{formatPrice(item.extraOptionPrice || 0)})
              </span>
            </label>
          )}

          {/* Combo selection */}
          {item.isCombo && item.comboOptions && (
            <div className="space-y-4 mb-6">
              <div>
                <label className="text-sm text-gray-300 mb-2 block">{t('selectHalf1')}</label>
                <div className="grid grid-cols-2 gap-2">
                  {item.comboOptions.map((opt) => (
                    <button
                      key={`h1-${opt}`}
                      onClick={() => setComboHalf1(opt)}
                      className={`py-2 px-3 rounded-lg text-xs font-medium transition-all border ${
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
                      className={`py-2 px-3 rounded-lg text-xs font-medium transition-all border ${
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
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-3 bg-dark-light rounded-xl px-3 py-2 border border-gray-700">
              <button
                onClick={() => setQuantity(Math.max(1, quantity - 1))}
                className="w-8 h-8 rounded-lg flex items-center justify-center text-white hover:bg-white/10 transition-colors"
              >
                <HiMinus className="w-4 h-4" />
              </button>
              <span className="text-white font-bold w-8 text-center">{quantity}</span>
              <button
                onClick={() => setQuantity(quantity + 1)}
                className="w-8 h-8 rounded-lg flex items-center justify-center text-white hover:bg-white/10 transition-colors"
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
