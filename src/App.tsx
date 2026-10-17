import React, { useState, useEffect } from 'react';
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

// Dynamic Pages
import { ProductDetailPage } from './pages/ProductDetailPage';
import { CategoryPage } from './pages/CategoryPage';
import { BooksCatalogPage } from './pages/BooksCatalogPage';
import { SchoolsPage } from './pages/SchoolsPage';
import { AboutPage } from './pages/AboutPage';
import { ContactPage } from './pages/ContactPage';
import { LegalPage } from './pages/LegalPage';
import { MyDownloadsPage } from './pages/MyDownloadsPage';

import { AppProvider, useApp } from './context/AppContext';
import { CartProvider, useCart } from './context/CartContext';
import { RouterProvider, useRouter } from './context/RouterContext';
import { updatePageSEO } from './utils/seo';
import { Product, ProductCategory, Order } from './types';
import { ShoppingBag, ArrowRight } from 'lucide-react';

const MainApp: React.FC = () => {
  const { products } = useApp();
  const { addToCart, cartCount, total, setIsCartDrawerOpen } = useCart();
  const { route, navigate } = useRouter();

  // Search query state
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

  // Home Page dynamic SEO
  useEffect(() => {
    if (route.type === 'home') {
      updatePageSEO({
        title: 'Little Colour World – Printable Colouring Books for Kids (Ages 2–6)',
        description:
          'Discover magical printable colouring books, fun worksheets, and creative learning activities for preschool, nursery, LKG, and UKG children. Instant PDF downloads.',
        canonicalPath: '/',
        ogType: 'website',
        jsonLd: {
          '@context': 'https://schema.org',
          '@type': 'WebSite',
          name: 'Little Colour World',
          alternateName: 'Little Hands, Big Imagination!',
          url: window.location.origin,
          description:
            'Printable colouring books, worksheets, and educational activity PDFs for preschool, nursery, LKG, and UKG children.',
        },
      });
    }
  }, [route.type]);

  const handleNavigate = (sectionId: string) => {
    if (sectionId === 'home') {
      navigate('/');
    } else if (sectionId === 'colouring-books' || sectionId === 'worksheets' || sectionId === 'activity-books') {
      navigate('/books');
    } else if (sectionId === 'school-packs') {
      navigate('/schools');
    } else if (sectionId === 'about-us') {
      navigate('/about');
    } else if (sectionId === 'contact') {
      navigate('/contact');
    } else {
      const element = document.getElementById(sectionId);
      if (element) {
        element.scrollIntoView({ behavior: 'smooth' });
      }
    }
  };

  const handleSelectCategory = (cat: ProductCategory) => {
    const slug = cat.toLowerCase().replace(/[^a-z0-9]/g, '-');
    navigate(`/category/${slug}`);
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
        activeSection={route.type}
        onNavigate={handleNavigate}
        onOpenMyDownloads={() => navigate('/my-downloads')}
        onOpenAdmin={() => navigate('/admin')}
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
      />

      <main className="flex-1">
        {/* DYNAMIC PAGE ROUTING BASED ON URL */}
        {route.type === 'home' && (
          <>
            {/* Hero Section */}
            <Hero
              onExploreBooks={() => navigate('/books')}
              onExploreSchoolPacks={() => navigate('/schools')}
            />

            {/* 12 Playful Categories */}
            <CategorySection
              onSelectCategory={handleSelectCategory}
              selectedCategory={selectedCategory}
            />

            {/* Featured Best-Sellers Grid */}
            <ProductGrid
              products={products.filter((p) => p.active)}
              selectedCategory={selectedCategory}
              onResetCategory={handleResetCategory}
              onPreview={(p) => setPreviewProduct(p)}
              onAddToCart={handleAddToCart}
              onBuyNow={handleBuyNow}
              searchQuery={searchQuery}
            />

            {/* School Packs Summary */}
            <SchoolPacksSection />

            {/* About Us & Child Development */}
            <AboutUsSection />

            {/* Contact & FAQ */}
            <ContactSection />
          </>
        )}

        {/* /books - All Colouring Books Catalog Page */}
        {route.type === 'books' && (
          <BooksCatalogPage
            onPreview={(p) => setPreviewProduct(p)}
            onAddToCart={handleAddToCart}
            onBuyNow={handleBuyNow}
          />
        )}

        {/* /book/:slug - Dedicated Product Detail Page */}
        {route.type === 'product' && (
          <ProductDetailPage
            slug={route.params.slug}
            onAddToCart={handleAddToCart}
            onBuyNow={handleBuyNow}
          />
        )}

        {/* /category/:slug - Dedicated Category Page */}
        {route.type === 'category' && (
          <CategoryPage
            categorySlug={route.params.slug}
            onPreview={(p) => setPreviewProduct(p)}
            onAddToCart={handleAddToCart}
            onBuyNow={handleBuyNow}
          />
        )}

        {/* /schools - School Packs & Bulk Licensing Page */}
        {route.type === 'schools' && <SchoolsPage />}

        {/* /about - About Us Page */}
        {route.type === 'about' && <AboutPage />}

        {/* /contact - Contact & Help Center Page */}
        {route.type === 'contact' && <ContactPage />}

        {/* /my-downloads - Dedicated Order Recovery Page */}
        {route.type === 'my-downloads' && <MyDownloadsPage />}

        {/* /privacy-policy, /terms-and-conditions, etc. - Legal Policy Pages */}
        {route.type === 'legal' && (
          <LegalPage docType={route.params.doc as any} />
        )}

        {/* /admin - Admin Control Dashboard */}
        {route.type === 'admin' && (
          <div className="py-6">
            <AdminDashboard onClose={() => navigate('/')} />
          </div>
        )}
      </main>

      {/* Footer */}
      <Footer
        onNavigate={handleNavigate}
        onOpenLegal={(doc) => {
          if (doc === 'privacy') navigate('/privacy-policy');
          else if (doc === 'terms') navigate('/terms-and-conditions');
          else if (doc === 'refund') navigate('/refund-policy');
          else if (doc === 'delivery') navigate('/shipping-delivery');
        }}
        onOpenMyDownloads={() => navigate('/my-downloads')}
        onOpenAdmin={() => navigate('/admin')}
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
            className="px-4 py-2 rounded-xl bg-[#FFD93D] text-neutral-900 font-black text-xs flex items-center gap-1 shadow-xs cursor-pointer"
          >
            <span>View Backpack</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      )}

      {/* Cart Drawer */}
      <CartDrawer onProceedToCheckout={handleProceedFromCart} />

      {/* Quick View Sample Preview Modal */}
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
        onSelectRelated={(p) => {
          setPreviewProduct(p);
          navigate(`/book/${p.slug}`);
        }}
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

      {/* My Downloads Modal Fallback */}
      {isMyDownloadsOpen && (
        <MyDownloadsModal
          onClose={() => setIsMyDownloadsOpen(false)}
          allProducts={products}
        />
      )}

      {/* Admin Dashboard Modal Fallback */}
      {isAdminOpen && (
        <AdminDashboard onClose={() => setIsAdminOpen(false)} />
      )}

      {/* Legal Modals Fallback */}
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
        <RouterProvider>
          <MainApp />
        </RouterProvider>
      </CartProvider>
    </AppProvider>
  );
}
