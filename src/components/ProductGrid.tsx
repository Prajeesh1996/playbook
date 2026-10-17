import React, { useState } from 'react';
import { Product, ProductCategory } from '../types';
import { ProductCard } from './ProductCard';
import { Filter, ArrowUpDown, X } from 'lucide-react';

interface ProductGridProps {
  products: Product[];
  selectedCategory: ProductCategory | 'All';
  onResetCategory: () => void;
  onPreview: (product: Product) => void;
  onAddToCart: (product: Product) => void;
  onBuyNow: (product: Product) => void;
  searchQuery?: string;
}

export const ProductGrid: React.FC<ProductGridProps> = ({
  products,
  selectedCategory,
  onResetCategory,
  onPreview,
  onAddToCart,
  onBuyNow,
  searchQuery = '',
}) => {
  const [ageFilter, setAgeFilter] = useState<string>('All');
  const [sortBy, setSortBy] = useState<'featured' | 'price-asc' | 'price-desc' | 'pages-desc'>('featured');

  // Filter products
  const filtered = products.filter((p) => {
    // Category match
    if (selectedCategory !== 'All' && p.category !== selectedCategory) {
      return false;
    }

    // Age filter
    if (ageFilter !== 'All') {
      if (ageFilter === 'Ages 2–3' && !p.ageGroup.includes('2') && !p.ageGroup.includes('3')) return false;
      if (ageFilter === 'Ages 3–5' && !p.ageGroup.includes('3') && !p.ageGroup.includes('4') && !p.ageGroup.includes('5')) return false;
      if (ageFilter === 'Bundles' && !p.title.toLowerCase().includes('bundle')) return false;
    }

    // Search query
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const matchTitle = p.title.toLowerCase().includes(q);
      const matchCat = p.category.toLowerCase().includes(q);
      const matchDesc = p.description.toLowerCase().includes(q);
      if (!matchTitle && !matchCat && !matchDesc) return false;
    }

    return true;
  });

  // Sort
  const sorted = [...filtered].sort((a, b) => {
    if (sortBy === 'price-asc') return a.discountedPrice - b.discountedPrice;
    if (sortBy === 'price-desc') return b.discountedPrice - a.discountedPrice;
    if (sortBy === 'pages-desc') return b.pageCount - a.pageCount;
    return (b.isBestSeller ? 1 : 0) - (a.isBestSeller ? 1 : 0);
  });

  return (
    <section id="colouring-books" className="py-14 sm:py-20 bg-gradient-to-b from-[#FFFDF5] to-[#FFF9D2]/30 border-t border-amber-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Title */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8">
          <div>
            <div className="inline-block px-3 py-1 rounded-full bg-amber-100 text-amber-900 text-xs font-black tracking-wide mb-2">
              FEATURED PRINTABLE EDITIONS
            </div>
            <h2 className="font-heading font-extrabold text-3xl sm:text-4xl text-neutral-900 tracking-tight">
              Colour, Learn &amp; Have Fun! 🌟
            </h2>
            <p className="mt-1 text-sm sm:text-base text-neutral-600 font-medium">
              Extra-thick borders for little toddlers, fine motor tracing, and phonic alphabet books.
            </p>
          </div>

          {/* Active Filter Badge if selected category */}
          {selectedCategory !== 'All' && (
            <div className="flex items-center gap-2 bg-amber-100/90 border border-amber-300 px-3 py-1.5 rounded-full text-xs font-bold text-neutral-800">
              <span>Category: <strong>{selectedCategory}</strong></span>
              <button
                onClick={onResetCategory}
                className="p-0.5 hover:bg-amber-200 rounded-full"
                title="Clear category filter"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </div>
          )}
        </div>

        {/* Filter and Sort Bar */}
        <div className="bg-white rounded-2xl p-3 border border-amber-200/80 shadow-xs mb-8 flex flex-wrap items-center justify-between gap-3">
          {/* Age Filters */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0 scrollbar-none w-full sm:w-auto">
            <span className="text-xs font-bold text-neutral-400 pl-2 pr-1 flex items-center gap-1 shrink-0">
              <Filter className="w-3.5 h-3.5" /> Age:
            </span>
            {['All', 'Ages 2–3', 'Ages 3–5', 'Bundles'].map((age) => (
              <button
                key={age}
                onClick={() => setAgeFilter(age)}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition-colors cursor-pointer ${
                  ageFilter === age
                    ? 'bg-neutral-900 text-white shadow-xs'
                    : 'bg-neutral-100 text-neutral-700 hover:bg-amber-100'
                }`}
              >
                {age}
              </button>
            ))}
          </div>

          {/* Sort Selector */}
          <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
            <ArrowUpDown className="w-3.5 h-3.5 text-neutral-500" />
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as any)}
              className="bg-neutral-50 border border-neutral-200 rounded-xl px-3 py-1.5 text-xs font-bold text-neutral-800 focus:outline-none focus:ring-2 focus:ring-amber-400"
            >
              <option value="featured">Best Sellers &amp; Featured</option>
              <option value="price-asc">Price: Low to High (₹)</option>
              <option value="price-desc">Price: High to Low (₹)</option>
              <option value="pages-desc">Most Printable Pages</option>
            </select>
          </div>
        </div>

        {/* Product Cards Grid: 2 cols on mobile, 3 on tablet, 4 on desktop */}
        {sorted.length > 0 ? (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
            {sorted.map((prod) => (
              <ProductCard
                key={prod.id}
                product={prod}
                onPreview={onPreview}
                onAddToCart={onAddToCart}
                onBuyNow={onBuyNow}
              />
            ))}
          </div>
        ) : (
          <div className="text-center py-16 bg-white rounded-3xl border border-dashed border-amber-300 p-8">
            <p className="text-base font-bold text-neutral-700">No books found matching this filter.</p>
            <button
              onClick={() => {
                setAgeFilter('All');
                onResetCategory();
              }}
              className="mt-4 px-4 py-2 rounded-xl bg-[#FFD93D] font-black text-xs text-neutral-900"
            >
              Reset All Filters
            </button>
          </div>
        )}
      </div>
    </section>
  );
};
