'use client';

import React, { createContext, useContext, useReducer, useEffect, useCallback } from 'react';
import { CartItem } from '@/types/cart';

interface CartContextType {
  items: CartItem[];
  isOpen: boolean;
  step: 1 | 2;
  addItem: (item: CartItem) => void;
  removeItem: (id: string) => void;
  incrementItem: (id: string) => void;
  decrementItem: (id: string) => void;
  clearCart: () => void;
  toggleCart: () => void;
  openCart: () => void;
  closeCart: () => void;
  setStep: (step: 1 | 2) => void;
  getQuantity: (id: string) => number;
  totalItems: number;
  subtotal: number;
}

type Action =
  | { type: 'ADD_ITEM'; payload: CartItem }
  | { type: 'REMOVE_ITEM'; payload: string }
  | { type: 'INCREMENT'; payload: string }
  | { type: 'DECREMENT'; payload: string }
  | { type: 'CLEAR_CART' }
  | { type: 'TOGGLE_CART' }
  | { type: 'OPEN_CART' }
  | { type: 'CLOSE_CART' }
  | { type: 'SET_STEP'; payload: 1 | 2 }
  | { type: 'LOAD_CART'; payload: CartItem[] };

interface State {
  items: CartItem[];
  isOpen: boolean;
  step: 1 | 2;
}

function cartReducer(state: State, action: Action): State {
  switch (action.type) {
    case 'ADD_ITEM': {
      const idx = state.items.findIndex((i) => i.id === action.payload.id);
      if (idx > -1) {
        const updated = [...state.items];
        updated[idx] = { ...updated[idx], quantity: updated[idx].quantity + 1 };
        return { ...state, items: updated };
      }
      return { ...state, items: [...state.items, { ...action.payload, quantity: 1 }] };
    }
    case 'REMOVE_ITEM':
      return { ...state, items: state.items.filter((i) => i.id !== action.payload) };
    case 'INCREMENT': {
      return {
        ...state,
        items: state.items.map((i) =>
          i.id === action.payload ? { ...i, quantity: i.quantity + 1 } : i
        ),
      };
    }
    case 'DECREMENT': {
      const item = state.items.find((i) => i.id === action.payload);
      if (!item) return state;
      if (item.quantity <= 1) {
        return { ...state, items: state.items.filter((i) => i.id !== action.payload) };
      }
      return {
        ...state,
        items: state.items.map((i) =>
          i.id === action.payload ? { ...i, quantity: i.quantity - 1 } : i
        ),
      };
    }
    case 'CLEAR_CART':
      return { ...state, items: [], step: 1 };
    case 'TOGGLE_CART':
      return { ...state, isOpen: !state.isOpen, step: state.isOpen ? 1 : state.step };
    case 'OPEN_CART':
      return { ...state, isOpen: true };
    case 'CLOSE_CART':
      return { ...state, isOpen: false, step: 1 };
    case 'SET_STEP':
      return { ...state, step: action.payload };
    case 'LOAD_CART':
      return { ...state, items: action.payload };
    default:
      return state;
  }
}

const CartContext = createContext<CartContextType | null>(null);

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [state, dispatch] = useReducer(cartReducer, {
    items: [],
    isOpen: false,
    step: 1,
  });

  useEffect(() => {
    const saved = localStorage.getItem('baladar-cart');
    if (saved) {
      try {
        dispatch({ type: 'LOAD_CART', payload: JSON.parse(saved) });
      } catch {}
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('baladar-cart', JSON.stringify(state.items));
  }, [state.items]);

  const totalItems = state.items.reduce((sum, item) => sum + item.quantity, 0);
  const subtotal = state.items.reduce((sum, item) => {
    let itemPrice = item.price * item.quantity;
    if (item.withExtra && item.extraOptionPrice) {
      itemPrice += item.extraOptionPrice * item.quantity;
    }
    return sum + itemPrice;
  }, 0);

  const addItem = useCallback((item: CartItem) => dispatch({ type: 'ADD_ITEM', payload: item }), []);
  const removeItem = useCallback((id: string) => dispatch({ type: 'REMOVE_ITEM', payload: id }), []);
  const incrementItem = useCallback((id: string) => dispatch({ type: 'INCREMENT', payload: id }), []);
  const decrementItem = useCallback((id: string) => dispatch({ type: 'DECREMENT', payload: id }), []);
  const clearCart = useCallback(() => dispatch({ type: 'CLEAR_CART' }), []);
  const toggleCart = useCallback(() => dispatch({ type: 'TOGGLE_CART' }), []);
  const openCart = useCallback(() => dispatch({ type: 'OPEN_CART' }), []);
  const closeCart = useCallback(() => dispatch({ type: 'CLOSE_CART' }), []);
  const setStep = useCallback((step: 1 | 2) => dispatch({ type: 'SET_STEP', payload: step }), []);

  const getQuantity = useCallback(
    (id: string) => state.items.find((i) => i.id === id)?.quantity || 0,
    [state.items]
  );

  return (
    <CartContext.Provider
      value={{
        ...state,
        addItem,
        removeItem,
        incrementItem,
        decrementItem,
        clearCart,
        toggleCart,
        openCart,
        closeCart,
        setStep,
        getQuantity,
        totalItems,
        subtotal,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (!context) throw new Error('useCart must be used within CartProvider');
  return context;
}
