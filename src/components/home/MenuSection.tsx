'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import { useTranslations } from 'next-intl';
import { useTypedLocale } from '@/hooks/useTypedLocale';
import { categories, menuItems, vegetarianItemIds } from '@/data/menu';
import { Category } from '@/types/menu';
import { NAVBAR_HEIGHT } from '@/lib/constants';
import CategoryTabs, { categoryIcons } from '@/components/menu/CategoryTabs';
import ProductCard from '@/components/menu/ProductCard';
import LazySection from '@/components/menu/LazySection';

/* ── Helpers ── */

function buildSections() {
  return categories
    .map((cat) => ({
      ...cat,
      items:
        cat.id === 'vegetariano'
          ? menuItems.filter((i) => vegetarianItemIds.includes(i.id))
          : menuItems.filter((i) => i.category === cat.id),
    }))
    .filter((g) => g.items.length > 0);
}

const allCatIds = buildSections().map((s) => s.id);

/* ── Component ── */

export default function MenuSection() {
  const t = useTranslations('menu');
  const locale = useTypedLocale();

  const [activeCategory, setActiveCategory] = useState<Category | null>(null);
  const [forced, setForced] = useState<Set<string>>(new Set());

  const stickyBarEl = useRef<HTMLDivElement>(null);
  const isScrollingRef = useRef(false);
  const observerRef = useRef<IntersectionObserver | null>(null);
  const observedIds = useRef<Set<string>>(new Set());

  const sections = buildSections();

  /* ── 1. Create IntersectionObserver once ── */
  useEffect(() => {
    const offset = NAVBAR_HEIGHT + 160;

    observerRef.current = new IntersectionObserver(
      (entries) => {
        if (isScrollingRef.current) return;
        for (const entry of entries) {
          if (entry.isIntersecting) {
            setActiveCategory(entry.target.id.replace('cat-', '') as Category);
          }
        }
      },
      { rootMargin: `-${offset}px 0px -60% 0px`, threshold: 0 },
    );

    return () => observerRef.current?.disconnect();
  }, []);

  /* ── 2. Scan for new section elements and observe them ── */
  useEffect(() => {
    const scan = () => {
      const observer = observerRef.current;
      if (!observer) return;

      allCatIds.forEach((id) => {
        if (observedIds.current.has(id)) return;
        const el = document.getElementById(`cat-${id}`);
        if (el) {
          observer.observe(el);
          observedIds.current.add(id);
        }
      });
    };

    // Scan immediately + on every scroll (lazy sections mount as user scrolls)
    scan();
    window.addEventListener('scroll', scan, { passive: true });
    // Also scan periodically for the first few seconds (covers page restore)
    const t1 = setTimeout(scan, 100);
    const t2 = setTimeout(scan, 500);
    const t3 = setTimeout(scan, 1000);

    return () => {
      window.removeEventListener('scroll', scan);
      clearTimeout(t1);
      clearTimeout(t2);
      clearTimeout(t3);
    };
  }, []);

  /* ── 3. Clear active when menu is not in sticky zone ── */
  useEffect(() => {
    const onScroll = () => {
      if (isScrollingRef.current) return;
      const bar = stickyBarEl.current;
      if (!bar) return;

      const barRect = bar.getBoundingClientRect();
      const isStuck = barRect.top <= NAVBAR_HEIGHT + 1;

      if (!isStuck) {
        setActiveCategory(null);
      }
    };

    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  /* ── 4. Click category → force-render + scroll ── */
  const handleSelect = useCallback((category: Category) => {
    setForced((prev) => new Set(prev).add(category));
    isScrollingRef.current = true;
    setActiveCategory(category);

    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        const el = document.getElementById(`cat-${category}`);
        if (el) {
          // Observe it if not already
          if (!observedIds.current.has(category) && observerRef.current) {
            observerRef.current.observe(el);
            observedIds.current.add(category);
          }
          const fixedH = stickyBarEl.current?.offsetHeight ?? 80;
          const y = el.getBoundingClientRect().top + window.scrollY - NAVBAR_HEIGHT - fixedH - 16;
          window.scrollTo({ top: y, behavior: 'smooth' });
        }
        setTimeout(() => {
          isScrollingRef.current = false;
        }, 1000);
      });
    });
  }, []);

  /* ── Render ── */
  return (
    <section id="menu" className="pt-10 pb-16 sm:pt-14 sm:pb-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="text-3xl sm:text-4xl font-bold text-white text-center mb-10">
          {t('title')}
        </h2>

        <div
          ref={stickyBarEl}
          className="sticky top-14 z-40 -mx-4 sm:-mx-6 lg:-mx-8 px-4 sm:px-6 lg:px-8 py-3 bg-dark/95 backdrop-blur-md border-b border-gray-800/40"
        >
          <CategoryTabs activeCategory={activeCategory} onSelect={handleSelect} />
        </div>

        <div className="mt-10 space-y-12">
          {sections.map((section) => {
            const Icon = categoryIcons[section.id];
            return (
              <LazySection
                key={section.id}
                minHeight={300}
                forceRender={forced.has(section.id)}
              >
                <div
                  id={`cat-${section.id}`}
                  data-category={section.id}
                >
                  <h3 className="text-2xl font-bold text-white mb-6 flex items-center gap-3">
                    {Icon && <Icon className="w-6 h-6 text-white/40" />}
                    {section.name[locale]}
                  </h3>

                  <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3 sm:gap-4">
                    {section.items.map((item) => (
                      <ProductCard key={item.id} item={item} />
                    ))}
                  </div>
                </div>
              </LazySection>
            );
          })}
        </div>
      </div>
    </section>
  );
}
