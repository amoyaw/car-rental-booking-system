'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { CartItem, Vehicle } from '@/types';

interface CartContextType {
  cart: CartItem[];
  addToCart: (vehicle: Vehicle, startDate: string, endDate: string) => void;
  removeFromCart: (vehicleId: string) => void;
  clearCart: () => void;
  getCartTotal: () => number;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [cart, setCart] = useState<CartItem[]>([]);

  useEffect(() => {
    const savedCart = localStorage.getItem('cart');
    if (savedCart) {
      setCart(JSON.parse(savedCart));
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('cart', JSON.stringify(cart));
  }, [cart]);

  const addToCart = (vehicle: Vehicle, startDate: string, endDate: string) => {
    const start = new Date(startDate);
    const end = new Date(endDate);
    const days = Math.ceil((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24));

    const newItem: CartItem = {
      vehicle,
      startDate,
      endDate,
      days,
    };

    setCart([...cart, newItem]);
  };

  const removeFromCart = (vehicleId: string) => {
    setCart(cart.filter(item => item.vehicle.id !== vehicleId));
  };

  const clearCart = () => {
    setCart([]);
  };

  const getCartTotal = () => {
    return cart.reduce((total, item) => total + (item.vehicle.price * item.days), 0);
  };

  return (
    <CartContext.Provider value={{ cart, addToCart, removeFromCart, clearCart, getCartTotal }}>
      {children}
    </CartContext.Provider>
  );
}

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within CartProvider');
  }
  return context;
};
