'use client';

import { useTranslations, useLocale } from 'next-intl';
import { Category } from '@/types/menu';
import { IconType } from 'react-icons';
import {
  PiGridFourFill,
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
} from 'react-icons/pi';

interface CategoryTabsProps {
  activeCategory: Category | 'all';
  onSelect: (category: Category | 'all') => void;
}

interface CategoryButton {
  id: Category | 'all';
  label: { es: string; en: string };
  icon: IconType;
}

const foodCategories: CategoryButton[] = [
  { id: 'all', label: { es: 'Todas', en: 'All' }, icon: PiGridFourFill },
  { id: 'almuerzos', label: { es: 'Almuerzos', en: 'Lunch' }, icon: PiCookingPotFill },
  { id: 'comidas', label: { es: 'Comidas', en: 'Food' }, icon: PiHamburgerFill },
  { id: 'pizzas', label: { es: 'Pizzas', en: 'Pizzas' }, icon: PiPizzaFill },
  { id: 'pizzas-especiales', label: { es: 'Especiales', en: 'Special' }, icon: PiStarFill },
  { id: 'postres', label: { es: 'Postres', en: 'Desserts' }, icon: PiIceCreamFill },
];

const drinkCategories: CategoryButton[] = [
  { id: 'calientes', label: { es: 'Calientes', en: 'Hot' }, icon: PiCoffeeFill },
  { id: 'cockteles', label: { es: 'Cócteles', en: 'Cocktails' }, icon: PiMartiniFill },
  { id: 'cervezas-barril', label: { es: 'De Barril', en: 'Draft' }, icon: PiBeerSteinFill },
  { id: 'cervezas', label: { es: 'Cervezas', en: 'Beers' }, icon: PiBeerBottleFill },
  { id: 'cervezas-artesanales', label: { es: 'Artesanales', en: 'Craft' }, icon: PiMountainsFill },
  { id: 'licores-vinos', label: { es: 'Licores', en: 'Spirits' }, icon: PiWineFill },
  { id: 'bebidas-frias', label: { es: 'Frías', en: 'Cold' }, icon: PiSnowflakeFill },
];

function CategoryButton({
  item,
  active,
  onSelect,
  locale,
}: {
  item: CategoryButton;
  active: boolean;
  onSelect: (id: Category | 'all') => void;
  locale: 'es' | 'en';
}) {
  const Icon = item.icon;
  return (
    <button
      onClick={() => onSelect(item.id)}
      className={`flex items-center gap-2 px-3 py-2 rounded-lg text-xs font-medium whitespace-nowrap transition-all ${
        active
          ? 'bg-accent text-white'
          : 'text-white/40 hover:text-white/70 hover:bg-white/[0.04]'
      }`}
    >
      <Icon className="w-3.5 h-3.5 shrink-0" />
      {item.label[locale]}
    </button>
  );
}

export default function CategoryTabs({ activeCategory, onSelect }: CategoryTabsProps) {
  const locale = useLocale() as 'es' | 'en';

  const allCategories = [...foodCategories, ...drinkCategories];

  return (
    <div className="flex flex-wrap gap-1.5">
      {allCategories.map((item) => (
        <CategoryButton
          key={item.id}
          item={item}
          active={activeCategory === item.id}
          onSelect={onSelect}
          locale={locale}
        />
      ))}
    </div>
  );
}
