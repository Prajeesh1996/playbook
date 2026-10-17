import React, { useEffect, useState } from 'react';
import { Product, ProductCategory } from '../types';
import { useApp } from '../context/AppContext';
import { useRouter } from '../context/RouterContext';
import { updatePageSEO } from '../utils/seo';
import { ProductCard } from '../components/ProductCard';
import { CATEGORIES_DATA } from '../data/initialData';
import { Search, SlidersHorizontal, BookOpen } from 'lucide-react';

interface BooksCatalogPageProps {
  onPreview: (product: Product) => void;
  onAddToCart: (product: Product) => void;
  onBuyNow: (product: Product) => void;
}

export const BooksCatalogPage: React.FC<BooksCatalogPageProps> = ({
  onPreview,
  onAddToCart,
  onBuyNow,
}) => {
  const { products } = useApp();
  const { route, navigate } = useRouter();
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState<string>(route.query.search || '');
  const [selectedAge, setSelectedAge] = useState<string>('All');

  useEffect(() => {
    updatePageSEO({
      title: 'Printable Colouring Books & Worksheets (Ages 2–6) | Little Colour World',
      description:
        'Browse our complete library of printable preschool colouring books, phonics worksheets, tracing sheets, and early learning activity packs. Starting at ₹49.',
      canonicalPath: '/books',
      ogType: 'website',
      jsonLd: {
        '@context': 'https://schema.org',
        '@type': 'CollectionPage',
        name: 'Printable Colouring Books & Activity Workbooks for Preschool',
        description: 'Complete library of printable colouring books and early learning activity packs.',
        url: `${window.location.origin}/books`,
      },
    });
  }, []);

  const filteredProducts = products.filter((p) => {
    if (!p.active) return false;

    // Search query filter
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const matchTitle = p.title.toLowerCase().includes(q);
      const matchCat = p.category.toLowerCase().includes(q);
      const matchDesc = p.description.toLowerCase().includes(q);
      if (!matchTitle && !matchCat && !matchDesc) return false;
    }

    // Category filter
    if (selectedCategory !== 'All' && p.category !== selectedCategory) {
      return false;
    }

    // Age group filter
    if (selectedAge !== 'All' && !p.ageGroup.includes(selectedAge)) {
      return false;
    }

    return true;
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8 animate-in fade-in duration-200">
      {/* Header Banner */}
      <div className="text-center max-w-2xl mx-auto space-y-3">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-black uppercase tracking-wider bg-amber-100 text-amber-800">
          <BookOpen className="w-3.5 h-3.5 text-amber-600" />
          <span>Curated Preschool Library</span>
        </div>
        <h1 className="font-heading font-extrabold text-3xl sm:text-4xl text-neutral-900">
          Printable Colouring Books &amp; Activity Packs
        </h1>
        <p className="text-xs sm:text-sm text-neutral-600 font-bold">
          High-resolution, thick-outline printable PDF books designed specifically for toddler, nursery, and kindergarten artists.
        </p>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white p-4 sm:p-5 rounded-3xl border-2 border-neutral-200 shadow-xs space-y-4">
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-neutral-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search by topic, animal, alphabet, or theme..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 rounded-2xl border border-neutral-300 text-xs font-bold text-neutral-800 placeholder-neutral-400 focus:outline-none focus:ring-2 focus:ring-amber-400"
            />
          </div>

          <div className="flex items-center gap-2">
            <span className="text-xs font-bold text-neutral-500 whitespace-nowrap">Age Group:</span>
            <select
              value={selectedAge}
              onChange={(e) => setSelectedAge(e.target.value)}
              className="px-3 py-2.5 rounded-2xl border border-neutral-300 text-xs font-bold text-neutral-800 focus:outline-none focus:ring-2 focus:ring-amber-400"
            >
              <option value="All">All Ages (2–6)</option>
              <option value="2">Toddlers (Ages 2–3)</option>
              <option value="3">Nursery (Ages 3–4)</option>
              <option value="4">LKG (Ages 4–5)</option>
              <option value="5">UKG (Ages 5–6)</option>
            </select>
          </div>
        </div>

        {/* Category Pills */}
        <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-none">
          <button
            onClick={() => setSelectedCategory('All')}
            className={`px-4 py-2 rounded-xl text-xs font-black whitespace-nowrap cursor-pointer transition-all ${
              selectedCategory === 'All'
                ? 'bg-neutral-900 text-white shadow-xs'
                : 'bg-neutral-100 text-neutral-600 hover:bg-neutral-200'
            }`}
          >
            All Workbooks ({products.filter((p) => p.active).length})
          </button>
          {CATEGORIES_DATA.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setSelectedCategory(cat.id)}
              className={`px-3.5 py-2 rounded-xl text-xs font-black whitespace-nowrap cursor-pointer transition-all ${
                selectedCategory === cat.id
                  ? 'bg-amber-400 text-neutral-900 shadow-xs'
                  : 'bg-neutral-100 text-neutral-600 hover:bg-neutral-200'
              }`}
            >
              {cat.title}
            </button>
          ))}
        </div>
      </div>

      {/* Results Count & Grid */}
      <div className="space-y-4">
        <div className="flex items-center justify-between text-xs font-extrabold text-neutral-500">
          <span>
            Showing {filteredProducts.length} of {products.length} books
          </span>
          {(selectedCategory !== 'All' || searchQuery || selectedAge !== 'All') && (
            <button
              onClick={() => {
                setSelectedCategory('All');
                setSearchQuery('');
                setSelectedAge('All');
              }}
              className="text-amber-800 hover:underline cursor-pointer"
            >
              Reset filters
            </button>
          )}
        </div>

        {filteredProducts.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredProducts.map((product) => (
              <ProductCard
                key={product.id}
                product={product}
                onPreview={onPreview}
                onAddToCart={onAddToCart}
                onBuyNow={onBuyNow}
              />
            ))}
          </div>
        ) : (
          <div className="text-center py-16 bg-white rounded-3xl border border-neutral-200 space-y-3">
            <p className="text-neutral-500 font-bold text-sm">
              No coloring books match your current search or filter.
            </p>
            <button
              onClick={() => {
                setSelectedCategory('All');
                setSearchQuery('');
                setSelectedAge('All');
              }}
              className="px-5 py-2.5 rounded-xl bg-amber-300 hover:bg-amber-400 text-neutral-900 font-extrabold text-xs cursor-pointer"
            >
              View All Books
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
