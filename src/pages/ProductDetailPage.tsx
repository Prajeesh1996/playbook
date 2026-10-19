import React, { useEffect, useState } from 'react';
import { Product } from '../types';
import { useApp } from '../context/AppContext';
import { useCart } from '../context/CartContext';
import { useRouter } from '../context/RouterContext';
import { updatePageSEO } from '../utils/seo';
import { PreviewArtworkPicker } from '../utils/illustrations';
import {
  Sparkles,
  ShoppingBag,
  Zap,
  Star,
  CheckCircle2,
  Printer,
  ShieldCheck,
  ChevronRight,
  ArrowLeft,
  FileText,
  Clock,
  Heart,
  Share2,
  Download,
} from 'lucide-react';

interface ProductDetailPageProps {
  slug: string;
  onBuyNow: (product: Product) => void;
  onAddToCart: (product: Product) => void;
}

export const ProductDetailPage: React.FC<ProductDetailPageProps> = ({
  slug,
  onBuyNow,
  onAddToCart,
}) => {
  const { products } = useApp();
  const { navigate } = useRouter();
  const [activeSampleIndex, setActiveSampleIndex] = useState(0);
  const [copiedLink, setCopiedLink] = useState(false);

  const product = products.find((p) => p.slug === slug || p.id === slug);

  // Dynamic SEO Injection for Product
  useEffect(() => {
    if (!product) {
      updatePageSEO({
        title: 'Book Not Found | Little Colour World',
        description: 'The requested colouring book could not be found.',
      });
      return;
    }

    const pageTitle = `${product.title} (PDF Printable) – ${product.ageGroup || 'Ages 2–6'} | Little Colour World`;
    const pageDesc = `${product.shortDescription || (product.description || '').slice(0, 150)}. Instant printable A4 PDF workbook. Starting at ₹${product.discountedPrice || 49}.`;
    const canonicalPath = `/book/${product.slug || product.id}`;

    const jsonLd = {
      '@context': 'https://schema.org',
      '@type': 'Product',
      name: product.title,
      description: product.description,
      category: product.category,
      offers: {
        '@type': 'Offer',
        price: product.discountedPrice.toString(),
        priceCurrency: 'INR',
        availability: 'https://schema.org/InStock',
        url: `${window.location.origin}${canonicalPath}`,
      },
      aggregateRating: {
        '@type': 'AggregateRating',
        ratingValue: product.rating.toString(),
        reviewCount: product.reviewsCount.toString(),
      },
      brand: {
        '@type': 'Brand',
        name: 'Little Colour World',
      },
    };

    updatePageSEO({
      title: pageTitle,
      description: pageDesc,
      canonicalPath,
      ogType: 'product',
      jsonLd,
    });
  }, [product]);

  if (!product) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-20 text-center">
        <div className="w-16 h-16 rounded-3xl bg-amber-100 text-amber-700 flex items-center justify-center mx-auto mb-4">
          <FileText className="w-8 h-8" />
        </div>
        <h1 className="font-heading font-extrabold text-2xl text-neutral-900 mb-2">
          Colouring Book Not Found
        </h1>
        <p className="text-neutral-500 text-sm font-bold mb-6">
          The workbook you are looking for may have been moved or updated.
        </p>
        <button
          onClick={() => navigate('/books')}
          className="px-6 py-3 rounded-2xl bg-amber-300 hover:bg-amber-400 text-neutral-900 font-extrabold text-xs inline-flex items-center gap-2 cursor-pointer shadow-sm"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Browse All Printable Books</span>
        </button>
      </div>
    );
  }

  const relatedProducts = products
    .filter((p) => p.category === product.category && p.id !== product.id)
    .slice(0, 3);

  const discountPercent = Math.round(
    ((product.originalPrice - product.discountedPrice) / product.originalPrice) * 100
  );

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: product.title,
        text: `Check out ${product.title} on Little Colour World!`,
        url: window.location.href,
      }).catch(() => {});
    } else {
      navigator.clipboard.writeText(window.location.href);
      setCopiedLink(true);
      setTimeout(() => setCopiedLink(false), 2000);
    }
  };

  return (
    <article className="max-w-6xl mx-auto px-4 sm:px-6 py-6 sm:py-10 space-y-8 animate-in fade-in duration-200">
      {/* Breadcrumb Navigation */}
      <nav aria-label="Breadcrumb" className="flex items-center gap-2 text-xs font-bold text-neutral-500 overflow-x-auto whitespace-nowrap">
        <button onClick={() => navigate('/')} className="hover:text-neutral-900 cursor-pointer">
          Home
        </button>
        <ChevronRight className="w-3.5 h-3.5 text-neutral-400 shrink-0" />
        <button onClick={() => navigate('/books')} className="hover:text-neutral-900 cursor-pointer">
          Colouring Books
        </button>
        <ChevronRight className="w-3.5 h-3.5 text-neutral-400 shrink-0" />
        <button
          onClick={() => navigate(`/category/${product.category.toLowerCase().replace(/[^a-z0-9]/g, '-')}`)}
          className="hover:text-neutral-900 cursor-pointer text-amber-700"
        >
          {product.category}
        </button>
        <ChevronRight className="w-3.5 h-3.5 text-neutral-400 shrink-0" />
        <span className="text-neutral-800 truncate max-w-xs">{product.title}</span>
      </nav>

      {/* Main Product Showcase Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10">
        {/* Left Column: Artwork Gallery & Sample Previews */}
        <div className="lg:col-span-6 space-y-4">
          <div className="relative rounded-3xl overflow-hidden bg-gradient-to-b from-[#FFFDF5] to-amber-50/60 p-6 border-4 border-amber-200 shadow-md flex items-center justify-center min-h-[360px] sm:min-h-[420px]">
            {/* Top Badges */}
            <div className="absolute top-4 left-4 flex gap-2">
              <span className="px-3 py-1 rounded-full text-xs font-black bg-amber-300 text-neutral-900 shadow-xs">
                {product.ageGroup}
              </span>
              {discountPercent > 0 && (
                <span className="px-3 py-1 rounded-full text-xs font-black bg-rose-500 text-white shadow-xs">
                  SAVE {discountPercent}%
                </span>
              )}
            </div>

            <button
              onClick={handleShare}
              className="absolute top-4 right-4 p-2 rounded-full bg-white/80 hover:bg-white text-neutral-600 shadow-xs cursor-pointer transition-colors"
              title="Share Book"
            >
              <Share2 className="w-4 h-4" />
            </button>

            {/* Main Preview Illustration */}
            <div className="w-full max-w-xs aspect-[4/5] bg-white rounded-2xl shadow-xl p-5 border border-amber-100 flex flex-col justify-between">
              <div className="text-center space-y-1">
                <span className="text-[10px] uppercase tracking-wider font-extrabold text-amber-600">
                  LITTLE COLOUR WORLD
                </span>
                <h3 className="font-heading font-extrabold text-base text-neutral-900 line-clamp-1">
                  {product.title}
                </h3>
              </div>

              <div className="w-full h-44 flex items-center justify-center my-auto">
                <PreviewArtworkPicker
                  type={product.samplePages[activeSampleIndex]?.previewSvgType || 'lion'}
                  className="w-40 h-40"
                />
              </div>

              <div className="text-center pt-2 border-t border-neutral-100">
                <span className="text-[11px] font-bold text-neutral-400">
                  {product.samplePages[activeSampleIndex]?.title || 'Printable Line Art'}
                </span>
              </div>
            </div>
          </div>

          {/* Sample Pages Thumbnails Carousel */}
          {product.samplePages && product.samplePages.length > 0 && (
            <div className="space-y-2">
              <div className="flex items-center justify-between text-xs font-extrabold text-neutral-700">
                <span>Sample Page Previews ({product.pageCount} Total Pages):</span>
                <span className="text-neutral-400 font-bold">Click to view page preview</span>
              </div>
              <div className="grid grid-cols-4 gap-2">
                {product.samplePages.map((sample, idx) => (
                  <button
                    key={idx}
                    onClick={() => setActiveSampleIndex(idx)}
                    className={`p-2 rounded-xl border-2 text-left transition-all cursor-pointer ${
                      activeSampleIndex === idx
                        ? 'border-amber-400 bg-amber-50 shadow-xs ring-2 ring-amber-300'
                        : 'border-neutral-200 bg-white hover:border-neutral-300'
                    }`}
                  >
                    <div className="w-full h-14 flex items-center justify-center">
                      <PreviewArtworkPicker type={sample.previewSvgType} className="w-12 h-12" />
                    </div>
                    <div className="text-[10px] font-bold text-neutral-700 truncate mt-1 text-center">
                      {sample.title}
                    </div>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Quality Trust Guarantee Card */}
          <div className="bg-amber-50/80 rounded-2xl p-4 border border-amber-200/70 grid grid-cols-2 gap-3 text-xs">
            <div className="flex items-center gap-2">
              <Printer className="w-4 h-4 text-amber-700 shrink-0" />
              <span className="font-bold text-neutral-700">Standard A4 / Letter PDF</span>
            </div>
            <div className="flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-emerald-700 shrink-0" />
              <span className="font-bold text-neutral-700">Instant Razorpay Delivery</span>
            </div>
            <div className="flex items-center gap-2">
              <Clock className="w-4 h-4 text-sky-700 shrink-0" />
              <span className="font-bold text-neutral-700">Lifetime Download Access</span>
            </div>
            <div className="flex items-center gap-2">
              <Heart className="w-4 h-4 text-rose-600 shrink-0" />
              <span className="font-bold text-neutral-700">Screen-Free Learning</span>
            </div>
          </div>
        </div>

        {/* Right Column: Title, Pricing, Actions & Learning Outcomes */}
        <div className="lg:col-span-6 space-y-6">
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-0.5 rounded-full text-[11px] font-black uppercase tracking-wider bg-sky-100 text-sky-800">
                {product.category}
              </span>
              <div className="flex items-center gap-1 text-xs font-black text-amber-600 bg-amber-50 px-2 py-0.5 rounded-full">
                <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                <span>{product.rating}</span>
                <span className="text-neutral-400 font-bold">({product.reviewsCount} reviews)</span>
              </div>
            </div>

            <h1 className="font-heading font-extrabold text-2xl sm:text-3xl lg:text-4xl text-neutral-900 leading-tight">
              {product.title}
            </h1>

            <p className="text-xs sm:text-sm text-neutral-600 font-bold leading-relaxed">
              {product.shortDescription || product.description}
            </p>
          </div>

          {/* Pricing Box */}
          <div className="bg-white p-5 rounded-3xl border-2 border-neutral-200 shadow-xs flex items-center justify-between">
            <div>
              <div className="flex items-baseline gap-2.5">
                <span className="font-heading font-extrabold text-3xl sm:text-4xl text-neutral-900">
                  ₹{product.discountedPrice}
                </span>
                <span className="text-base sm:text-lg font-bold text-neutral-400 line-through">
                  ₹{product.originalPrice}
                </span>
                <span className="text-xs font-black text-emerald-700 bg-emerald-100 px-2.5 py-0.5 rounded-full">
                  Save ₹{product.originalPrice - product.discountedPrice}
                </span>
              </div>
              <div className="text-[11px] font-bold text-neutral-400 mt-0.5">
                Instant digital download • Unlimited home/classroom prints
              </div>
            </div>

            <div className="text-right">
              <span className="text-xs font-extrabold text-neutral-500 block">Printable Pages</span>
              <span className="font-heading font-extrabold text-xl text-neutral-800">
                {product.pageCount} Pages
              </span>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="space-y-3">
            <button
              onClick={() => navigate(`/checkout/${product.slug}`)}
              className="w-full py-4 rounded-2xl bg-gradient-to-r from-[#FFD93D] to-[#ffc93d] hover:brightness-105 text-neutral-900 font-heading font-extrabold text-base flex items-center justify-center gap-2.5 shadow-md shadow-amber-300/40 cursor-pointer transition-all"
            >
              <Zap className="w-5 h-5 fill-neutral-900" />
              <span>Buy Now for ₹{product.discountedPrice} (Secure Checkout)</span>
            </button>

            <button
              onClick={() => onAddToCart(product)}
              className="w-full py-3.5 rounded-2xl bg-white hover:bg-neutral-50 text-neutral-900 font-extrabold text-xs flex items-center justify-center gap-2 border-2 border-neutral-300 shadow-xs cursor-pointer transition-colors"
            >
              <ShoppingBag className="w-4 h-4" />
              <span>Add to Backpack &amp; Explore More</span>
            </button>

            <div className="p-3 bg-emerald-50/80 rounded-2xl border border-emerald-200/80 flex items-center justify-center gap-2 text-xs font-bold text-emerald-800">
              <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>Printable PDF unlocked immediately after Razorpay payment verification</span>
            </div>
          </div>

          {copiedLink && (
            <div className="p-2.5 bg-emerald-100 text-emerald-800 text-xs font-bold rounded-xl text-center">
              Link copied to clipboard! Share it with parent groups.
            </div>
          )}

          {/* Key Learning Outcomes Checklist */}
          <div className="bg-[#FFFDF5] p-5 rounded-2xl border border-amber-200/80 space-y-3">
            <h3 className="font-heading font-extrabold text-sm text-neutral-900 flex items-center gap-1.5">
              <Sparkles className="w-4 h-4 text-amber-600" />
              <span>Skills &amp; Development Outcomes:</span>
            </h3>
            <ul className="space-y-2 text-xs font-bold text-neutral-700">
              {product.learningOutcomes.map((outcome, idx) => (
                <li key={idx} className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                  <span>{outcome}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Detailed Description */}
          <div className="space-y-2 text-xs font-bold text-neutral-600 leading-relaxed">
            <h3 className="font-heading font-extrabold text-sm text-neutral-900">
              About this Printable Book:
            </h3>
            <p>{product.description}</p>
          </div>
        </div>
      </div>

      {/* Related Books in Same Category */}
      {relatedProducts.length > 0 && (
        <section className="pt-8 border-t border-neutral-200 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="font-heading font-extrabold text-xl text-neutral-900">
              More {product.category}
            </h2>
            <button
              onClick={() => navigate('/books')}
              className="text-xs font-extrabold text-amber-800 hover:text-amber-900 cursor-pointer"
            >
              View All Books &rarr;
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {relatedProducts.map((rel) => (
              <div
                key={rel.id}
                onClick={() => navigate(`/book/${rel.slug}`)}
                className="bg-white rounded-2xl p-4 border border-neutral-200 hover:border-amber-300 shadow-xs hover:shadow-md cursor-pointer transition-all flex flex-col justify-between group"
              >
                <div className="space-y-3">
                  <div className="h-32 bg-amber-50/50 rounded-xl flex items-center justify-center p-2">
                    <PreviewArtworkPicker
                      type={rel.samplePages[0]?.previewSvgType || 'lion'}
                      className="w-24 h-24 group-hover:scale-105 transition-transform"
                    />
                  </div>
                  <div>
                    <h3 className="font-heading font-extrabold text-sm text-neutral-900 group-hover:text-amber-700 transition-colors">
                      {rel.title}
                    </h3>
                    <p className="text-[11px] text-neutral-500 font-bold line-clamp-1 mt-0.5">
                      {rel.shortDescription}
                    </p>
                  </div>
                </div>

                <div className="pt-3 mt-3 border-t border-neutral-100 flex items-center justify-between">
                  <span className="font-heading font-extrabold text-base text-neutral-900">
                    ₹{rel.discountedPrice}
                  </span>
                  <span className="text-[11px] font-black text-amber-700 group-hover:translate-x-0.5 transition-transform">
                    View Details &rarr;
                  </span>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}
    </article>
  );
};
