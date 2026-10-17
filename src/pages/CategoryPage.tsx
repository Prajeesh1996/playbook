import React, { useEffect } from 'react';
import { ProductCategory, Product } from '../types';
import { useApp } from '../context/AppContext';
import { useRouter } from '../context/RouterContext';
import { updatePageSEO } from '../utils/seo';
import { ProductCard } from '../components/ProductCard';
import { CATEGORIES_DATA } from '../data/initialData';
import { ArrowLeft, ChevronRight, BookOpen } from 'lucide-react';

interface CategoryPageProps {
  categorySlug: string;
  onPreview: (product: Product) => void;
  onAddToCart: (product: Product) => void;
  onBuyNow: (product: Product) => void;
}

export const CategoryPage: React.FC<CategoryPageProps> = ({
  categorySlug,
  onPreview,
  onAddToCart,
  onBuyNow,
}) => {
  const { products } = useApp();
  const { navigate } = useRouter();

  // Find category info
  const categoryInfo = CATEGORIES_DATA.find(
    (c) => c.id.toLowerCase().replace(/[^a-z0-9]/g, '-') === categorySlug
  );

  const categoryName: ProductCategory =
    categoryInfo?.id ||
    (categorySlug
      .split('-')
      .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
      .join(' ') as ProductCategory);

  const categoryProducts = products.filter(
    (p) =>
      p.category.toLowerCase().replace(/[^a-z0-9]/g, '-') === categorySlug ||
      p.category === categoryName
  );

  // Dynamic SEO Injection for Category
  useEffect(() => {
    const title = `${categoryName} Books & Worksheets for Kids | Little Colour World`;
    const description =
      categoryInfo?.description ||
      `Download high-quality printable ${categoryName} PDF workbooks and colouring sheets for preschool, nursery, and kindergarten. Instant download.`;
    const canonicalPath = `/category/${categorySlug}`;

    updatePageSEO({
      title,
      description,
      canonicalPath,
      ogType: 'website',
      jsonLd: {
        '@context': 'https://schema.org',
        '@type': 'CollectionPage',
        name: title,
        description,
        url: `${window.location.origin}${canonicalPath}`,
      },
    });
  }, [categoryName, categorySlug, categoryInfo]);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8 animate-in fade-in duration-200">
      {/* Breadcrumb Navigation */}
      <nav aria-label="Breadcrumb" className="flex items-center gap-2 text-xs font-bold text-neutral-500 overflow-x-auto whitespace-nowrap">
        <button onClick={() => navigate('/')} className="hover:text-neutral-900 cursor-pointer">
          Home
        </button>
        <ChevronRight className="w-3.5 h-3.5 text-neutral-400 shrink-0" />
        <button onClick={() => navigate('/books')} className="hover:text-neutral-900 cursor-pointer">
          Categories
        </button>
        <ChevronRight className="w-3.5 h-3.5 text-neutral-400 shrink-0" />
        <span className="text-neutral-900 font-extrabold">{categoryName}</span>
      </nav>

      {/* Category Hero Banner */}
      <div
        className="rounded-3xl p-6 sm:p-10 border-2 border-amber-200 relative overflow-hidden shadow-xs"
        style={{ backgroundColor: categoryInfo?.bgPastel || '#FFF9D2' }}
      >
        <div className="max-w-2xl space-y-3 relative z-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-black uppercase tracking-wider bg-white/80 text-neutral-800 shadow-2xs">
            <BookOpen className="w-3.5 h-3.5 text-amber-600" />
            <span>Preschool &amp; Kindergarten Collection</span>
          </div>

          <h1 className="font-heading font-extrabold text-3xl sm:text-4xl text-neutral-900">
            {categoryName}
          </h1>

          <p className="text-sm font-bold text-neutral-700 leading-relaxed">
            {categoryInfo?.description ||
              `Explore cheerful printable ${categoryName} designed with extra-thick outlines for little fingers.`}
          </p>

          <div className="text-xs font-extrabold text-neutral-600 pt-1">
            Showing {categoryProducts.length} printable colouring books and activity packs
          </div>
        </div>
      </div>

      {/* Products Grid */}
      {categoryProducts.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {categoryProducts.map((product) => (
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
        <div className="text-center py-16 bg-white rounded-3xl border border-neutral-200 space-y-4">
          <p className="text-neutral-500 font-bold text-sm">
            No workbooks currently found in this category.
          </p>
          <button
            onClick={() => navigate('/books')}
            className="px-6 py-2.5 rounded-xl bg-amber-300 hover:bg-amber-400 font-extrabold text-xs inline-flex items-center gap-2 cursor-pointer"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Browse All Colouring Books</span>
          </button>
        </div>
      )}
    </div>
  );
};
