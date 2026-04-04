import { getLocalePath } from '@/lib/navigation';
import { getAssetPath } from '@/lib/constants';
import Button from './Button';

interface PageCTAProps {
  locale: string;
  secondaryLabel: string;
  secondaryHref: string;
}

export default function PageCTA({ locale, secondaryLabel, secondaryHref }: PageCTAProps) {
  const menuLabel = locale === 'es' ? 'Ver carta' : 'View menu';
  const heading = locale === 'es'
    ? 'Descubre todo lo que Baladar tiene para ti'
    : 'Discover everything Baladar has for you';

  return (
    <div className="mt-16">
      <div className="h-px bg-gradient-to-r from-transparent via-white/10 to-transparent" />

      <div className="relative overflow-hidden rounded-2xl mt-10 border border-white/[0.06]">
        {/* Background image */}
        <img
          src="https://images.unsplash.com/photo-1476224203421-9ac39bcb3327?w=1200&q=80&auto=format&fit=crop"
          alt=""
          className="absolute inset-0 w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-dark/90" />

        {/* Content */}
        <div className="relative py-12 sm:py-16 px-6 sm:px-10 text-center flex flex-col items-center">
          <img
            src={getAssetPath('/logo-company-2.webp')}
            alt="Baladar"
            width={80}
            height={80}
            className="w-16 sm:w-20 h-auto opacity-40 mb-5"
          />
          <p className="text-white/70 text-lg sm:text-2xl font-light leading-relaxed max-w-lg mb-8">
            {heading}
          </p>
          <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 w-full sm:w-auto">
            <a href={getLocalePath('/', locale) + '#menu'} className="w-full sm:w-auto">
              <Button size="lg" className="w-full sm:w-auto">{menuLabel}</Button>
            </a>
            <a href={getLocalePath(secondaryHref, locale)} className="w-full sm:w-auto">
              <Button variant="secondary" size="lg" className="w-full sm:w-auto">{secondaryLabel}</Button>
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
