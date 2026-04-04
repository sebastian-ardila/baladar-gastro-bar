export type Category =
  | 'calientes'
  | 'cockteles'
  | 'cervezas-barril'
  | 'pizzas'
  | 'pizzas-especiales'
  | 'cervezas'
  | 'cervezas-artesanales'
  | 'licores-vinos'
  | 'bebidas-frias'
  | 'comidas'
  | 'postres'
  | 'almuerzos'
  | 'vegetariano';

export interface MenuItem {
  id: string;
  name: { es: string; en: string };
  category: Category;
  price: number;
  description?: { es: string; en: string };
  emoji?: string;
  image?: string;
  isCombo?: boolean;
  comboPrice?: number;
  comboOptions?: string[];
  hasExtraOption?: boolean;
  extraOptionPrice?: number;
  extraOptionLabel?: { es: string; en: string };
  isSpecialNote?: boolean;
}

export interface CategoryInfo {
  id: Category;
  name: { es: string; en: string };
  emoji: string;
}
