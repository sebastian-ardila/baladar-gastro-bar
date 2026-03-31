'use client';

import { useState } from 'react';
import { useTranslations, useLocale } from 'next-intl';
import { useCart } from '@/context/CartContext';
import { formatPrice } from '@/lib/utils';
import { buildOrderMessage, buildWhatsAppUrl } from '@/lib/whatsapp';
import { OrderForm } from '@/types/cart';
import { FaWhatsapp } from 'react-icons/fa';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';

export default function CartStep2() {
  const t = useTranslations('cart');
  const locale = useLocale() as 'es' | 'en';
  const { items, subtotal, setStep } = useCart();

  const [form, setForm] = useState<OrderForm>({
    name: '',
    paymentMethod: '',
    orderType: '',
  });

  const isValid = form.name.trim() && form.paymentMethod && form.orderType;

  const handleSend = () => {
    if (!isValid) return;
    const message = buildOrderMessage(items, form, locale);
    const url = buildWhatsAppUrl(message);
    window.open(url, '_blank');
  };

  return (
    <div className="flex flex-col h-full">
      <div className="flex-1 overflow-y-auto p-4 space-y-5">
        {/* Name */}
        <Input
          label={t('name')}
          id="order-name"
          placeholder={t('namePlaceholder')}
          value={form.name}
          onChange={(e) => setForm({ ...form, name: e.target.value })}
        />

        {/* Payment Method */}
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">
            {t('paymentMethod')}
          </label>
          <div className="grid grid-cols-3 gap-2">
            {(['transferencia', 'tarjeta', 'efectivo'] as const).map((method) => (
              <button
                key={method}
                onClick={() => setForm({ ...form, paymentMethod: method })}
                className={`py-3 px-2 rounded-lg text-sm font-medium transition-all border ${
                  form.paymentMethod === method
                    ? 'border-accent bg-accent/10 text-accent'
                    : 'border-gray-700 bg-dark-light text-gray-400 hover:border-gray-500'
                }`}
              >
                {t(method === 'transferencia' ? 'transfer' : method === 'tarjeta' ? 'card' : 'cash')}
              </button>
            ))}
          </div>
        </div>

        {/* Order Type */}
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">
            {t('orderType')}
          </label>
          <div className="grid grid-cols-2 gap-2">
            {(['mesa', 'domicilio'] as const).map((type) => (
              <button
                key={type}
                onClick={() => setForm({ ...form, orderType: type })}
                className={`py-3 px-4 rounded-lg text-sm font-medium transition-all border ${
                  form.orderType === type
                    ? 'border-accent bg-accent/10 text-accent'
                    : 'border-gray-700 bg-dark-light text-gray-400 hover:border-gray-500'
                }`}
              >
                {type === 'mesa' ? '🍽️ ' : '🛵 '}
                {t(type === 'mesa' ? 'dineIn' : 'delivery')}
              </button>
            ))}
          </div>
        </div>

        {/* Order Summary */}
        <div className="bg-dark-light rounded-xl p-4 border border-gray-800">
          <h4 className="text-white font-semibold mb-3">{t('orderSummary')}</h4>
          <div className="space-y-2">
            {items.map((item) => {
              const itemTotal = item.price * item.quantity + (item.withExtra && item.extraOptionPrice ? item.extraOptionPrice * item.quantity : 0);
              return (
                <div key={item.id} className="flex items-center justify-between text-sm">
                  <span className="text-gray-400">
                    {item.emoji} {item.quantity}x {item.name[locale]}
                  </span>
                  <span className="text-gray-300">{formatPrice(itemTotal)}</span>
                </div>
              );
            })}
          </div>
          <div className="border-t border-gray-700 mt-3 pt-3 flex items-center justify-between">
            <span className="text-white font-semibold">{t('total')}</span>
            <span className="text-accent font-bold text-lg">{formatPrice(subtotal)}</span>
          </div>
        </div>
      </div>

      {/* Bottom actions */}
      <div className="p-4 border-t border-gray-800 space-y-3">
        <Button
          onClick={handleSend}
          variant="whatsapp"
          className="w-full"
          size="lg"
          disabled={!isValid}
        >
          <FaWhatsapp className="w-5 h-5" />
          {t('sendWhatsApp')}
        </Button>
        <button
          onClick={() => setStep(1)}
          className="w-full py-3 text-gray-400 hover:text-white text-sm font-medium transition-colors"
        >
          {t('back')}
        </button>
      </div>
    </div>
  );
}
