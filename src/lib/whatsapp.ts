import { CartItem } from '@/types/cart';
import { OrderForm } from '@/types/cart';
import { formatPrice } from './utils';

const WHATSAPP_NUMBER = '573117871855';

export function buildWhatsAppUrl(message: string): string {
  return `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`;
}

export function buildOrderMessage(
  items: CartItem[],
  form: OrderForm,
  locale: string
): string {
  const isEs = locale === 'es';
  const total = items.reduce((sum, item) => {
    let itemPrice = item.price * item.quantity;
    if (item.withExtra && item.extraOptionPrice) {
      itemPrice += item.extraOptionPrice * item.quantity;
    }
    return sum + itemPrice;
  }, 0);

  const orderTypeEmoji = form.orderType === 'mesa' ? '🍽️' : '🛵';
  const orderTypeText = form.orderType === 'mesa'
    ? (isEs ? 'Para la mesa' : 'Dine-in')
    : (isEs ? 'A domicilio' : 'Delivery');

  const paymentText = form.paymentMethod === 'transferencia'
    ? (isEs ? '💳 Transferencia' : '💳 Transfer')
    : form.paymentMethod === 'tarjeta'
    ? (isEs ? '💳 Tarjeta' : '💳 Card')
    : (isEs ? '💵 Efectivo' : '💵 Cash');

  let msg = isEs
    ? `🍽️ *Nuevo Pedido*\n\n`
    : `🍽️ *New Order*\n\n`;

  msg += `👤 ${form.name}\n`;
  msg += `${orderTypeEmoji} ${orderTypeText}\n`;
  msg += `${paymentText}\n\n`;

  items.forEach((item) => {
    const name = item.name[locale as 'es' | 'en'] || item.name.es;
    const itemTotal = item.price * item.quantity;
    msg += `${item.emoji || '▪️'} ${item.quantity}x ${name} ${formatPrice(itemTotal)}\n`;
    if (item.withExtra && item.extraOptionLabel) {
      const extraLabel = item.extraOptionLabel[locale as 'es' | 'en'] || item.extraOptionLabel.es;
      msg += `  + ${extraLabel} ${formatPrice(item.extraOptionPrice! * item.quantity)}\n`;
    }
    if (item.comboSelection) {
      msg += `  🍕 ${item.comboSelection.half1} / ${item.comboSelection.half2}\n`;
    }
  });

  msg += `\n💰 *Total: ${formatPrice(total)}*`;

  return msg;
}

export function buildReservationMessage(data: {
  name: string;
  guests: string;
  date: string;
  time: string;
  comments: string;
}, locale: string): string {
  const isEs = locale === 'es';
  let msg = isEs
    ? `📅 *Reserva*\n\n`
    : `📅 *Reservation*\n\n`;

  msg += `👤 ${data.name}\n`;
  msg += `👥 ${data.guests} ${isEs ? 'personas' : 'guests'}\n`;
  msg += `📆 ${data.date}\n`;
  msg += `🕐 ${data.time}\n`;

  if (data.comments) {
    msg += `\n💬 ${data.comments}`;
  }

  return msg;
}

export function buildContactMessage(data: {
  name: string;
  email: string;
  phone: string;
  interest: string;
  message: string;
}, locale: string): string {
  const isEs = locale === 'es';
  let msg = isEs
    ? `📩 *Contacto*\n\n`
    : `📩 *Contact*\n\n`;

  msg += `👤 ${data.name}\n`;
  msg += `📧 ${data.email}\n`;
  if (data.phone) msg += `📱 ${data.phone}\n`;
  msg += `🏷️ ${data.interest}\n\n`;
  msg += `💬 ${data.message}`;

  return msg;
}
