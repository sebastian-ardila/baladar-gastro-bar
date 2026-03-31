'use client';

import { useState } from 'react';
import { useTranslations, useLocale } from 'next-intl';
import { categories, menuItems } from '@/data/menu';
import { Category } from '@/types/menu';
import CategoryTabs from '@/components/menu/CategoryTabs';
import ProductCard from '@/components/menu/ProductCard';

export default function MenuSection() {
  const t = useTranslations('menu');
  const locale = useLocale() as 'es' | 'en';
  const [activeCategory, setActiveCategory] = useState<Category | 'all'>('all');

  const filteredItems =
    activeCategory === 'all'
      ? menuItems
      : menuItems.filter((item) => item.category === activeCategory);

  // Group items by category for "all" view
  const groupedByCategory = categories
    .filter((cat) =>
      activeCategory === 'all'
        ? menuItems.some((item) => item.category === cat.id)
        : cat.id === activeCategory
    )
    .map((cat) => ({
      ...cat,
      items: filteredItems.filter((item) => item.category === cat.id),
    }))
    .filter((group) => group.items.length > 0);

  return (
    <section id="menu" className="pt-10 pb-16 sm:pt-14 sm:pb-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="text-3xl sm:text-4xl font-bold text-white text-center mb-10">
          {t('title')}
        </h2>

        <CategoryTabs
          activeCategory={activeCategory}
          onSelect={setActiveCategory}
        />

        <div className="mt-10 space-y-12">
          {groupedByCategory.map((group) => (
            <div key={group.id}>
              <h3 className="text-2xl font-bold text-white mb-6 flex items-center gap-2">
                <span>{group.emoji}</span>
                {group.name[locale]}
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                {group.items.map((item) => (
                  <ProductCard key={item.id} item={item} />
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
