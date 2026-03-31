'use client';

import { useTranslations } from 'next-intl';
import Button from '@/components/ui/Button';

export default function HeroSection() {
  const t = useTranslations('hero');

  const handleScroll = () => {
    const el = document.getElementById('menu');
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <section className="relative h-screen flex items-center justify-center overflow-hidden">
      {/* Video Background */}
      <video
        autoPlay
        muted
        loop
        playsInline
        preload="metadata"
        className="absolute inset-0 w-full h-full object-cover"
      >
        <source src={`${process.env.NEXT_PUBLIC_BASE_PATH || ''}/hero-video.mp4`} type="video/mp4" />
      </video>

      {/* Overlay */}
      <div className="absolute inset-0 bg-black/60" />

      {/* Content */}
      <div className="relative z-10 text-center px-4 max-w-3xl mx-auto">
        <div className="flex items-center justify-center gap-3 mb-6">
          <div className="w-14 h-14 bg-accent rounded-full flex items-center justify-center">
            <span className="text-white font-bold text-2xl">B</span>
          </div>
        </div>
        <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold text-white mb-6 leading-tight">
          Baladar <span className="text-accent">Gastro Bar</span>
        </h1>
        <p className="text-lg sm:text-xl md:text-2xl text-gray-200 mb-10 leading-relaxed font-light">
          {t('phrase')}
        </p>
        <Button onClick={handleScroll} size="lg">
          {t('cta')}
        </Button>
      </div>

      {/* Scroll indicator */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-bounce">
        <div className="w-6 h-10 border-2 border-white/30 rounded-full flex justify-center">
          <div className="w-1 h-3 bg-white/50 rounded-full mt-2" />
        </div>
      </div>
    </section>
  );
}
