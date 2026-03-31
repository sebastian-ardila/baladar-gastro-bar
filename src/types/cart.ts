import { MenuItem } from './menu';

export interface CartItem extends MenuItem {
  quantity: number;
  comboSelection?: {
    half1: string;
    half2: string;
  };
  withExtra?: boolean;
}

export interface CartState {
  items: CartItem[];
  isOpen: boolean;
  step: 1 | 2;
}

export interface OrderForm {
  name: string;
  paymentMethod: 'transferencia' | 'tarjeta' | 'efectivo' | '';
  orderType: 'mesa' | 'domicilio' | '';
}
