import { getTranslations, setRequestLocale } from 'next-intl/server';
import { restaurant } from '@/data/restaurant';
import { FaInstagram, FaWhatsapp, FaEnvelope } from 'react-icons/fa';
import { HiOutlineMapPin } from 'react-icons/hi2';
import ContactForm from '@/components/forms/ContactForm';
import PageCTA from '@/components/ui/PageCTA';
import type { Locale } from '@/i18n/routing';

export default async function ContactoPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale: rawLocale } = await params;
  setRequestLocale(rawLocale);
  const locale = rawLocale as Locale;
  const t = await getTranslations('contact');

  return (
    <div className="pt-28 pb-16 min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-3xl sm:text-4xl font-bold text-white text-center mb-2">
          {t('title')}
        </h1>
        <p className="text-gray-400 text-center mb-10">{t('subtitle')}</p>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Contact info */}
          <div className="space-y-4">
            <a
              href={`https://wa.me/${restaurant.whatsappNumber}`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-4 bg-dark-light rounded-xl p-5 border border-gray-800 hover:border-green-800 transition-colors"
            >
              <FaWhatsapp className="w-6 h-6 text-green-400 shrink-0" />
              <div>
                <p className="text-white font-medium text-sm">WhatsApp</p>
                <p className="text-gray-400 text-sm">{restaurant.whatsapp}</p>
              </div>
            </a>

            <a
              href={restaurant.instagramUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-4 bg-dark-light rounded-xl p-5 border border-gray-800 hover:border-pink-800 transition-colors"
            >
              <FaInstagram className="w-6 h-6 text-pink-400 shrink-0" />
              <div>
                <p className="text-white font-medium text-sm">Instagram</p>
                <p className="text-gray-400 text-sm">{restaurant.instagram}</p>
              </div>
            </a>

            <a
              href={`mailto:${restaurant.email}`}
              className="flex items-center gap-4 bg-dark-light rounded-xl p-5 border border-gray-800 hover:border-blue-800 transition-colors"
            >
              <FaEnvelope className="w-6 h-6 text-blue-400 shrink-0" />
              <div>
                <p className="text-white font-medium text-sm">Email</p>
                <p className="text-gray-400 text-sm">{restaurant.email}</p>
              </div>
            </a>

            <div className="flex items-center gap-4 bg-dark-light rounded-xl p-5 border border-gray-800">
              <HiOutlineMapPin className="w-6 h-6 text-accent shrink-0" />
              <div>
                <p className="text-white font-medium text-sm">{restaurant.address}</p>
                <p className="text-gray-500 text-xs mt-1">({restaurant.addressSubtitle[locale]})</p>
              </div>
            </div>
          </div>

          {/* Form */}
          <div className="lg:col-span-2 min-w-0 bg-dark-card rounded-2xl p-4 sm:p-8 border border-gray-800 overflow-hidden">
            <ContactForm />
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
