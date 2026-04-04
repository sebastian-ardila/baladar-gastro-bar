'use client';

import { useState } from 'react';
import { useTypedLocale } from '@/hooks/useTypedLocale';
import { buildWhatsAppUrl } from '@/lib/whatsapp';
import { HiOutlineX } from 'react-icons/hi';
import { FaWhatsapp } from 'react-icons/fa';

interface LunchOrderModalProps {
  onClose: () => void;
}

export default function LunchOrderModal({ onClose }: LunchOrderModalProps) {
  const locale = useTypedLocale();
  const isEs = locale === 'es';

  const [name, setName] = useState('');
  const [orderType, setOrderType] = useState<'mesa' | 'domicilio' | ''>('');

  const isValid = name.trim() && orderType;

  const handleSend = () => {
    if (!isValid) return;

    const orderTypeText = orderType === 'mesa'
      ? (isEs ? 'Para la mesa' : 'Dine-in')
      : (isEs ? 'A domicilio' : 'Delivery');
    const orderTypeEmoji = orderType === 'mesa' ? '🍽️' : '🛵';

    let msg = isEs
      ? `🥘 *Pedido de Almuerzo Baladar*\n\n`
      : `🥘 *Baladar Lunch Order*\n\n`;

    msg += `👤 ${name}\n`;
    msg += `${orderTypeEmoji} ${orderTypeText}\n\n`;
    msg += isEs
      ? `🍽️ 1x Almuerzo del día\n\n`
      : `🍽️ 1x Daily lunch\n\n`;
    msg += isEs
      ? `💬 Me gustaría conocer las opciones del día`
      : `💬 I would like to know today's options`;

    window.open(buildWhatsAppUrl(msg), '_blank');
    onClose();
  };

  return (
    <div className="fixed inset-0 z-[90] flex items-end sm:items-center justify-center" onClick={onClose}>
      <div className="absolute inset-0 bg-black/80 backdrop-blur-sm" />
      <div
        className="relative bg-dark rounded-t-2xl sm:rounded-2xl w-full sm:max-w-sm overflow-hidden shadow-2xl sm:mx-4"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Drag handle — mobile */}
        <div className="sm:hidden flex justify-center pt-3 pb-1">
          <div className="w-10 h-1 rounded-full bg-white/20" />
        </div>

        {/* Header */}
        <div className="px-6 pt-4 sm:pt-6 pb-4 flex items-center justify-between">
          <h3 className="text-white font-bold text-lg">
            {isEs ? 'Pedir Almuerzo' : 'Order Lunch'}
          </h3>
          <button
            onClick={onClose}
            className="p-1.5 text-gray-500 hover:text-white transition-colors rounded-lg hover:bg-white/5"
          >
            <HiOutlineX className="w-5 h-5" />
          </button>
        </div>

        <div className="h-px bg-white/5 mx-6" />

        {/* Form */}
        <div className="px-6 py-5 space-y-5">
          {/* Name */}
          <div>
            <label className="block text-white/50 text-xs uppercase tracking-wider mb-2">
              {isEs ? 'Nombre' : 'Name'}
            </label>
            <input
              type="text"
              placeholder={isEs ? 'Tu nombre' : 'Your name'}
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full bg-white/5 border-0 rounded-xl px-4 py-3 text-white placeholder-white/25 focus:outline-none focus:ring-2 focus:ring-accent/50 text-base transition-all"
            />
          </div>

          {/* Order type */}
          <div>
            <label className="block text-white/50 text-xs uppercase tracking-wider mb-2">
              {isEs ? 'Tipo de pedido' : 'Order type'}
            </label>
            <div className="grid grid-cols-2 gap-3">
              {(['mesa', 'domicilio'] as const).map((type) => {
                const selected = orderType === type;
                return (
                  <button
                    key={type}
                    onClick={() => setOrderType(type)}
                    className={`py-3.5 px-4 rounded-xl text-sm font-medium transition-all ${
                      selected
                        ? 'bg-accent text-white'
                        : 'bg-white/5 text-white/50 hover:bg-white/10 hover:text-white/70'
                    }`}
                  >
                    {type === 'mesa' ? '🍽️' : '🛵'}{' '}
                    {type === 'mesa'
                      ? (isEs ? 'En mesa' : 'Dine-in')
                      : (isEs ? 'Domicilio' : 'Delivery')}
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* Action */}
        <div className="px-6 pb-6">
          <button
            onClick={handleSend}
            disabled={!isValid}
            className={`w-full py-3.5 rounded-xl font-semibold text-sm flex items-center justify-center gap-2 transition-all ${
              isValid
                ? 'bg-accent hover:bg-accent-light text-white'
                : 'bg-white/5 text-white/20 cursor-not-allowed'
            }`}
          >
            <FaWhatsapp className="w-4 h-4" />
            {isEs ? 'Pedir por WhatsApp' : 'Order via WhatsApp'}
          </button>
        </div>
      </div>
    </div>
  );
}
