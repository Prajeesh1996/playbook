import React, { createContext, useContext, useState, useEffect } from 'react';
import { Product, Order, SchoolEnquiry, ContactMessage, Coupon } from '../types';
import { INITIAL_PRODUCTS, INITIAL_COUPONS } from '../data/initialData';

interface AppContextType {
  products: Product[];
  addProduct: (product: Omit<Product, 'id' | 'createdAt'>) => Product;
  updateProduct: (id: string, updates: Partial<Product>) => void;
  deleteProduct: (id: string) => void;
  orders: Order[];
  createOrder: (orderData: Omit<Order, 'id' | 'orderNumber' | 'createdAt' | 'downloadToken' | 'tokenExpiresAt'>) => Order;
  markOrderPaid: (orderId: string, razorpayPaymentId: string) => Order | null;
  refundOrder: (orderId: string) => void;
  getOrderByToken: (token: string) => Order | undefined;
  getOrdersByEmail: (email: string) => Order[];
  schoolEnquiries: SchoolEnquiry[];
  submitSchoolEnquiry: (enquiry: Omit<SchoolEnquiry, 'id' | 'status' | 'createdAt'>) => void;
  updateSchoolEnquiryStatus: (id: string, status: SchoolEnquiry['status']) => void;
  contactMessages: ContactMessage[];
  submitContactMessage: (msg: Omit<ContactMessage, 'id' | 'createdAt'>) => void;
  coupons: Coupon[];
  addCoupon: (coupon: Coupon) => void;
  toggleCoupon: (code: string) => void;
  isAdminLoggedIn: boolean;
  adminLogin: (pin: string) => boolean;
  adminLogout: () => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

const PRODUCTS_KEY = 'lcw_products_v3';
const ORDERS_KEY = 'lcw_orders_v3';
const ENQUIRIES_KEY = 'lcw_enquiries_v1';
const MESSAGES_KEY = 'lcw_messages_v1';
const ADMIN_AUTH_KEY = 'lcw_admin_auth';

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Products
  const [products, setProducts] = useState<Product[]>(() => {
    try {
      const stored = localStorage.getItem(PRODUCTS_KEY);
      return stored ? JSON.parse(stored) : INITIAL_PRODUCTS;
    } catch {
      return INITIAL_PRODUCTS;
    }
  });

  // Orders
  const [orders, setOrders] = useState<Order[]>(() => {
    try {
      const stored = localStorage.getItem(ORDERS_KEY);
      if (stored) return JSON.parse(stored);
      // Seed initial sample paid order for demonstration
      return [
        {
          id: 'ord_demo_101',
          orderNumber: 'LCW-98214',
          customer: {
            parentName: 'Priya Sharma',
            email: 'priya.sharma@example.com',
            phone: '+91 98765 43210',
          },
          items: [
            {
              productId: 'prod-1',
              title: 'Animal Colouring Book',
              price: 49,
              originalPrice: 129,
            },
            {
              productId: 'prod-2',
              title: 'My First ABC Colouring Book',
              price: 59,
              originalPrice: 149,
            },
          ],
          subtotal: 108,
          discount: 15,
          couponCode: 'LITTLE10',
          total: 93,
          razorpayOrderId: 'order_test_928374291',
          razorpayPaymentId: 'pay_test_8839201948',
          status: 'paid',
          downloadToken: 'tok_demo_secure_884920',
          tokenExpiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
          createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
        },
      ];
    } catch {
      return [];
    }
  });

  // School Enquiries
  const [schoolEnquiries, setSchoolEnquiries] = useState<SchoolEnquiry[]>(() => {
    try {
      const stored = localStorage.getItem(ENQUIRIES_KEY);
      if (stored) return JSON.parse(stored);
      return [
        {
          id: 'enq-1',
          schoolName: 'Sunshine Montessori Playschool',
          contactPerson: 'Anjali Verma',
          email: 'principal@sunshineplayschool.edu',
          phone: '+91 98200 12345',
          studentCount: '65',
          gradeLevel: 'Playgroup & Nursery',
          message: 'Interested in annual printable licence for Nursery pre-writing tracing worksheets.',
          status: 'new',
          createdAt: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(),
        },
      ];
    } catch {
      return [];
    }
  });

  // Contact Messages
  const [contactMessages, setContactMessages] = useState<ContactMessage[]>(() => {
    try {
      const stored = localStorage.getItem(MESSAGES_KEY);
      return stored ? JSON.parse(stored) : [];
    } catch {
      return [];
    }
  });

  // Coupons
  const [coupons, setCoupons] = useState<Coupon[]>(INITIAL_COUPONS);

  // Admin Auth
  const [isAdminLoggedIn, setIsAdminLoggedIn] = useState<boolean>(() => {
    return sessionStorage.getItem(ADMIN_AUTH_KEY) === 'true';
  });

  // Sync to storage
  useEffect(() => {
    try {
      localStorage.setItem(PRODUCTS_KEY, JSON.stringify(products));
    } catch (e) {
      console.error(e);
    }
  }, [products]);

  useEffect(() => {
    try {
      localStorage.setItem(ORDERS_KEY, JSON.stringify(orders));
    } catch (e) {
      console.error(e);
    }
  }, [orders]);

  useEffect(() => {
    try {
      localStorage.setItem(ENQUIRIES_KEY, JSON.stringify(schoolEnquiries));
    } catch (e) {
      console.error(e);
    }
  }, [schoolEnquiries]);

  useEffect(() => {
    try {
      localStorage.setItem(MESSAGES_KEY, JSON.stringify(contactMessages));
    } catch (e) {
      console.error(e);
    }
  }, [contactMessages]);

  const addProduct = (productData: Omit<Product, 'id' | 'createdAt'>): Product => {
    const newProd: Product = {
      ...productData,
      id: `prod-${Date.now()}`,
      createdAt: new Date().toISOString(),
    };
    setProducts((prev) => [newProd, ...prev]);
    return newProd;
  };

  const updateProduct = (id: string, updates: Partial<Product>) => {
    setProducts((prev) =>
      prev.map((p) => (p.id === id ? { ...p, ...updates } : p))
    );
  };

  const deleteProduct = (id: string) => {
    setProducts((prev) => prev.filter((p) => p.id !== id));
  };

  const createOrder = (
    orderData: Omit<Order, 'id' | 'orderNumber' | 'createdAt' | 'downloadToken' | 'tokenExpiresAt'>
  ): Order => {
    const orderNumber = `LCW-${Math.floor(10000 + Math.random() * 90000)}`;
    const downloadToken = `tok_${Math.random().toString(36).substring(2, 12)}_${Date.now()}`;
    const tokenExpiresAt = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(); // 30-day link validity

    const newOrder: Order = {
      ...orderData,
      id: `ord_${Date.now()}`,
      orderNumber,
      downloadToken,
      tokenExpiresAt,
      createdAt: new Date().toISOString(),
    };

    setOrders((prev) => [newOrder, ...prev]);
    return newOrder;
  };

  const markOrderPaid = (orderId: string, razorpayPaymentId: string): Order | null => {
    let updatedOrder: Order | null = null;
    setOrders((prev) =>
      prev.map((ord) => {
        if (ord.id === orderId || ord.razorpayOrderId === orderId) {
          updatedOrder = {
            ...ord,
            status: 'paid',
            razorpayPaymentId,
          };
          return updatedOrder;
        }
        return ord;
      })
    );
    return updatedOrder;
  };

  const refundOrder = (orderId: string) => {
    setOrders((prev) =>
      prev.map((ord) => (ord.id === orderId ? { ...ord, status: 'refunded' } : ord))
    );
  };

  const getOrderByToken = (token: string): Order | undefined => {
    return orders.find((o) => o.downloadToken === token);
  };

  const getOrdersByEmail = (email: string): Order[] => {
    const cleanEmail = email.trim().toLowerCase();
    return orders.filter((o) => o.customer.email.toLowerCase() === cleanEmail && o.status === 'paid');
  };

  const submitSchoolEnquiry = (enquiry: Omit<SchoolEnquiry, 'id' | 'status' | 'createdAt'>) => {
    const newEnquiry: SchoolEnquiry = {
      ...enquiry,
      id: `enq-${Date.now()}`,
      status: 'new',
      createdAt: new Date().toISOString(),
    };
    setSchoolEnquiries((prev) => [newEnquiry, ...prev]);
  };

  const updateSchoolEnquiryStatus = (id: string, status: SchoolEnquiry['status']) => {
    setSchoolEnquiries((prev) =>
      prev.map((e) => (e.id === id ? { ...e, status } : e))
    );
  };

  const submitContactMessage = (msg: Omit<ContactMessage, 'id' | 'createdAt'>) => {
    const newMsg: ContactMessage = {
      ...msg,
      id: `msg-${Date.now()}`,
      createdAt: new Date().toISOString(),
    };
    setContactMessages((prev) => [newMsg, ...prev]);
  };

  const addCoupon = (coupon: Coupon) => {
    setCoupons((prev) => [...prev, coupon]);
  };

  const toggleCoupon = (code: string) => {
    setCoupons((prev) =>
      prev.map((c) => (c.code === code ? { ...c, isActive: !c.isActive } : c))
    );
  };

  const adminLogin = (pin: string): boolean => {
    // Default master PIN is 1234 or "admin" or customizable in site settings
    if (pin.trim() === '1234' || pin.trim().toLowerCase() === 'admin') {
      setIsAdminLoggedIn(true);
      sessionStorage.setItem(ADMIN_AUTH_KEY, 'true');
      return true;
    }
    return false;
  };

  const adminLogout = () => {
    setIsAdminLoggedIn(false);
    sessionStorage.removeItem(ADMIN_AUTH_KEY);
  };

  return (
    <AppContext.Provider
      value={{
        products,
        addProduct,
        updateProduct,
        deleteProduct,
        orders,
        createOrder,
        markOrderPaid,
        refundOrder,
        getOrderByToken,
        getOrdersByEmail,
        schoolEnquiries,
        submitSchoolEnquiry,
        updateSchoolEnquiryStatus,
        contactMessages,
        submitContactMessage,
        coupons,
        addCoupon,
        toggleCoupon,
        isAdminLoggedIn,
        adminLogin,
        adminLogout,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = (): AppContextType => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
