'use client';

import { useState } from 'react';
import { useTranslations, useLocale } from 'next-intl';
import { MenuItem } from '@/types/menu';
import { CartItem } from '@/types/cart';
import { useCart } from '@/context/CartContext';
import { formatPrice } from '@/lib/utils';
import { HiOutlineEye, HiPlus, HiMinus } from 'react-icons/hi';
import { FaWhatsapp } from 'react-icons/fa';
import ProductDetail from './ProductDetail';
import LunchOrderModal from './LunchOrderModal';

interface ProductCardProps {
  item: MenuItem;
}

function extractBadge(desc: string): { badge: string | null; rest: string } {
  // Match patterns like "3 porciones · ", "6 slices · ", "500cc · ", "1250cc · ", "250 ml", "1.5L", "Shot", "Copa", "Glass"
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
  const locale = useLocale() as 'es' | 'en';
  const { addItem, incrementItem, decrementItem, getQuantity } = useCart();
  const [showDetail, setShowDetail] = useState(false);
  const [showLunchModal, setShowLunchModal] = useState(false);

  const quantity = getQuantity(item.id);

  const handleAdd = () => {
    if (item.isSpecialNote) return;
    const cartItem: CartItem = {
      ...item,
      quantity: 1,
      withExtra: false,
    };
    addItem(cartItem);
  };

  const handleIncrement = () => {
    if (quantity > 0) {
      incrementItem(item.id);
    } else {
      handleAdd();
    }
  };

  const handleDecrement = () => {
    decrementItem(item.id);
  };

  const desc = item.description?.[locale] || '';
  const { badge, rest: cleanDesc } = extractBadge(desc);

  if (item.isSpecialNote) {
    return (
      <>
        <div className="col-span-2 lg:col-span-3 rounded-2xl overflow-hidden border border-accent/20 bg-gradient-to-br from-accent/10 to-dark-card p-6 sm:p-8 flex flex-col sm:flex-row items-center gap-6">
          <div className="flex-1 text-center sm:text-left">
            <p className="text-white/40 text-xs uppercase tracking-[0.15em] mb-2">
              {locale === 'es' ? 'Plato del día' : 'Daily special'}
            </p>
            <h4 className="text-white font-bold text-xl sm:text-2xl mb-2">
              {item.name[locale]}
            </h4>
            <p className="text-gray-400 text-sm">
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
        {showLunchModal && (
          <LunchOrderModal onClose={() => setShowLunchModal(false)} />
        )}
      </>
    );
  }

  return (
    <>
      <div className="bg-dark-card rounded-2xl border border-gray-800 overflow-hidden group hover:border-accent/30 transition-all duration-300 flex flex-col">
        {/* Image area */}
        <div className="relative h-40 bg-gradient-to-br from-dark-light to-dark-card flex items-center justify-center overflow-hidden">
          {item.image ? (
            <img
              src={`${process.env.NEXT_PUBLIC_BASE_PATH || ''}${item.image}`}
              alt={item.name[locale]}
              className="w-full h-full object-cover scale-125 group-hover:scale-[1.3] transition-transform duration-500"
              loading="lazy"
            />
          ) : (
            <img
              src={`${process.env.NEXT_PUBLIC_BASE_PATH || ''}/logo-company.webp`}
              alt="Baladar"
              width={56}
              height={56}
              className="w-14 h-14 rounded-full opacity-20 group-hover:opacity-30 transition-opacity duration-300"
            />
          )}
          {/* Badge */}
          {badge && (
            <span className="absolute top-2.5 left-2.5 bg-white/10 backdrop-blur-sm text-white/80 text-[10px] font-medium px-2 py-0.5 rounded">
              {badge}
            </span>
          )}
          {/* View button */}
          <button
            onClick={() => setShowDetail(true)}
            className="absolute top-2.5 right-2.5 bg-black/60 hover:bg-accent text-white px-3 py-1.5 rounded-lg text-xs font-medium flex items-center gap-1.5 transition-all opacity-0 group-hover:opacity-100"
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
          {cleanDesc && (
            <p className="text-gray-500 text-xs line-clamp-2 mb-3 leading-relaxed">
              {cleanDesc}
            </p>
          )}

          {item.hasExtraOption && (
            <p className="text-accent/70 text-xs mb-3">
              {t('extraIceCream')}
            </p>
          )}

          {/* Price + controls */}
          <div className="flex items-center justify-between mt-auto pt-2">
            <div className="flex items-baseline gap-1">
              <span className="text-white font-bold text-base">{formatPrice(item.price)}</span>
              <span className="text-gray-600 text-[10px]">COP</span>
            </div>

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
