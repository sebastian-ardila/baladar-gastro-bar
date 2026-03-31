'use client';

import { useTranslations } from 'next-intl';
import { Link } from '@/i18n/navigation';
import { HiOutlineBookOpen } from 'react-icons/hi2';
import Button from '@/components/ui/Button';

export default function HistoriaPage() {
  const t = useTranslations('history');

  return (
    <div className="pt-28 pb-16 min-h-screen">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-3xl sm:text-4xl font-bold text-white text-center mb-10">
          {t('title')}
        </h1>

        <div className="space-y-6 mb-12">
          <div className="bg-dark-light rounded-2xl p-6 sm:p-8 border border-gray-800">
            <p className="text-gray-300 text-lg leading-relaxed">{t('p1')}</p>
          </div>

          <div className="bg-dark-card rounded-2xl p-6 sm:p-8 border border-accent/20">
            <p className="text-accent italic text-xl font-medium text-center leading-relaxed">
              &ldquo;{t('tagline')}&rdquo;
            </p>
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

        {/* CTA Card */}
        <div className="bg-gradient-to-br from-accent/20 to-dark-card rounded-2xl p-8 sm:p-10 border border-accent/30 text-center">
          <HiOutlineBookOpen className="w-12 h-12 text-accent mx-auto mb-4" />
          <h3 className="text-2xl font-bold text-white mb-4">{t('cta')}</h3>
          <Link href="/#menu">
            <Button size="lg">{t('cta')}</Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
