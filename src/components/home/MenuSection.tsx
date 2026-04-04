'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import { useTranslations } from 'next-intl';
import { useTypedLocale } from '@/hooks/useTypedLocale';
import { categories, menuItems, vegetarianItemIds } from '@/data/menu';
import { Category } from '@/types/menu';
import { NAVBAR_HEIGHT } from '@/lib/constants';
import CategoryTabs from '@/components/menu/CategoryTabs';
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

/* ── Component ── */

export default function MenuSection() {
  const t = useTranslations('menu');
  const locale = useTypedLocale();

  const [activeCategory, setActiveCategory] = useState<Category | null>(null);
  const [scrollingTo, setScrollingTo] = useState(false);
  const [forced, setForced] = useState<Set<string>>(new Set());

  const sectionEls = useRef<Map<string, HTMLDivElement>>(new Map());
  const menuEl = useRef<HTMLDivElement>(null);
  const stickyBarEl = useRef<HTMLDivElement>(null);
  const rafId = useRef<number>(0);

  const sections = buildSections();

  const getOffset = useCallback(() => {
    const barHeight = stickyBarEl.current?.offsetHeight ?? 80;
    return NAVBAR_HEIGHT + barHeight;
  }, []);

  /* ── Scroll spy: detect which section is at the top ── */
  useEffect(() => {
    const onScroll = () => {
      cancelAnimationFrame(rafId.current);
      rafId.current = requestAnimationFrame(() => {
        if (scrollingTo) return;

        const menu = menuEl.current;
        if (!menu) return;

        const offset = getOffset();
        const menuRect = menu.getBoundingClientRect();

        // Menu is entirely below the viewport or entirely above → deselect
        if (menuRect.bottom < offset || menuRect.top > window.innerHeight) {
          setActiveCategory(null);
          return;
        }

        // Find the section whose top is closest to (but <=) the offset line
        let best: Category | null = null;
        let bestTop = -Infinity;

        for (const [id, el] of sectionEls.current) {
          const top = el.getBoundingClientRect().top;
          if (top <= offset + 60 && top > bestTop) {
            bestTop = top;
            best = id as Category;
          }
        }

        // No section has scrolled past the header yet (still in hero/above menu)
        // → deselect, don't pick a fallback
        if (!best) {
          setActiveCategory(null);
          return;
        }

        setActiveCategory(best);
      });
    };

    window.addEventListener('scroll', onScroll, { passive: true });
    return () => {
      window.removeEventListener('scroll', onScroll);
      cancelAnimationFrame(rafId.current);
    };
  }, [scrollingTo, getOffset]);

  /* ── Click category → force-render + scroll ── */
  const handleSelect = useCallback((category: Category) => {
    setForced((prev) => new Set(prev).add(category));
    setActiveCategory(category);
    setScrollingTo(true);

    requestAnimationFrame(() => {
      const target = document.getElementById(`cat-${category}`);
      if (target) {
        const offset = getOffset();
        const y = target.getBoundingClientRect().top + window.scrollY - offset;
        window.scrollTo({ top: y, behavior: 'smooth' });
      }
      setTimeout(() => setScrollingTo(false), 800);
    });
  }, [getOffset]);

  /* ── Render ── */
  return (
    <section id="menu" ref={menuEl} className="pt-10 pb-16 sm:pt-14 sm:pb-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="text-3xl sm:text-4xl font-bold text-white text-center mb-10">
          {t('title')}
        </h2>

        {/* Sticky category bar */}
        <div
          ref={stickyBarEl}
          className="sticky top-14 z-40 -mx-4 sm:-mx-6 lg:-mx-8 px-4 sm:px-6 lg:px-8 py-3 bg-dark/95 backdrop-blur-md border-b border-gray-800/40"
        >
          <CategoryTabs activeCategory={activeCategory} onSelect={handleSelect} />
        </div>

        {/* Category sections */}
        <div className="mt-10 space-y-12">
          {sections.map((section) => (
            <LazySection
              key={section.id}
              minHeight={300}
              forceRender={forced.has(section.id)}
            >
              <div
                id={`cat-${section.id}`}
                data-category={section.id}
                ref={(el) => {
                  if (el) sectionEls.current.set(section.id, el);
                  else sectionEls.current.delete(section.id);
                }}
              >
                <h3 className="text-2xl font-bold text-white mb-6 flex items-center gap-2">
                  <span>{section.emoji}</span>
                  {section.name[locale]}
                </h3>

                <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3 sm:gap-4">
                  {section.items.map((item) => (
                    <ProductCard key={item.id} item={item} />
                  ))}
                </div>
              </div>
            </LazySection>
          ))}
        </div>
      </div>
    </section>
  );
}
