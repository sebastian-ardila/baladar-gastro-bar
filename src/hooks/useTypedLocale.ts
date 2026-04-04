import { useLocale } from 'next-intl';
import type { Locale } from '@/i18n/routing';

export function useTypedLocale(): Locale {
  return useLocale() as Locale;
}
