import React, { useState } from 'react';
import { Header } from './components/Header';
import { Hero } from './components/Hero';
import { CategorySection } from './components/CategorySection';
import { ProductGrid } from './components/ProductGrid';
import { ProductDetailModal } from './components/ProductDetailModal';
import { SchoolPacksSection } from './components/SchoolPacksSection';
import { AboutUsSection } from './components/AboutUsSection';
import { ContactSection } from './components/ContactSection';
import { CartDrawer } from './components/CartDrawer';
import { CheckoutModal } from './components/CheckoutModal';
import { SuccessCelebrationModal } from './components/SuccessCelebrationModal';
import { MyDownloadsModal } from './components/MyDownloadsModal';
import { AdminDashboard } from './components/AdminDashboard';
import { LegalModals, LegalDocType } from './components/LegalModals';
import { Footer } from './components/Footer';

import { AppProvider, useApp } from './context/AppContext';
import { CartProvider, useCart } from './context/CartContext';
import { Product, ProductCategory, Order } from './types';
import { ShoppingBag, ArrowRight } from 'lucide-react';

const MainApp: React.FC = () => {
  const { products } = useApp();
  const { addToCart, cartCount, total, setIsCartDrawerOpen } = useCart();

  // Active section & search
  const [activeSection, setActiveSection] = useState<string>('home');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedCategory, setSelectedCategory] = useState<ProductCategory | 'All'>('All');

  // Modals state
  const [previewProduct, setPreviewProduct] = useState<Product | null>(null);
  const [checkoutProduct, setCheckoutProduct] = useState<Product | null>(null);
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
  const [confirmedOrder, setConfirmedOrder] = useState<Order | null>(null);
  const [isMyDownloadsOpen, setIsMyDownloadsOpen] = useState(false);
  const [isAdminOpen, setIsAdminOpen] = useState(false);
  const [activeLegalDoc, setActiveLegalDoc] = useState<LegalDocType>(null);

  // Toast notification
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  const handleNavigate = (sectionId: string) => {
    setActiveSection(sectionId);
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    } else if (sectionId === 'home') {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const handleSelectCategory = (cat: ProductCategory) => {
    setSelectedCategory(cat);
    handleNavigate('colouring-books');
  };

  const handleResetCategory = () => {
    setSelectedCategory('All');
  };

  const handleAddToCart = (product: Product) => {
    const res = addToCart(product);
    showToast(res.message);
  };

  const handleBuyNow = (product: Product) => {
    setCheckoutProduct(product);
    setIsCheckoutOpen(true);
  };

  const handleProceedFromCart = () => {
    setCheckoutProduct(null);
    setIsCheckoutOpen(true);
  };

  const handlePaymentSuccess = (order: Order) => {
    setIsCheckoutOpen(false);
    setConfirmedOrder(order);
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#FFFDF5] text-neutral-800">
      {/* Toast Alert */}
      {toastMessage && (
        <div className="fixed bottom-20 right-4 sm:bottom-6 sm:right-6 z-50 bg-neutral-900 text-white px-4 py-3 rounded-2xl shadow-xl flex items-center gap-2 text-xs font-bold border-2 border-amber-300 animate-in slide-in-from-bottom duration-200">
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Header */}
      <Header
        activeSection={activeSection}
        onNavigate={handleNavigate}
        onOpenMyDownloads={() => setIsMyDownloadsOpen(true)}
        onOpenAdmin={() => setIsAdminOpen(true)}
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
      />

      <main className="flex-1">
        {/* Hero Section */}
        <Hero
          onExploreBooks={() => handleNavigate('colouring-books')}
          onExploreSchoolPacks={() => handleNavigate('school-packs')}
        />

        {/* 12 Playful Categories */}
        <CategorySection
          onSelectCategory={handleSelectCategory}
          selectedCategory={selectedCategory}
        />

        {/* Featured Products Grid */}
        <ProductGrid
          products={products.filter((p) => p.active)}
          selectedCategory={selectedCategory}
          onResetCategory={handleResetCategory}
          onPreview={(p) => setPreviewProduct(p)}
          onAddToCart={handleAddToCart}
          onBuyNow={handleBuyNow}
          searchQuery={searchQuery}
        />

        {/* School Packs & Playschool Licensing */}
        <SchoolPacksSection />

        {/* About Us & Child Development */}
        <AboutUsSection />

        {/* Contact & FAQ */}
        <ContactSection />
      </main>

      {/* Footer */}
      <Footer
        onNavigate={handleNavigate}
        onOpenLegal={(doc) => setActiveLegalDoc(doc)}
        onOpenMyDownloads={() => setIsMyDownloadsOpen(true)}
        onOpenAdmin={() => setIsAdminOpen(true)}
      />

      {/* Sticky Mobile Bottom Bar if Cart Has Items */}
      {cartCount > 0 && (
        <div className="sm:hidden fixed bottom-0 left-0 right-0 z-30 bg-[#FFFDF5] border-t-2 border-amber-300 p-3 shadow-lg flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-xl bg-[#FFD93D] text-neutral-900">
              <ShoppingBag className="w-5 h-5" />
            </div>
            <div>
              <div className="text-xs font-extrabold text-neutral-900">
                {cartCount} {cartCount === 1 ? 'Book' : 'Books'} in Backpack
              </div>
              <div className="text-[11px] font-black text-[#FF8A65]">Total: ₹{total}</div>
            </div>
          </div>

          <button
            onClick={() => setIsCartDrawerOpen(true)}
            className="px-4 py-2 rounded-xl bg-[#FFD93D] text-neutral-900 font-black text-xs flex items-center gap-1 shadow-xs"
          >
            <span>View Backpack</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      )}

      {/* Cart Drawer */}
      <CartDrawer onProceedToCheckout={handleProceedFromCart} />

      {/* Product Details & Sample Preview Modal */}
      <ProductDetailModal
        product={previewProduct}
        onClose={() => setPreviewProduct(null)}
        onAddToCart={(p) => {
          handleAddToCart(p);
          setPreviewProduct(null);
        }}
        onBuyNow={(p) => {
          setPreviewProduct(null);
          handleBuyNow(p);
        }}
        allProducts={products}
        onSelectRelated={(p) => setPreviewProduct(p)}
      />

      {/* Razorpay Checkout Modal */}
      {isCheckoutOpen && (
        <CheckoutModal
          directProduct={checkoutProduct}
          onClose={() => {
            setIsCheckoutOpen(false);
            setCheckoutProduct(null);
          }}
          onSuccess={handlePaymentSuccess}
        />
      )}

      {/* Payment Success & Instant PDF Download Celebration */}
      {confirmedOrder && (
        <SuccessCelebrationModal
          order={confirmedOrder}
          onClose={() => setConfirmedOrder(null)}
          allProducts={products}
        />
      )}

      {/* My Downloads Portal */}
      {isMyDownloadsOpen && (
        <MyDownloadsModal
          onClose={() => setIsMyDownloadsOpen(false)}
          allProducts={products}
        />
      )}

      {/* Admin Dashboard */}
      {isAdminOpen && (
        <AdminDashboard onClose={() => setIsAdminOpen(false)} />
      )}

      {/* Legal Modals */}
      <LegalModals
        activeDoc={activeLegalDoc}
        onClose={() => setActiveLegalDoc(null)}
      />
    </div>
  );
};

export default function App() {
  return (
    <AppProvider>
      <CartProvider>
        <MainApp />
      </CartProvider>
    </AppProvider>
  );
}
