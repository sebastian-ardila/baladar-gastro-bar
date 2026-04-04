'use client';

import { useEffect, useRef } from 'react';
import { useTypedLocale } from '@/hooks/useTypedLocale';
import { Category } from '@/types/menu';
import { IconType } from 'react-icons';
import {
  PiCookingPotFill,
  PiHamburgerFill,
  PiPizzaFill,
  PiStarFill,
  PiIceCreamFill,
  PiCoffeeFill,
  PiMartiniFill,
  PiBeerBottleFill,
  PiBeerSteinFill,
  PiMountainsFill,
  PiWineFill,
  PiSnowflakeFill,
  PiLeafFill,
} from 'react-icons/pi';

/* ── Types ── */

interface CategoryTabsProps {
  activeCategory: Category | null;
  onSelect: (category: Category) => void;
}

interface Tab {
  id: Category;
  label: { es: string; en: string };
  icon: IconType;
}

/* ── Data ── */

/** Icon map exported so other components (e.g. section headings) can reuse it */
export const categoryIcons: Record<string, IconType> = {
  almuerzos: PiCookingPotFill,
  comidas: PiHamburgerFill,
  pizzas: PiPizzaFill,
  'pizzas-especiales': PiStarFill,
  postres: PiIceCreamFill,
  calientes: PiCoffeeFill,
  cockteles: PiMartiniFill,
  'cervezas-barril': PiBeerSteinFill,
  cervezas: PiBeerBottleFill,
  'cervezas-artesanales': PiMountainsFill,
  'licores-vinos': PiWineFill,
  'bebidas-frias': PiSnowflakeFill,
  vegetariano: PiLeafFill,
};

const tabs: Tab[] = [
  { id: 'almuerzos', label: { es: 'Almuerzos', en: 'Lunch' }, icon: PiCookingPotFill },
  { id: 'comidas', label: { es: 'Comidas', en: 'Food' }, icon: PiHamburgerFill },
  { id: 'pizzas', label: { es: 'Pizzas', en: 'Pizzas' }, icon: PiPizzaFill },
  { id: 'pizzas-especiales', label: { es: 'Especiales', en: 'Special' }, icon: PiStarFill },
  { id: 'postres', label: { es: 'Postres', en: 'Desserts' }, icon: PiIceCreamFill },
  { id: 'calientes', label: { es: 'Calientes', en: 'Hot' }, icon: PiCoffeeFill },
  { id: 'cockteles', label: { es: 'Cócteles', en: 'Cocktails' }, icon: PiMartiniFill },
  { id: 'cervezas-barril', label: { es: 'De Barril', en: 'Draft' }, icon: PiBeerSteinFill },
  { id: 'cervezas', label: { es: 'Cervezas', en: 'Beers' }, icon: PiBeerBottleFill },
  { id: 'cervezas-artesanales', label: { es: 'Artesanales', en: 'Craft' }, icon: PiMountainsFill },
  { id: 'licores-vinos', label: { es: 'Licores', en: 'Spirits' }, icon: PiWineFill },
  { id: 'bebidas-frias', label: { es: 'Frías', en: 'Cold' }, icon: PiSnowflakeFill },
  { id: 'vegetariano', label: { es: 'Vegetariano', en: 'Vegetarian' }, icon: PiLeafFill },
];

/* ── Component ── */

export default function CategoryTabs({ activeCategory, onSelect }: CategoryTabsProps) {
  const locale = useTypedLocale();
  const containerRef = useRef<HTMLDivElement>(null);
  const btnMap = useRef<Map<string, HTMLButtonElement>>(new Map());

  // Keep the active button scrolled into view
  useEffect(() => {
    if (!activeCategory) return;
    const btn = btnMap.current.get(activeCategory);
    if (!btn || !containerRef.current) return;

    const bRect = btn.getBoundingClientRect();
    const cRect = containerRef.current.getBoundingClientRect();

    if (bRect.left < cRect.left || bRect.right > cRect.right) {
      btn.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'center' });
    }
  }, [activeCategory]);

  return (
    <div ref={containerRef} className="overflow-x-auto scrollbar-hide">
      {/* 3 rows mobile, 2 rows desktop — items flow in columns */}
      <div className="grid grid-rows-3 sm:grid-rows-2 grid-flow-col gap-1 sm:gap-1.5 w-max">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeCategory === tab.id;

          return (
            <button
              key={tab.id}
              ref={(el) => {
                if (el) btnMap.current.set(tab.id, el);
                else btnMap.current.delete(tab.id);
              }}
              onClick={() => onSelect(tab.id)}
              className={`
                flex items-center gap-1 sm:gap-2
                px-2 py-1.5 sm:px-3 sm:py-2
                rounded-lg text-[10px] sm:text-xs font-medium
                whitespace-nowrap transition-all
                ${isActive
                  ? 'bg-accent text-white shadow-lg shadow-accent/20'
                  : 'text-white/40 hover:text-white/70 hover:bg-white/[0.04]'
                }
              `}
            >
              <Icon className="w-3 h-3 sm:w-3.5 sm:h-3.5 shrink-0" />
              {tab.label[locale]}
            </button>
          );
        })}
      </div>
    </div>
  );
}
