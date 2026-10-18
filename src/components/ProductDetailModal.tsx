import React, { useState } from 'react';
import { Product } from '../types';
import {
  X,
  ShoppingBag,
  Zap,
  CheckCircle2,
  FileText,
  Clock,
  Printer,
  ChevronLeft,
  ChevronRight,
  Sparkles,
} from 'lucide-react';
import { PreviewArtworkPicker } from '../utils/illustrations';

interface ProductDetailModalProps {
  product: Product | null;
  onClose: () => void;
  onAddToCart: (product: Product) => void;
  onBuyNow: (product: Product) => void;
  allProducts: Product[];
  onSelectRelated: (product: Product) => void;
}

export const ProductDetailModal: React.FC<ProductDetailModalProps> = ({
  product,
  onClose,
  onAddToCart,
  onBuyNow,
  allProducts,
  onSelectRelated,
}) => {
  const [currentPageIndex, setCurrentPageIndex] = useState<number>(0);

  if (!product) return null;

  const samplePages = product.samplePages || [];
  const activePage = samplePages[currentPageIndex] || samplePages[0];

  const related = allProducts
    .filter((p) => p.id !== product.id && (p.category === product.category || p.ageGroup === product.ageGroup))
    .slice(0, 3);

  const discountPercent =
    product.originalPrice > product.discountedPrice
      ? Math.round(((product.originalPrice - product.discountedPrice) / product.originalPrice) * 100)
      : 0;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-neutral-900/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-6 animate-in fade-in duration-200">
      <div className="bg-[#FFFDF5] w-full max-w-4xl rounded-3xl shadow-2xl border-4 border-amber-300 overflow-hidden relative max-h-[92vh] flex flex-col">
        {/* Modal Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-20 p-2.5 rounded-full bg-white/90 text-neutral-800 hover:bg-neutral-100 hover:text-black shadow-md transition-all cursor-pointer"
          aria-label="Close product preview"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Modal Scrollable Body */}
        <div className="overflow-y-auto p-5 sm:p-8 space-y-8 flex-1">
          {/* Main PDP Grid */}
          <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-start">
            {/* Left: Interactive Sample Page Previewer */}
            <div className="md:col-span-6 space-y-4">
              <div
                className="relative aspect-[3/4] w-full rounded-3xl p-6 border-2 border-amber-200 shadow-md flex flex-col justify-between items-center"
                style={{ backgroundColor: product.themeColor || '#FFD93D' }}
              >
                {/* Top Badge */}
                <div className="w-full flex items-center justify-between">
                  <span className="bg-white/95 text-neutral-900 text-xs font-black px-3 py-1 rounded-full shadow-2xs">
                    {product.ageGroup}
                  </span>
                  <span className="bg-white/95 text-neutral-800 text-xs font-bold px-3 py-1 rounded-full shadow-2xs">
                    Page {currentPageIndex + 1} of {samplePages.length}
                  </span>
                </div>

                {/* Center SVG Vector Artwork */}
                <div className="w-full max-w-[260px] aspect-square bg-white rounded-2xl p-4 shadow-sm border border-neutral-200 flex items-center justify-center relative">
                  {activePage ? (
                    <PreviewArtworkPicker
                      type={activePage.previewSvgType}
                      isColoured={currentPageIndex === 0}
                    />
                  ) : (
                    <PreviewArtworkPicker type="lion" isColoured={true} />
                  )}
                </div>

                {/* Bottom preview title */}
                <div className="w-full bg-white/90 backdrop-blur-xs rounded-2xl p-2.5 text-center">
                  <div className="text-xs font-extrabold text-neutral-900">
                    {activePage?.title || 'Sample Activity Sheet'}
                  </div>
                  <div className="text-[11px] text-neutral-600 font-medium">
                    {activePage?.description || 'Crisp vector outline for home printing.'}
                  </div>
                </div>

                {/* Page Flipper Navigation Arrows */}
                {samplePages.length > 1 && (
                  <>
                    <button
                      onClick={() => setCurrentPageIndex((prev) => Math.max(0, prev - 1))}
                      disabled={currentPageIndex === 0}
                      className="absolute left-2 top-1/2 -translate-y-1/2 p-2 rounded-full bg-white/90 text-neutral-800 shadow-md disabled:opacity-30 disabled:cursor-not-allowed hover:bg-white"
                      title="Previous sample page"
                    >
                      <ChevronLeft className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => setCurrentPageIndex((prev) => Math.min(samplePages.length - 1, prev + 1))}
                      disabled={currentPageIndex === samplePages.length - 1}
                      className="absolute right-2 top-1/2 -translate-y-1/2 p-2 rounded-full bg-white/90 text-neutral-800 shadow-md disabled:opacity-30 disabled:cursor-not-allowed hover:bg-white"
                      title="Next sample page"
                    >
                      <ChevronRight className="w-4 h-4" />
                    </button>
                  </>
                )}
              </div>

              {/* Sample Page Selector Thumbnails */}
              {samplePages.length > 1 && (
                <div className="flex gap-2 justify-center">
                  {samplePages.map((sp, idx) => (
                    <button
                      key={idx}
                      onClick={() => setCurrentPageIndex(idx)}
                      className={`px-3 py-1.5 rounded-xl text-xs font-black transition-all ${
                        currentPageIndex === idx
                          ? 'bg-neutral-900 text-white shadow-xs'
                          : 'bg-white border border-neutral-200 text-neutral-700 hover:bg-amber-50'
                      }`}
                    >
                      Sheet {idx + 1}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Right: Book Details & Actions */}
            <div className="md:col-span-6 space-y-6">
              <div>
                <span className="text-xs font-extrabold text-[#FF8A65] tracking-wider uppercase">
                  {product.category}
                </span>
                <h2 className="font-heading font-extrabold text-2xl sm:text-3xl text-neutral-900 leading-tight mt-1">
                  {product.title}
                </h2>
                <p className="mt-2 text-sm text-neutral-700 leading-relaxed font-medium">
                  {product.description}
                </p>
              </div>

              {/* Pricing Box */}
              <div className="bg-amber-50 rounded-2xl p-4 border border-amber-200/80 flex items-baseline justify-between">
                <div>
                  <div className="text-[11px] font-bold text-neutral-500 uppercase">Single Instant Purchase</div>
                  <div className="flex items-baseline gap-3 mt-0.5">
                    <span className="font-heading font-extrabold text-3xl text-neutral-900">
                      ₹{product.discountedPrice}
                    </span>
                    {product.originalPrice > product.discountedPrice && (
                      <span className="text-base font-bold text-neutral-400 line-through">
                        ₹{product.originalPrice}
                      </span>
                    )}
                    {discountPercent > 0 && (
                      <span className="bg-[#FF8A65] text-white text-xs font-black px-2 py-0.5 rounded-full">
                        {discountPercent}% OFF
                      </span>
                    )}
                  </div>
                </div>

                <div className="text-right">
                  <span className="inline-flex items-center gap-1 text-xs font-black text-emerald-700 bg-emerald-100 px-2.5 py-1 rounded-full">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    Instant Delivery
                  </span>
                </div>
              </div>

              {/* Specification Grid */}
              <div className="grid grid-cols-2 gap-3 text-xs font-bold text-neutral-700">
                <div className="bg-white p-3 rounded-2xl border border-neutral-200 flex items-center gap-2.5">
                  <FileText className="w-4 h-4 text-sky-600 shrink-0" />
                  <div>
                    <div className="text-neutral-400 text-[10px]">Printable Pages</div>
                    <div>{product.pageCount} High-Res Pages</div>
                  </div>
                </div>

                <div className="bg-white p-3 rounded-2xl border border-neutral-200 flex items-center gap-2.5">
                  <Printer className="w-4 h-4 text-emerald-600 shrink-0" />
                  <div>
                    <div className="text-neutral-400 text-[10px]">Format</div>
                    <div>A4 &amp; Letter (300 DPI)</div>
                  </div>
                </div>

                <div className="bg-white p-3 rounded-2xl border border-neutral-200 flex items-center gap-2.5">
                  <Sparkles className="w-4 h-4 text-amber-600 shrink-0" />
                  <div>
                    <div className="text-neutral-400 text-[10px]">Recommended Age</div>
                    <div>{product.ageGroup}</div>
                  </div>
                </div>

                <div className="bg-white p-3 rounded-2xl border border-neutral-200 flex items-center gap-2.5">
                  <Clock className="w-4 h-4 text-purple-600 shrink-0" />
                  <div>
                    <div className="text-neutral-400 text-[10px]">Access</div>
                    <div>Lifetime &amp; Re-printable</div>
                  </div>
                </div>
              </div>

              {/* What Your Child Will Learn */}
              <div className="bg-white rounded-2xl p-4 border border-amber-200/80">
                <h4 className="font-heading font-extrabold text-sm text-neutral-900 mb-2 flex items-center gap-1.5">
                  <span>What Your Child Will Learn</span>
                  <span className="text-base">🌱</span>
                </h4>
                <ul className="space-y-1.5">
                  {product.learningOutcomes.map((item, idx) => (
                    <li key={idx} className="flex items-start gap-2 text-xs font-bold text-neutral-700">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 shrink-0 mt-0.5" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Action Buttons */}
              <div className="space-y-2.5 pt-2">
                <div className="grid grid-cols-2 gap-3">
                  <button
                    onClick={() => onAddToCart(product)}
                    className="py-3.5 px-4 rounded-2xl bg-amber-100 hover:bg-amber-200 text-neutral-900 font-extrabold text-sm flex items-center justify-center gap-2 transition-colors cursor-pointer border border-amber-300"
                  >
                    <ShoppingBag className="w-4 h-4" />
                    <span>Add to Cart</span>
                  </button>

                  <button
                    onClick={() => onBuyNow(product)}
                    className="py-3.5 px-4 rounded-2xl bg-[#FFD93D] hover:bg-[#ffdf59] text-neutral-900 font-extrabold text-sm flex items-center justify-center gap-2 shadow-md hover:shadow-lg transition-all cursor-pointer border-2 border-amber-400"
                  >
                    <Zap className="w-4 h-4 fill-current text-amber-700" />
                    <span>Buy Now (Instant)</span>
                  </button>
                </div>

                <button
                  onClick={() => {
                    onClose();
                    onSelectRelated(product);
                  }}
                  className="w-full py-2.5 px-4 rounded-2xl bg-white hover:bg-amber-50/60 text-neutral-800 font-extrabold text-xs flex items-center justify-center gap-2 border border-amber-200 transition-colors cursor-pointer shadow-2xs"
                >
                  <FileText className="w-3.5 h-3.5 text-amber-600" />
                  <span>View Full Details &amp; Sample Pages ({product.pageCount} Pages)</span>
                </button>

                <div className="p-2.5 bg-emerald-50/80 rounded-xl border border-emerald-200/80 flex items-center justify-center gap-2 text-[11px] font-bold text-emerald-800">
                  <span>🔒 PDF downloads strictly unlocked after verified Razorpay payment</span>
                </div>
              </div>
            </div>
          </div>

          {/* Related Products */}
          {related.length > 0 && (
            <div className="pt-6 border-t border-amber-200">
              <h3 className="font-heading font-extrabold text-lg text-neutral-900 mb-4">
                Other Parents Also Loved 💖
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                {related.map((rel) => (
                  <div
                    key={rel.id}
                    onClick={() => onSelectRelated(rel)}
                    className="p-3 bg-white rounded-2xl border border-neutral-200 hover:border-amber-400 cursor-pointer flex items-center gap-3 transition-colors shadow-2xs"
                  >
                    <div
                      className="w-12 h-14 rounded-xl flex items-center justify-center p-1 shrink-0"
                      style={{ backgroundColor: rel.themeColor || '#FFD93D' }}
                    >
                      <div className="w-8 h-8">
                        <PreviewArtworkPicker
                          type={rel.samplePages[0]?.previewSvgType || 'lion'}
                          isColoured={true}
                        />
                      </div>
                    </div>
                    <div className="overflow-hidden">
                      <div className="font-heading font-extrabold text-xs text-neutral-900 truncate">
                        {rel.title}
                      </div>
                      <div className="text-[11px] font-bold text-amber-700">₹{rel.discountedPrice}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
