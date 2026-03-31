'use client';

import { useTranslations, useLocale } from 'next-intl';
import { categories } from '@/data/menu';
import { Category } from '@/types/menu';

interface CategoryTabsProps {
  activeCategory: Category | 'all';
  onSelect: (category: Category | 'all') => void;
}

export default function CategoryTabs({ activeCategory, onSelect }: CategoryTabsProps) {
  const t = useTranslations('menu');
  const locale = useLocale() as 'es' | 'en';

  return (
    <div className="overflow-x-auto scrollbar-hide -mx-4 px-4 border-b border-gray-800">
      <div className="flex gap-0 min-w-max">
        <button
          onClick={() => onSelect('all')}
          className={`px-5 py-3 text-sm font-medium whitespace-nowrap transition-all relative ${
            activeCategory === 'all'
              ? 'text-accent'
              : 'text-gray-400 hover:text-white'
          }`}
        >
          {t('all')}
          {activeCategory === 'all' && (
            <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-accent" />
          )}
        </button>
        {categories.map((cat) => (
          <button
            key={cat.id}
            onClick={() => onSelect(cat.id)}
            className={`px-5 py-3 text-sm font-medium whitespace-nowrap transition-all flex items-center gap-1.5 relative ${
              activeCategory === cat.id
                ? 'text-accent'
                : 'text-gray-400 hover:text-white'
            }`}
          >
            <span>{cat.emoji}</span>
            {cat.name[locale]}
            {activeCategory === cat.id && (
              <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-accent" />
            )}
          </button>
        ))}
      </div>
    </div>
  );
}
