'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import { useTranslations } from 'next-intl';
import { useTypedLocale } from '@/hooks/useTypedLocale';
import { categories, menuItems, vegetarianItemIds } from '@/data/menu';
import { Category } from '@/types/menu';
import { getScrollRoot } from '@/lib/constants';
import CategoryTabs, { categoryIcons } from '@/components/menu/CategoryTabs';
import ProductCard from '@/components/menu/ProductCard';

/* ── Data ── */

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
  const stickyBarRef = useRef<HTMLDivElement>(null);
  const isScrollingRef = useRef(false);

  const sections = buildSections();

  /* ── Scroll spy: detect which category is visible ── */
  useEffect(() => {
    const scrollRoot = getScrollRoot();
    const rafId = { current: 0 };

    const onScroll = () => {
      cancelAnimationFrame(rafId.current);
      rafId.current = requestAnimationFrame(() => {
        if (isScrollingRef.current) return;

        const barH = stickyBarRef.current?.offsetHeight ?? 80;
        // The scroll container's top edge in the viewport
        const rootTop = scrollRoot.getBoundingClientRect().top;
        // Detection line: just below the sticky category bar
        const detectionLine = rootTop + barH + 60;

        // Check if menu section is in view
        const menuEl = document.getElementById('menu');
        if (menuEl) {
          const menuBottom = menuEl.getBoundingClientRect().bottom;
          const menuTop = menuEl.getBoundingClientRect().top;
          // Menu entirely above or below the scroll container view
          if (menuBottom < rootTop || menuTop > rootTop + scrollRoot.clientHeight) {
            setActiveCategory(null);
            return;
          }
        }

        // Find the section whose top is closest to (but above) the detection line
        let best: Category | null = null;
        let bestTop = -Infinity;

        for (const id of allCatIds) {
          const el = document.getElementById(`cat-${id}`);
          if (!el) continue;
          const top = el.getBoundingClientRect().top;
          if (top <= detectionLine && top > bestTop) {
            bestTop = top;
            best = id as Category;
          }
        }

        if (!best) {
          setActiveCategory(null);
          return;
        }

        setActiveCategory(best);
      });
    };

    scrollRoot.addEventListener('scroll', onScroll, { passive: true });
    onScroll(); // check on mount
    return () => {
      scrollRoot.removeEventListener('scroll', onScroll);
      cancelAnimationFrame(rafId.current);
    };
  }, []);

  /* ── Click category → scroll to section ── */
  const scrollToCategory = useCallback((category: Category) => {
    isScrollingRef.current = true;
    setActiveCategory(category);

    const el = document.getElementById(`cat-${category}`);
    if (el) {
      const scrollRoot = getScrollRoot();
      const rootTop = scrollRoot.getBoundingClientRect().top;
      const fixedH = stickyBarRef.current?.offsetHeight ?? 80;
      const y = el.getBoundingClientRect().top - rootTop + scrollRoot.scrollTop - fixedH - 16;
      scrollRoot.scrollTo({ top: y, behavior: 'smooth' });
    }

    setTimeout(() => {
      isScrollingRef.current = false;
    }, 1000);
  }, []);

  /* ── Render ── */
  return (
    <section id="menu" className="pt-10 pb-16 sm:pt-14 sm:pb-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="text-3xl sm:text-4xl font-bold text-white text-center mb-10">
          {t('title')}
        </h2>

        <div
          ref={stickyBarRef}
          className="sticky top-0 z-40 -mx-4 sm:-mx-6 lg:-mx-8 px-4 sm:px-6 lg:px-8 py-3 bg-dark border-b border-gray-800/40"
        >
          <CategoryTabs activeCategory={activeCategory} onSelect={scrollToCategory} />
        </div>

        <div className="mt-10 space-y-12">
          {sections.map((section) => {
            const Icon = categoryIcons[section.id];
            return (
              <div key={section.id} id={`cat-${section.id}`}>
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
            );
          })}
        </div>
      </div>
    </section>
  );
}
