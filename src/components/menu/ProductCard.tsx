'use client';

import { useState } from 'react';
import { useTranslations } from 'next-intl';
import { useTypedLocale } from '@/hooks/useTypedLocale';
import { MenuItem } from '@/types/menu';
import { CartItem } from '@/types/cart';
import { useCart } from '@/context/CartContext';
import { formatPrice } from '@/lib/utils';
import { getAssetPath } from '@/lib/constants';
import { HiOutlineEye, HiPlus, HiMinus } from 'react-icons/hi';
import { FaWhatsapp } from 'react-icons/fa';
import ProductDetail from './ProductDetail';
import LunchOrderModal from './LunchOrderModal';

interface ProductCardProps {
  item: MenuItem;
}

function extractBadge(desc: string): { badge: string | null; rest: string } {
  const match = desc.match(/^(\d+\s*(?:porciones|slices|porcion|slice))\s*·\s*/i);
  if (match) return { badge: match[1], rest: desc.slice(match[0].length) };

  const matchCc = desc.match(/^(\d+cc)\s*·\s*/i);
  if (matchCc) return { badge: matchCc[1], rest: desc.slice(matchCc[0].length) };

  const matchVol = desc.match(/^(\d+(?:\.\d+)?\s*(?:ml|L))\s*$/i);
  if (matchVol) return { badge: matchVol[1], rest: '' };

  const matchUnit = desc.match(/^(\d+\s*(?:unidades|pieces|unidad))\s*·\s*/i);
  if (matchUnit) return { badge: matchUnit[1], rest: desc.slice(matchUnit[0].length) };

  if (/^(Shot|Copa|Glass)$/i.test(desc.trim())) return { badge: desc.trim(), rest: '' };

  const matchSampler = desc.match(/^(3\s*(?:vasos|glasses)\s*6oz)/i);
  if (matchSampler) return { badge: matchSampler[1], rest: desc.slice(matchSampler[0].length).replace(/^\s*·?\s*/, '') };

  return { badge: null, rest: desc };
}

export default function ProductCard({ item }: ProductCardProps) {
  const t = useTranslations('menu');
  const locale = useTypedLocale();
  const { addItem, incrementItem, decrementItem, getQuantity } = useCart();
  const [showDetail, setShowDetail] = useState(false);
  const [showLunchModal, setShowLunchModal] = useState(false);

  const quantity = getQuantity(item.id);

  const handleAdd = () => {
    if (item.isSpecialNote) return;
    const cartItem: CartItem = { ...item, quantity: 1, withExtra: false };
    addItem(cartItem);
  };

  const desc = item.description?.[locale] || '';
  const { badge, rest: cleanDesc } = extractBadge(desc);

  /* ── Special note (almuerzo del día) ── */
  if (item.isSpecialNote) {
    return (
      <>
        <div
          className="col-span-2 lg:col-span-3 rounded-2xl overflow-hidden border border-accent/20 relative"
        >
          {/* Background image */}
          <img
            src="https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=1200&q=80&auto=format&fit=crop"
            alt=""
            className="absolute inset-0 w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-dark/95 via-dark/85 to-dark/70" />

          {/* Content */}
          <div className="relative p-6 sm:p-8 flex flex-col sm:flex-row items-center gap-6">
            <div className="flex-1 text-center sm:text-left">
              <p className="text-white/50 text-xs uppercase tracking-[0.15em] mb-2">
                {locale === 'es' ? 'Plato del día' : 'Daily special'}
              </p>
              <h4 className="text-white font-bold text-xl sm:text-2xl mb-2">
                {item.name[locale]}
              </h4>
              <p className="text-gray-300 text-sm">
                {locale === 'es'
                  ? 'Todos nuestros ingredientes son de origen local. Escríbenos por WhatsApp y conoce las opciones disponibles para hoy.'
                  : 'All our ingredients are locally sourced. Write to us on WhatsApp and discover today\'s available options.'}
              </p>
            </div>
            <button
              onClick={() => setShowLunchModal(true)}
              className="shrink-0 px-6 py-3 bg-accent hover:bg-accent-light text-white rounded-lg font-semibold text-sm flex items-center gap-2 transition-colors"
            >
              <FaWhatsapp className="w-4 h-4" />
              {locale === 'es' ? 'Pedir almuerzo' : 'Order lunch'}
            </button>
          </div>
        </div>
        {showLunchModal && <LunchOrderModal onClose={() => setShowLunchModal(false)} />}
      </>
    );
  }

  /* ── Regular product card ── */
  return (
    <>
      <div className="bg-dark-card rounded-2xl border border-gray-800 overflow-hidden flex flex-col">
        {/* Placeholder image area */}
        <div className="relative h-28 sm:h-32 bg-gradient-to-br from-dark-light to-dark-card flex items-center justify-center">
          <img
            src={getAssetPath('/logo-company.webp')}
            alt="Baladar"
            width={48}
            height={48}
            className="w-10 h-10 sm:w-12 sm:h-12 rounded-full opacity-15"
          />
          {badge && (
            <span className="absolute bottom-2.5 left-2.5 bg-dark/70 backdrop-blur-sm text-white/80 text-[10px] font-medium px-2 py-0.5 rounded border border-accent/30">
              {badge}
            </span>
          )}
        </div>

        {/* Content */}
        <div className="p-3 sm:p-4 flex flex-col flex-1">
          <h4 className="text-white font-bold text-sm sm:text-base mb-1">
            {item.name[locale]}
          </h4>

          {cleanDesc && (
            <p className="hidden sm:block text-gray-500 text-xs line-clamp-2 mb-2 leading-relaxed">
              {cleanDesc}
            </p>
          )}

          <p className="text-accent-light font-bold text-base sm:text-lg mb-3 sm:mb-4 mt-auto">
            {formatPrice(item.price)}
          </p>

          {/* Actions */}
          <div className="flex flex-col sm:flex-row gap-2">
            {/* View detail */}
            <button
              onClick={() => setShowDetail(true)}
              className="flex-1 flex items-center justify-center gap-2 px-3 py-2 rounded-lg border border-accent/40 text-accent-light hover:bg-accent/10 transition-colors text-xs sm:text-sm font-medium"
            >
              <HiOutlineEye className="w-4 h-4" />
              {t('viewDish')}
            </button>

            {/* Add / quantity stepper */}
            {quantity === 0 ? (
              <button
                onClick={handleAdd}
                className="flex-1 flex items-center justify-center gap-2 px-3 py-2 rounded-lg border border-accent/40 bg-accent/10 text-accent-light hover:bg-accent/20 transition-colors text-xs sm:text-sm font-medium"
              >
                <HiPlus className="w-4 h-4" />
                {locale === 'es' ? 'Agregar' : 'Add'}
              </button>
            ) : (
              <div className="flex-1 flex items-center justify-center gap-1 rounded-lg border border-accent/40 bg-accent/10">
                <button
                  onClick={() => decrementItem(item.id)}
                  className="p-2 text-accent-light hover:text-white transition-colors"
                >
                  <HiMinus className="w-4 h-4" />
                </button>
                <span className="text-white font-bold text-sm w-6 text-center tabular-nums">
                  {quantity}
                </span>
                <button
                  onClick={() => incrementItem(item.id)}
                  className="p-2 text-accent-light hover:text-white transition-colors"
                >
                  <HiPlus className="w-4 h-4" />
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {showDetail && <ProductDetail item={item} onClose={() => setShowDetail(false)} />}
    </>
  );
}
