'use client';

import { useTranslations } from 'next-intl';
import { Link } from '@/i18n/navigation';
import Button from '@/components/ui/Button';

export default function HeroSection() {
  const t = useTranslations('hero');

  const handleScroll = () => {
    const el = document.getElementById('menu');
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  };

  const basePath = process.env.NEXT_PUBLIC_BASE_PATH || '';

  return (
    <section className="relative h-screen flex items-center justify-center overflow-hidden">
      {/* Video Background */}
      <video
        autoPlay
        muted
        loop
        playsInline
        preload="none"
        className="absolute inset-0 w-full h-full object-cover"
      >
        <source src={`${basePath}/hero-video.webm`} type="video/webm" />
      </video>

      {/* Base dark tint over video */}
      <div className="absolute inset-0 bg-black/65" />

      {/* Radial vignette - darker center for logo contrast */}
      <div
        className="absolute inset-0"
        style={{
          background: 'radial-gradient(ellipse 55% 55% at center, rgba(0,0,0,0.7) 0%, rgba(0,0,0,0.45) 50%, rgba(0,0,0,0) 80%)',
        }}
      />

      {/* Content */}
      <div className="relative z-10 text-center px-4 max-w-4xl mx-auto flex flex-col items-center">
        {/* Logo */}
        <img
          src={`${basePath}/logo-company-2.webp`}
          alt="Baladar Gastro Bar"
          width={500}
          height={500}
          className="w-72 sm:w-96 md:w-[28rem] lg:w-[32rem] h-auto mb-4"
          style={{
            animation: 'neon-pulse 4s ease-in-out infinite',
          }}
        />

        {/* Subtitle - two lines, "saludable" in green */}
        <div className="mb-8">
          <p className="text-lg sm:text-xl md:text-2xl text-gray-200 font-light tracking-wide">
            {t.rich('line1', {
              green: (chunks) => (
                <span className="text-accent-light font-medium">{chunks}</span>
              ),
            })}
          </p>
          <p className="text-base sm:text-lg md:text-xl text-gray-400 font-light tracking-wide mt-1">
            {t('line2')}
          </p>
        </div>

        <div className="flex flex-col sm:flex-row gap-4">
          <Button onClick={handleScroll} size="lg">
            {t('cta')}
          </Button>
          <Link
            href="/reservas"
            className="px-8 py-4 text-lg font-medium text-white/80 hover:text-white transition-all underline underline-offset-4 decoration-white/30 hover:decoration-white/70"
          >
            {t('cta2')}
          </Link>
        </div>
      </div>
    </section>
  );
}
