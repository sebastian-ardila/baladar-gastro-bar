import { getTranslations, setRequestLocale } from 'next-intl/server';
import { restaurant } from '@/data/restaurant';
import { HiOutlineMapPin, HiOutlineClock, HiArrowTopRightOnSquare } from 'react-icons/hi2';
import ReservationForm from '@/components/forms/ReservationForm';
import PageCTA from '@/components/ui/PageCTA';
import type { Locale } from '@/i18n/routing';

export default async function ReservasPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale: rawLocale } = await params;
  setRequestLocale(rawLocale);
  const locale = rawLocale as Locale;
  const t = await getTranslations('reservation');

  return (
    <div className="pt-28 pb-16 min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-3xl sm:text-4xl font-bold text-white text-center mb-2">
          {t('title')}
        </h1>
        <p className="text-gray-400 text-center mb-10">{t('subtitle')}</p>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left column — info cards */}
          <div className="space-y-4 lg:order-1 order-2">
            {/* Schedule */}
            <div className="bg-dark-card rounded-2xl p-6 border border-gray-800/60">
              <div className="flex items-center gap-2.5 mb-4">
                <div className="w-8 h-8 rounded-lg bg-white/5 flex items-center justify-center">
                  <HiOutlineClock className="w-4 h-4 text-white/50" />
                </div>
                <h3 className="text-white font-semibold text-sm">{t('hours')}</h3>
              </div>
              <div className="space-y-0.5">
                {restaurant.schedule.map((s, i) => {
                  const isClosed = s.hours[locale] === 'Cerrado' || s.hours[locale] === 'Closed';
                  return (
                    <div key={i} className="flex justify-between text-sm py-2 px-3 rounded-lg hover:bg-white/[0.02] transition-colors">
                      <span className="text-gray-400">{s.days[locale]}</span>
                      <span className={isClosed ? 'text-white/25' : 'text-white/70 font-medium'}>
                        {s.hours[locale]}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Location + directions */}
            <div className="bg-dark-card rounded-2xl p-6 border border-gray-800/60">
              <div className="flex items-center gap-2.5 mb-4">
                <div className="w-8 h-8 rounded-lg bg-white/5 flex items-center justify-center">
                  <HiOutlineMapPin className="w-4 h-4 text-white/50" />
                </div>
                <h3 className="text-white font-semibold text-sm">{t('location')}</h3>
              </div>
              <p className="text-white/60 text-sm">{restaurant.address}</p>
              <p className="text-white/30 text-xs mt-1 mb-5">({restaurant.addressSubtitle[locale]})</p>
              <div className="flex flex-wrap gap-2">
                {[
                  { label: 'Google Maps', href: restaurant.mapsUrl },
                  { label: 'Waze', href: restaurant.wazeUrl },
                  { label: 'Apple Maps', href: restaurant.appleMapsUrl },
                ].map((link) => (
                  <a
                    key={link.label}
                    href={link.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white/5 text-white/50 hover:text-white hover:bg-white/10 transition-colors text-xs font-medium"
                  >
                    {link.label}
                    <HiArrowTopRightOnSquare className="w-3 h-3" />
                  </a>
                ))}
              </div>
            </div>

          </div>

          {/* Right column — form */}
          <div className="lg:col-span-2 lg:order-2 order-1 min-w-0">
            <div className="bg-dark-card rounded-2xl p-4 sm:p-8 border border-gray-800/60">
              <h2 className="text-white font-semibold text-lg mb-1">
                {locale === 'es' ? 'Datos de la reserva' : 'Reservation details'}
              </h2>
              <p className="text-white/30 text-xs mb-6">
                {locale === 'es' ? 'Completa el formulario y te confirmaremos por WhatsApp' : 'Fill the form and we\'ll confirm via WhatsApp'}
              </p>
              <ReservationForm />
            </div>
          </div>
        </div>

        <PageCTA
          locale={locale}
          secondaryLabel={locale === 'es' ? 'Contactar' : 'Contact'}
          secondaryHref="/contacto/"
        />
      </div>
    </div>
  );
}
