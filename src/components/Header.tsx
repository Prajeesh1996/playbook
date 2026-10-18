import React, { useState } from 'react';
import { Search, ShoppingBag, Download, Menu, X, Shield, Sparkles } from 'lucide-react';
import { RainbowLogo } from '../utils/illustrations';
import { useCart } from '../context/CartContext';
import { useRouter } from '../context/RouterContext';

interface HeaderProps {
  activeSection?: string;
  onNavigate?: (sectionId: string) => void;
  onOpenMyDownloads?: () => void;
  onOpenAdmin?: () => void;
  searchQuery: string;
  setSearchQuery: (query: string) => void;
}

export const Header: React.FC<HeaderProps> = ({
  activeSection,
  onNavigate,
  onOpenMyDownloads,
  onOpenAdmin,
  searchQuery,
  setSearchQuery,
}) => {
  const { cartCount, setIsCartDrawerOpen } = useCart();
  const { route, navigate } = useRouter();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);

  const navLinks = [
    { id: 'home', path: '/', label: 'Home' },
    { id: 'colouring-books', path: '/books', label: 'Colouring Books' },
    { id: 'worksheets', path: '/category/tracing-worksheets', label: 'Worksheets' },
    { id: 'activity-books', path: '/category/school-activity-packs', label: 'Activity Books' },
    { id: 'school-packs', path: '/schools', label: 'School Packs' },
    { id: 'about-us', path: '/about', label: 'About Us' },
    { id: 'contact', path: '/contact', label: 'Contact' },
  ];

  const handleNavClick = (link: { id: string; path: string }) => {
    navigate(link.path);
    if (onNavigate) onNavigate(link.id);
    setMobileMenuOpen(false);
  };

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/books?search=${encodeURIComponent(searchQuery.trim())}`);
      setSearchOpen(false);
    }
  };

  return (
    <>
      {/* Top Playful Announcement Bar */}
      <div className="bg-gradient-to-r from-[#FFD93D] via-[#FFB6C1] to-[#6BCBFF] px-4 py-1.5 text-center text-xs sm:text-sm font-bold text-neutral-800 flex items-center justify-center gap-2 shadow-xs">
        <Sparkles className="w-3.5 h-3.5 text-neutral-900 shrink-0" />
        <span>Instant PDF Downloads for Preschool, Nursery &amp; Kindergarten (Ages 2–6)</span>
        <span className="hidden sm:inline bg-white/80 rounded-full px-2 py-0.5 text-[11px] font-extrabold text-neutral-800 ml-1">
          Use code LITTLE10 for 10% OFF
        </span>
      </div>

      {/* Main Sticky Header */}
      <header className="sticky top-0 z-40 bg-[#FFFDF5]/95 backdrop-blur-md border-b border-amber-100 shadow-xs transition-all">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-20 gap-4">
            {/* Logo */}
            <button
              onClick={() => handleNavClick({ id: 'home', path: '/' })}
              className="flex items-center gap-3 text-left group cursor-pointer shrink-0 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-400 rounded-xl p-1"
            >
              <div className="relative">
                <RainbowLogo size={46} className="transition-transform group-hover:scale-105" />
              </div>
              <div className="flex flex-col">
                <span className="font-heading font-extrabold text-2xl sm:text-2xl tracking-tight text-neutral-900 leading-tight">
                  Little <span className="text-[#FF8A65]">Colour</span> <span className="text-[#6BCBFF]">World</span>
                </span>
                <span className="text-[11px] font-bold text-amber-700/80 tracking-wide font-sans">
                  Little Hands, Big Imagination! 🌈
                </span>
              </div>
            </button>

            {/* Desktop Navigation */}
            <nav className="hidden xl:flex items-center gap-6 text-sm font-bold text-neutral-700">
              {navLinks.map((link) => {
                const isActive =
                  (link.path === '/' && route.path === '/') ||
                  (link.path !== '/' && route.path.startsWith(link.path));
                return (
                  <button
                    key={link.id}
                    onClick={() => handleNavClick(link)}
                    className={`whitespace-nowrap transition-all px-2 py-1 relative cursor-pointer ${
                      isActive ? 'text-[#FF8A65] font-extrabold' : 'hover:text-[#FF8A65]'
                    }`}
                  >
                    {link.label}
                    {isActive && (
                      <span className="absolute bottom-0 left-0 right-0 h-1 bg-[#FFD93D] rounded-full" />
                    )}
                  </button>
                );
              })}
            </nav>

            {/* Right Action Icons */}
            <div className="flex items-center gap-2 sm:gap-3 shrink-0">
              {/* Search Toggle */}
              <div className="relative">
                {searchOpen ? (
                  <form onSubmit={handleSearchSubmit} className="flex items-center bg-white border-2 border-amber-300 rounded-full pl-3 pr-2 py-1 shadow-inner w-44 sm:w-60 transition-all">
                    <Search className="w-4 h-4 text-amber-600 shrink-0" />
                    <input
                      type="text"
                      placeholder="Search books, letters..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      autoFocus
                      className="w-full bg-transparent border-none text-xs sm:text-sm px-2 py-0.5 focus:outline-none text-neutral-800"
                    />
                    <button
                      type="button"
                      onClick={() => {
                        setSearchOpen(false);
                        setSearchQuery('');
                      }}
                      className="p-1 hover:bg-neutral-100 rounded-full text-neutral-400 cursor-pointer"
                    >
                      <X className="w-3.5 h-3.5" />
                    </button>
                  </form>
                ) : (
                  <button
                    onClick={() => setSearchOpen(true)}
                    className="p-2.5 rounded-full bg-amber-50 text-neutral-700 hover:bg-amber-100 hover:text-amber-800 transition-colors cursor-pointer"
                    title="Search products"
                    aria-label="Search products"
                  >
                    <Search className="w-5 h-5" />
                  </button>
                )}
              </div>

              {/* My Downloads Button */}
              <button
                onClick={() => {
                  navigate('/my-downloads');
                  if (onOpenMyDownloads) onOpenMyDownloads();
                }}
                className="hidden sm:flex items-center gap-1.5 px-3.5 py-2 rounded-full bg-sky-50 text-sky-800 hover:bg-sky-100 font-bold text-xs transition-colors border border-sky-200 cursor-pointer"
                title="Access previous purchases"
              >
                <Download className="w-4 h-4 text-sky-600" />
                <span>My Downloads</span>
              </button>

              {/* Shopping Cart Button */}
              <button
                onClick={() => setIsCartDrawerOpen(true)}
                className="relative p-2.5 rounded-full bg-[#FFD93D] text-neutral-900 hover:bg-[#ffe26b] transition-transform active:scale-95 shadow-xs cursor-pointer"
                title="View Shopping Cart"
                aria-label={`Shopping bag with ${cartCount} items`}
              >
                <ShoppingBag className="w-5 h-5" />
                {cartCount > 0 && (
                  <span className="absolute -top-1 -right-1 bg-[#FF8A65] text-white font-black text-[11px] rounded-full w-5 h-5 flex items-center justify-center border-2 border-white animate-bounce">
                    {cartCount}
                  </span>
                )}
              </button>


              {/* Mobile Hamburger Menu Toggle */}
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="xl:hidden p-2 rounded-xl text-neutral-800 hover:bg-amber-100 transition-colors cursor-pointer"
                aria-label="Toggle navigation menu"
              >
                {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Slide-out Menu */}
        {mobileMenuOpen && (
          <div className="xl:hidden bg-[#FFFDF5] border-b border-amber-200 px-6 py-6 space-y-4 shadow-lg animate-in slide-in-from-top duration-200">
            <div className="grid grid-cols-2 gap-2">
              {navLinks.map((link) => (
                <button
                  key={link.id}
                  onClick={() => handleNavClick(link)}
                  className={`px-4 py-3 text-left rounded-xl text-sm font-bold transition-colors cursor-pointer ${
                    (link.path === '/' && route.path === '/') || (link.path !== '/' && route.path.startsWith(link.path))
                      ? 'bg-amber-100 text-amber-900'
                      : 'bg-white hover:bg-amber-50 text-neutral-700'
                  }`}
                >
                  {link.label}
                </button>
              ))}
            </div>

            <div className="pt-2 border-t border-amber-200 flex flex-col gap-2">
              <button
                onClick={() => {
                  setMobileMenuOpen(false);
                  navigate('/my-downloads');
                }}
                className="w-full flex items-center justify-center gap-2 py-3 rounded-xl bg-sky-100 text-sky-900 font-bold text-sm cursor-pointer"
              >
                <Download className="w-4 h-4 text-sky-600" />
                <span>My Downloads (Recover Purchases)</span>
              </button>

            </div>
          </div>
        )}
      </header>
    </>
  );
};
