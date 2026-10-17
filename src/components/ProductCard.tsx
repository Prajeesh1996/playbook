import React from 'react';
import { Product } from '../types';
import { Eye, ShoppingBag, Zap, FileText } from 'lucide-react';
import { PreviewArtworkPicker } from '../utils/illustrations';
import { useRouter } from '../context/RouterContext';

interface ProductCardProps {
  product: Product;
  onPreview: (product: Product) => void;
  onAddToCart: (product: Product) => void;
  onBuyNow: (product: Product) => void;
}

export const ProductCard: React.FC<ProductCardProps> = ({
  product,
  onPreview,
  onAddToCart,
  onBuyNow,
}) => {
  const { navigate } = useRouter();
  const discountPercent =
    product.originalPrice > product.discountedPrice
      ? Math.round(((product.originalPrice - product.discountedPrice) / product.originalPrice) * 100)
      : 0;

  const previewArtType = product.samplePages[0]?.previewSvgType || 'lion';

  return (
    <div className="group bg-white rounded-3xl border-2 border-amber-200/70 hover:border-amber-400 p-3.5 sm:p-4 flex flex-col justify-between shadow-xs hover:shadow-xl transition-all duration-200 transform hover:-translate-y-1">
      {/* Top Cover Display */}
      <div className="relative aspect-[3/4] w-full rounded-2xl overflow-hidden mb-3 border border-neutral-100 flex flex-col justify-between p-3"
           style={{ backgroundColor: product.themeColor || '#FFD93D' }}>
        
        {/* Top Badges */}
        <div className="flex items-center justify-between z-10">
          <span className="bg-white/95 backdrop-blur-xs text-neutral-900 text-[10px] sm:text-xs font-black px-2 py-0.5 rounded-full shadow-2xs">
            {product.ageGroup}
          </span>
          {discountPercent > 0 && (
            <span className="bg-[#FF8A65] text-white text-[10px] sm:text-xs font-black px-2 py-0.5 rounded-full shadow-2xs">
              {discountPercent}% OFF
            </span>
          )}
        </div>

        {/* Center Artwork */}
        <div
          onClick={() => navigate(`/book/${product.slug}`)}
          className="flex-1 flex items-center justify-center p-2 relative cursor-pointer"
        >
          <div className="w-full h-full max-h-36 sm:max-h-44 transition-transform group-hover:scale-105 duration-200">
            <PreviewArtworkPicker type={previewArtType} isColoured={true} />
          </div>

          {/* Quick Preview Hover Overlay */}
          <button
            onClick={(e) => {
              e.stopPropagation();
              onPreview(product);
            }}
            className="absolute inset-0 m-auto w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-white/95 text-neutral-900 flex items-center justify-center shadow-lg opacity-0 group-hover:opacity-100 transition-opacity hover:scale-110 cursor-pointer"
            title="Preview inside pages"
            aria-label={`Preview pages of ${product.title}`}
          >
            <Eye className="w-5 h-5 text-amber-600" />
          </button>
        </div>

        {/* Bottom Format Details */}
        <div className="z-10 flex items-center justify-between text-[10px] sm:text-[11px] font-black text-neutral-800 bg-white/90 backdrop-blur-xs px-2.5 py-1 rounded-xl">
          <span className="flex items-center gap-1">
            <FileText className="w-3 h-3 text-neutral-600" />
            {product.pageCount} Pages
          </span>
          <span>PDF Printable</span>
        </div>
      </div>

      {/* Product Information */}
      <div className="space-y-1.5 flex-1 flex flex-col justify-between">
        <div>
          {/* Category */}
          <div
            onClick={() =>
              navigate(`/category/${product.category.toLowerCase().replace(/[^a-z0-9]/g, '-')}`)
            }
            className="text-[11px] font-bold text-amber-700 uppercase tracking-wider truncate cursor-pointer hover:underline"
          >
            {product.category}
          </div>

          {/* Title */}
          <h4
            onClick={() => navigate(`/book/${product.slug}`)}
            className="font-heading font-extrabold text-sm sm:text-base text-neutral-900 group-hover:text-[#FF8A65] transition-colors line-clamp-2 leading-snug cursor-pointer"
          >
            {product.title}
          </h4>
        </div>

        {/* Price & Rating */}
        <div className="pt-2">
          <div className="flex items-baseline gap-2">
            <span className="font-heading font-extrabold text-lg sm:text-xl text-neutral-900">
              ₹{product.discountedPrice}
            </span>
            {product.originalPrice > product.discountedPrice && (
              <span className="text-xs sm:text-sm font-bold text-neutral-400 line-through">
                ₹{product.originalPrice}
              </span>
            )}
          </div>
        </div>

        {/* Action Buttons */}
        <div className="pt-2.5 grid grid-cols-2 gap-1.5">
          <button
            onClick={() => onAddToCart(product)}
            className="py-2 px-2 rounded-xl bg-amber-100 hover:bg-amber-200 text-neutral-900 font-extrabold text-[11px] sm:text-xs flex items-center justify-center gap-1 transition-colors cursor-pointer"
            title="Add to cart"
          >
            <ShoppingBag className="w-3.5 h-3.5 text-neutral-700" />
            <span>Add</span>
          </button>

          <button
            onClick={() => onBuyNow(product)}
            className="py-2 px-2 rounded-xl bg-[#FFD93D] hover:bg-[#ffdf59] text-neutral-900 font-extrabold text-[11px] sm:text-xs flex items-center justify-center gap-1 transition-colors shadow-xs cursor-pointer"
            title="Buy now with instant checkout"
          >
            <Zap className="w-3.5 h-3.5 fill-current text-amber-700" />
            <span>Buy Now</span>
          </button>
        </div>
      </div>
    </div>
  );
};
