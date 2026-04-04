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
    <html lang={locale}>
      <body className="bg-dark text-white font-sans h-[100dvh] overflow-hidden flex flex-col">
        <NextIntlClientProvider messages={messages}>
          <CartProvider>
            {/* Navbar outside scroll container — always visible */}
            <Navbar />
            <Breadcrumb />

            {/* Scroll container — Chrome mobile can't hide the navbar because
                scrolling happens inside this div, not on the document */}
            <div id="scroll-root" className="flex-1 overflow-y-auto">
              <main>{children}</main>
              <Footer />
            </div>

            <FloatingCartBadge />
            <CartDrawer />
          </CartProvider>
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
