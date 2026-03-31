export function formatPrice(amount: number): string {
  return `$${amount.toLocaleString('es-CO')}`;
}

export function cn(...classes: (string | boolean | undefined | null)[]): string {
  return classes.filter(Boolean).join(' ');
}
