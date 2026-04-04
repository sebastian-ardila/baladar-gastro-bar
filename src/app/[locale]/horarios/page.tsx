import { getTranslations, setRequestLocale } from 'next-intl/server';
import { restaurant } from '@/data/restaurant';
import { buildWhatsAppUrl } from '@/lib/whatsapp';
import { HiOutlineMapPin, HiOutlineClock, HiArrowTopRightOnSquare } from 'react-icons/hi2';
import { FaWhatsapp } from 'react-icons/fa';
import Button from '@/components/ui/Button';
import PageCTA from '@/components/ui/PageCTA';
import type { Locale } from '@/i18n/routing';

export default async function HorariosPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale: rawLocale } = await params;
  setRequestLocale(rawLocale);
  const locale = rawLocale as Locale;
  const t = await getTranslations('schedule');

  return (
    <div className="pt-24 pb-16 min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-3xl sm:text-4xl font-bold text-white text-center mb-2">
          {t('title')}
        </h1>
        <p className="text-gray-400 text-center mb-10">{t('subtitle')}</p>

        {/* How to get there */}
        <div className="bg-dark-light rounded-xl p-5 border border-gray-800 mb-8">
          <div className="flex items-center gap-2 mb-3">
            <HiOutlineMapPin className="w-5 h-5 text-accent" />
            <h3 className="text-white font-semibold text-sm">
              {locale === 'es' ? 'Cómo llegar' : 'How to get there'}
            </h3>
          </div>
          <p className="text-gray-500 text-xs mb-4">{restaurant.address}</p>
          <div className="flex flex-wrap gap-2">
            <a
              href={restaurant.mapsUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white/5 text-white/60 hover:text-white hover:bg-white/10 transition-colors text-xs font-medium"
            >
              Google Maps
              <HiArrowTopRightOnSquare className="w-3 h-3" />
            </a>
            <a
              href={restaurant.wazeUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white/5 text-white/60 hover:text-white hover:bg-white/10 transition-colors text-xs font-medium"
            >
              Waze
              <HiArrowTopRightOnSquare className="w-3 h-3" />
            </a>
            <a
              href={restaurant.appleMapsUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white/5 text-white/60 hover:text-white hover:bg-white/10 transition-colors text-xs font-medium"
            >
              Apple Maps
              <HiArrowTopRightOnSquare className="w-3 h-3" />
            </a>
          </div>
        </div>

        {/* Schedule cards */}
        <div className="space-y-4 mb-12">
          {restaurant.schedule.map((s, i) => {
            const isClosed = s.hours[locale] === 'Cerrado' || s.hours[locale] === 'Closed';
            return (
              <div
                key={i}
                className={`bg-dark-light rounded-2xl p-6 sm:p-8 border ${
                  isClosed ? 'border-gray-800/50' : 'border-gray-800'
                } flex items-center justify-between`}
              >
                <div className="flex items-center gap-4">
                  <HiOutlineClock className={`w-8 h-8 ${isClosed ? 'text-gray-600' : 'text-gray-400'}`} />
                  <h3 className="text-white font-bold text-lg sm:text-xl">
                    {s.days[locale]}
                  </h3>
                </div>
                <span className={`font-bold text-lg sm:text-xl ${isClosed ? 'text-gray-600' : 'text-gray-300'}`}>
                  {s.hours[locale]}
                </span>
              </div>
            );
          })}
        </div>

        {/* WhatsApp order */}
        <div className="flex justify-center mb-4">
          <a
            href={buildWhatsAppUrl(locale === 'es' ? 'Hola! Quiero hacer un pedido' : 'Hi! I want to place an order')}
            target="_blank"
            rel="noopener noreferrer"
          >
            <Button size="lg">
              <FaWhatsapp className="w-5 h-5" />
              {t('orderWhatsApp')}
            </Button>
          </a>
        </div>

        <PageCTA
          locale={locale}
          secondaryLabel={locale === 'es' ? 'Reservar' : 'Book a table'}
          secondaryHref="/reservas/"
        />
      </div>
    </div>
  );
}
