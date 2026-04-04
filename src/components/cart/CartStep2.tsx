'use client';

import { useState } from 'react';
import { useTranslations } from 'next-intl';
import { useTypedLocale } from '@/hooks/useTypedLocale';
import { useCart } from '@/context/CartContext';
import { formatPrice } from '@/lib/utils';
import { buildOrderMessage, buildWhatsAppUrl } from '@/lib/whatsapp';
import { OrderForm } from '@/types/cart';
import { FaWhatsapp } from 'react-icons/fa';

export default function CartStep2() {
  const t = useTranslations('cart');
  const locale = useTypedLocale();
  const isEs = locale === 'es';
  const { items, subtotal, setStep } = useCart();

  const [form, setForm] = useState<OrderForm>({
    name: '',
    paymentMethod: '',
    orderType: '',
  });
  const [tried, setTried] = useState(false);

  const missingName = !form.name.trim();
  const missingPayment = !form.paymentMethod;
  const missingType = !form.orderType;
  const isValid = !missingName && !missingPayment && !missingType;

  const showError = (missing: boolean) => tried && missing;

  const handleSend = () => {
    setTried(true);
    if (!isValid) return;
    const message = buildOrderMessage(items, form, locale);
    const url = buildWhatsAppUrl(message);
    window.open(url, '_blank');
  };

  return (
    <div className="flex flex-col h-full">
      <div className="flex-1 overflow-y-auto px-5 py-4 space-y-5">
        {/* Name */}
        <div>
          <label className="block text-white/50 text-xs uppercase tracking-wider mb-2">
            {t('name')}
          </label>
          <input
            type="text"
            placeholder={t('namePlaceholder')}
            autoComplete="name"
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
            className={`w-full bg-white/5 border rounded-xl px-4 py-3 text-white placeholder-white/25 focus:outline-none focus:ring-2 transition-all text-base ${
              showError(missingName)
                ? 'border-red-500/60 focus:ring-red-500/30'
                : 'border-transparent focus:ring-accent/50'
            }`}
          />
          {showError(missingName) && (
            <p className="text-red-400 text-xs mt-1.5">{isEs ? 'Ingresa tu nombre' : 'Enter your name'}</p>
          )}
        </div>

        {/* Payment Method */}
        <div>
          <label className={`block text-xs uppercase tracking-wider mb-2 ${showError(missingPayment) ? 'text-red-400' : 'text-white/50'}`}>
            {t('paymentMethod')}
          </label>
          <div className="grid grid-cols-3 gap-2">
            {(['transferencia', 'tarjeta', 'efectivo'] as const).map((method) => {
              const selected = form.paymentMethod === method;
              return (
                <button
                  key={method}
                  onClick={() => setForm({ ...form, paymentMethod: method })}
                  className={`py-3 rounded-xl text-xs font-medium transition-all border ${
                    selected
                      ? 'bg-accent text-white border-accent'
                      : showError(missingPayment)
                        ? 'bg-white/5 text-white/40 border-red-500/40'
                        : 'bg-white/5 text-white/40 border-transparent hover:bg-white/10 hover:text-white/60'
                  }`}
                >
                  {t(method === 'transferencia' ? 'transfer' : method === 'tarjeta' ? 'card' : 'cash')}
                </button>
              );
            })}
          </div>
          {showError(missingPayment) && (
            <p className="text-red-400 text-xs mt-1.5">{isEs ? 'Selecciona método de pago' : 'Select payment method'}</p>
          )}
        </div>

        {/* Order Type */}
        <div>
          <label className={`block text-xs uppercase tracking-wider mb-2 ${showError(missingType) ? 'text-red-400' : 'text-white/50'}`}>
            {t('orderType')}
          </label>
          <div className="grid grid-cols-2 gap-2">
            {(['mesa', 'domicilio'] as const).map((type) => {
              const selected = form.orderType === type;
              return (
                <button
                  key={type}
                  onClick={() => setForm({ ...form, orderType: type })}
                  className={`py-3.5 rounded-xl text-sm font-medium transition-all border ${
                    selected
                      ? 'bg-accent text-white border-accent'
                      : showError(missingType)
                        ? 'bg-white/5 text-white/40 border-red-500/40'
                        : 'bg-white/5 text-white/40 border-transparent hover:bg-white/10 hover:text-white/60'
                  }`}
                >
                  {type === 'mesa' ? '🍽️ ' : '🛵 '}
                  {t(type === 'mesa' ? 'dineIn' : 'delivery')}
                </button>
              );
            })}
          </div>
          {showError(missingType) && (
            <p className="text-red-400 text-xs mt-1.5">{isEs ? 'Selecciona tipo de pedido' : 'Select order type'}</p>
          )}
        </div>

        {/* Order Summary */}
        <div>
          <label className="block text-white/50 text-xs uppercase tracking-wider mb-3">
            {t('orderSummary')}
          </label>
          <div className="space-y-2">
            {items.map((item) => {
              const itemTotal = item.price * item.quantity + (item.withExtra && item.extraOptionPrice ? item.extraOptionPrice * item.quantity : 0);
              return (
                <div key={item.id} className="flex items-center justify-between">
                  <span className="text-white/40 text-sm">
                    {item.emoji} {item.quantity}x {item.name[locale]}
                  </span>
                  <span className="text-white/60 text-sm">{formatPrice(itemTotal)}</span>
                </div>
              );
            })}
          </div>
          <div className="h-px bg-white/5 my-3" />
          <div className="flex items-center justify-between">
            <span className="text-white font-medium text-sm">{t('total')}</span>
            <span className="text-white font-bold text-lg">{formatPrice(subtotal)}</span>
          </div>
        </div>
      </div>

      {/* Bottom actions */}
      <div className="px-5 pb-5 pt-3">
        <button
          onClick={handleSend}
          className={`w-full py-3.5 rounded-xl font-semibold text-sm flex items-center justify-center gap-2 transition-all ${
            isValid
              ? 'bg-accent hover:bg-accent-light text-white'
              : 'bg-accent/30 text-white/40 cursor-not-allowed'
          }`}
        >
          <FaWhatsapp className="w-4 h-4" />
          {t('sendWhatsApp')}
        </button>
        {tried && !isValid && (
          <p className="text-white/30 text-xs text-center mt-2">
            {isEs ? 'Completa los campos requeridos' : 'Fill in the required fields'}
          </p>
        )}
        <button
          onClick={() => setStep(1)}
          className="w-full py-2 mt-2 text-white/30 hover:text-white/60 text-xs transition-colors"
        >
          {t('back')}
        </button>
      </div>
    </div>
  );
}
