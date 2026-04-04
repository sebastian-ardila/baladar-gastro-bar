import { NextIntlClientProvider } from 'next-intl';
import { getMessages, setRequestLocale } from 'next-intl/server';
import { notFound } from 'next/navigation';
import { routing } from '@/i18n/routing';
import { CartProvider } from '@/context/CartContext';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import Breadcrumb from '@/components/layout/Breadcrumb';
import CartDrawer from '@/components/cart/CartDrawer';
import FloatingCartBadge from '@/components/cart/FloatingCartBadge';
import '../globals.css';

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

export default async function LocaleLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;

  if (!routing.locales.includes(locale as 'es' | 'en')) {
    notFound();
  }

  setRequestLocale(locale);
  const messages = await getMessages();

  return (
    <html lang={locale} className="scroll-smooth">
      <body className="bg-dark text-white font-sans min-h-screen flex flex-col">
        <NextIntlClientProvider messages={messages}>
          <CartProvider>
            <div className="sticky top-0 z-50">
              <Navbar />
              <Breadcrumb />
            </div>
            <main className="flex-1">{children}</main>
            <Footer />
            <FloatingCartBadge />
            <CartDrawer />
          </CartProvider>
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
