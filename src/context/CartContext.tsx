import React, { createContext, useContext, useState, useEffect } from 'react';
import { Product, CartItem, Coupon } from '../types';
import { INITIAL_COUPONS } from '../data/initialData';

interface CartContextType {
  cart: CartItem[];
  addToCart: (product: Product) => { success: boolean; message: string };
  removeFromCart: (productId: string) => void;
  clearCart: () => void;
  cartCount: number;
  subtotal: number;
  discount: number;
  total: number;
  appliedCoupon: Coupon | null;
  applyCoupon: (code: string) => { success: boolean; message: string };
  removeCoupon: () => void;
  isCartDrawerOpen: boolean;
  setIsCartDrawerOpen: (open: boolean) => void;
  checkoutProduct: Product | null;
  setCheckoutProduct: (product: Product | null) => void;
  isCheckoutOpen: boolean;
  setIsCheckoutOpen: (open: boolean) => void;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

const CART_STORAGE_KEY = 'little_colour_world_cart_v2';
const COUPON_STORAGE_KEY = 'little_colour_world_coupon';

export const CartProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [cart, setCart] = useState<CartItem[]>(() => {
    try {
      const stored = localStorage.getItem(CART_STORAGE_KEY);
      return stored ? JSON.parse(stored) : [];
    } catch {
      return [];
    }
  });

  const [appliedCoupon, setAppliedCoupon] = useState<Coupon | null>(() => {
    try {
      const stored = localStorage.getItem(COUPON_STORAGE_KEY);
      return stored ? JSON.parse(stored) : null;
    } catch {
      return null;
    }
  });

  const [isCartDrawerOpen, setIsCartDrawerOpen] = useState(false);
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
  const [checkoutProduct, setCheckoutProduct] = useState<Product | null>(null);

  useEffect(() => {
    try {
      localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(cart));
    } catch (e) {
      console.error('Failed to save cart to localStorage', e);
    }
  }, [cart]);

  useEffect(() => {
    try {
      if (appliedCoupon) {
        localStorage.setItem(COUPON_STORAGE_KEY, JSON.stringify(appliedCoupon));
      } else {
        localStorage.removeItem(COUPON_STORAGE_KEY);
      }
    } catch (e) {
      console.error('Failed to save coupon to localStorage', e);
    }
  }, [appliedCoupon]);

  const addToCart = (product: Product) => {
    // For digital products, prevent duplicate purchases within the same cart
    const exists = cart.some((item) => item.product.id === product.id);
    if (exists) {
      return {
        success: false,
        message: `"${product.title}" is already in your cart! (Digital PDFs need only be purchased once)`,
      };
    }

    setCart((prev) => [...prev, { product, addedAt: Date.now() }]);
    return {
      success: true,
      message: `Added "${product.title}" to your backpack! 🎒`,
    };
  };

  const removeFromCart = (productId: string) => {
    setCart((prev) => prev.filter((item) => item.product.id !== productId));
  };

  const clearCart = () => {
    setCart([]);
    setAppliedCoupon(null);
  };

  const subtotal = cart.reduce((sum, item) => sum + item.product.discountedPrice, 0);

  let discount = 0;
  if (appliedCoupon) {
    if (subtotal >= appliedCoupon.minOrderValue) {
      const rawDiscount = (subtotal * appliedCoupon.discountPercentage) / 100;
      discount = Math.min(Math.round(rawDiscount), appliedCoupon.maxDiscount);
    } else {
      // Invalidate coupon if subtotal falls below threshold
      discount = 0;
    }
  }

  const total = Math.max(0, subtotal - discount);

  const applyCoupon = (code: string) => {
    const trimmed = code.trim().toUpperCase();
    const found = INITIAL_COUPONS.find((c) => c.code.toUpperCase() === trimmed && c.isActive);

    if (!found) {
      return { success: false, message: 'Invalid coupon code. Try "LITTLE10" or "SUPERMOM"!' };
    }

    if (subtotal < found.minOrderValue) {
      return {
        success: false,
        message: `This coupon requires a minimum cart value of ₹${found.minOrderValue}`,
      };
    }

    setAppliedCoupon(found);
    return {
      success: true,
      message: `Coupon "${found.code}" applied! You saved ${found.discountPercentage}%! 🎉`,
    };
  };

  const removeCoupon = () => {
    setAppliedCoupon(null);
  };

  return (
    <CartContext.Provider
      value={{
        cart,
        addToCart,
        removeFromCart,
        clearCart,
        cartCount: cart.length,
        subtotal,
        discount,
        total,
        appliedCoupon,
        applyCoupon,
        removeCoupon,
        isCartDrawerOpen,
        setIsCartDrawerOpen,
        checkoutProduct,
        setCheckoutProduct,
        isCheckoutOpen,
        setIsCheckoutOpen,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = (): CartContextType => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};
