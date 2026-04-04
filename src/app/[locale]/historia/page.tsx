import { getTranslations, setRequestLocale } from 'next-intl/server';
import PageCTA from '@/components/ui/PageCTA';

export default async function HistoriaPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations('history');

  return (
    <div className="pt-28 pb-16 min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-3xl sm:text-4xl font-bold text-white text-center mb-10">
          {t('title')}
        </h1>

        <div className="space-y-6 mb-12">
          <div className="bg-dark-light rounded-2xl p-6 sm:p-8 border border-gray-800">
            <p className="text-gray-300 text-lg leading-relaxed">{t('p1')}</p>
          </div>

          <div className="rounded-2xl overflow-hidden border border-accent/20 relative">
            <img
              src="https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=1200&q=80&auto=format&fit=crop"
              alt=""
              className="absolute inset-0 w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-dark/85" />
            <div className="relative py-12 sm:py-16 px-8 sm:px-12 text-center">
              <p className="text-emerald-400/80 italic text-2xl sm:text-3xl font-semibold leading-relaxed drop-shadow-lg">
                &ldquo;{t('tagline')}&rdquo;
              </p>
            </div>
          </div>

          <div className="bg-dark-light rounded-2xl p-6 sm:p-8 border border-gray-800">
            <p className="text-gray-300 text-lg leading-relaxed">{t('p2')}</p>
          </div>

          <div className="bg-dark-light rounded-2xl p-6 sm:p-8 border border-gray-800">
            <p className="text-gray-300 text-lg leading-relaxed">{t('p3')}</p>
          </div>

          <div className="bg-dark-light rounded-2xl p-6 sm:p-8 border border-gray-800">
            <p className="text-gray-300 text-lg leading-relaxed">{t('p4')}</p>
          </div>
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
