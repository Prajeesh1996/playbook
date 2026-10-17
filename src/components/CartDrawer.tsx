import React, { useState } from 'react';
import { useCart } from '../context/CartContext';
import { X, Trash2, Tag, ArrowRight, ShieldCheck, Sparkles, ShoppingBag } from 'lucide-react';
import { PreviewArtworkPicker } from '../utils/illustrations';

interface CartDrawerProps {
  onProceedToCheckout: () => void;
}

export const CartDrawer: React.FC<CartDrawerProps> = ({ onProceedToCheckout }) => {
  const {
    cart,
    removeFromCart,
    clearCart,
    subtotal,
    discount,
    total,
    appliedCoupon,
    applyCoupon,
    removeCoupon,
    isCartDrawerOpen,
    setIsCartDrawerOpen,
  } = useCart();

  const [couponInput, setCouponInput] = useState('');
  const [couponFeedback, setCouponFeedback] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  if (!isCartDrawerOpen) return null;

  const handleApplyCoupon = (e: React.FormEvent) => {
    e.preventDefault();
    if (!couponInput.trim()) return;
    const res = applyCoupon(couponInput);
    if (res.success) {
      setCouponFeedback({ type: 'success', text: res.message });
      setCouponInput('');
    } else {
      setCouponFeedback({ type: 'error', text: res.message });
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden bg-neutral-900/50 backdrop-blur-xs flex justify-end animate-in fade-in duration-200">
      <div className="bg-[#FFFDF5] w-full max-w-md h-full shadow-2xl flex flex-col justify-between border-l-4 border-amber-300 animate-in slide-in-from-right duration-200">
        {/* Drawer Header */}
        <div className="p-5 border-b border-amber-200 flex items-center justify-between bg-white">
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-xl bg-amber-100 text-neutral-800">
              <ShoppingBag className="w-5 h-5" />
            </div>
            <div>
              <h2 className="font-heading font-extrabold text-lg text-neutral-900">
                Your Art Backpack 🎒
              </h2>
              <p className="text-xs text-neutral-500 font-bold">
                {cart.length} {cart.length === 1 ? 'item' : 'items'} ready for instant download
              </p>
            </div>
          </div>

          <button
            onClick={() => setIsCartDrawerOpen(false)}
            className="p-2 rounded-full hover:bg-neutral-100 text-neutral-500 hover:text-neutral-800 transition-colors"
            aria-label="Close cart drawer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Drawer Items List */}
        <div className="p-5 overflow-y-auto flex-1 space-y-4">
          {cart.length === 0 ? (
            <div className="text-center py-16 space-y-4">
              <div className="w-20 h-20 rounded-full bg-amber-100 text-amber-600 flex items-center justify-center mx-auto text-3xl">
                🎒
              </div>
              <h3 className="font-heading font-extrabold text-lg text-neutral-800">
                Your backpack is empty!
              </h3>
              <p className="text-xs text-neutral-600 font-medium max-w-xs mx-auto">
                Explore our preschool colouring books and worksheets starting at just ₹49!
              </p>
              <button
                onClick={() => setIsCartDrawerOpen(false)}
                className="mt-2 px-6 py-2.5 rounded-2xl bg-[#FFD93D] font-black text-xs text-neutral-900 hover:bg-[#ffe26b] transition-colors"
              >
                Browse Colouring Books
              </button>
            </div>
          ) : (
            <>
              {cart.map((item) => (
                <div
                  key={item.product.id}
                  className="bg-white rounded-2xl p-3 border border-amber-200/80 shadow-2xs flex items-center gap-3 relative group"
                >
                  {/* Thumbnail */}
                  <div
                    className="w-16 h-20 rounded-xl flex items-center justify-center p-1.5 shrink-0"
                    style={{ backgroundColor: item.product.themeColor || '#FFD93D' }}
                  >
                    <div className="w-10 h-10">
                      <PreviewArtworkPicker
                        type={item.product.samplePages[0]?.previewSvgType || 'lion'}
                        isColoured={true}
                      />
                    </div>
                  </div>

                  {/* Info */}
                  <div className="flex-1 min-w-0 pr-8">
                    <span className="text-[10px] font-bold text-amber-700 uppercase">
                      {item.product.category}
                    </span>
                    <h4 className="font-heading font-extrabold text-xs sm:text-sm text-neutral-900 truncate">
                      {item.product.title}
                    </h4>
                    <div className="text-[11px] text-neutral-500 font-bold mt-0.5">
                      {item.product.pageCount} Pages • {item.product.ageGroup}
                    </div>
                    <div className="flex items-baseline gap-2 mt-1">
                      <span className="font-heading font-extrabold text-sm text-neutral-900">
                        ₹{item.product.discountedPrice}
                      </span>
                      {item.product.originalPrice > item.product.discountedPrice && (
                        <span className="text-xs text-neutral-400 line-through">
                          ₹{item.product.originalPrice}
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Delete Button */}
                  <button
                    onClick={() => removeFromCart(item.product.id)}
                    className="absolute top-3 right-3 p-1.5 text-neutral-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors cursor-pointer"
                    title="Remove item"
                    aria-label={`Remove ${item.product.title}`}
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              ))}

              <div className="flex justify-between items-center pt-2">
                <span className="text-[11px] font-bold text-neutral-400">
                  Digital printable PDF delivery
                </span>
                <button
                  onClick={clearCart}
                  className="text-[11px] font-bold text-neutral-500 hover:text-red-600 underline"
                >
                  Clear all items
                </button>
              </div>

              {/* Coupon Code Section */}
              <div className="bg-white rounded-2xl p-4 border border-amber-200 mt-4 space-y-2">
                <div className="flex items-center gap-1.5 text-xs font-bold text-neutral-700">
                  <Tag className="w-3.5 h-3.5 text-amber-600" />
                  <span>Have a discount coupon?</span>
                </div>

                {appliedCoupon ? (
                  <div className="flex items-center justify-between bg-emerald-50 border border-emerald-300 rounded-xl px-3 py-2 text-xs font-bold text-emerald-800">
                    <span className="flex items-center gap-1">
                      <Sparkles className="w-3.5 h-3.5 text-emerald-600" />
                      Code <strong>{appliedCoupon.code}</strong> applied (-₹{discount})
                    </span>
                    <button
                      onClick={removeCoupon}
                      className="text-neutral-500 hover:text-neutral-800 p-0.5"
                      title="Remove coupon"
                    >
                      <X className="w-3.5 h-3.5" />
                    </button>
                  </div>
                ) : (
                  <form onSubmit={handleApplyCoupon} className="flex gap-2">
                    <input
                      type="text"
                      placeholder="e.g. LITTLE10"
                      value={couponInput}
                      onChange={(e) => setCouponInput(e.target.value)}
                      className="flex-1 px-3 py-1.5 rounded-xl border border-neutral-300 text-xs font-bold uppercase focus:outline-none focus:ring-2 focus:ring-amber-400"
                    />
                    <button
                      type="submit"
                      className="px-4 py-1.5 rounded-xl bg-amber-200 hover:bg-amber-300 text-neutral-900 font-extrabold text-xs transition-colors"
                    >
                      Apply
                    </button>
                  </form>
                )}

                {couponFeedback && (
                  <p
                    className={`text-[11px] font-bold ${
                      couponFeedback.type === 'success' ? 'text-emerald-600' : 'text-red-600'
                    }`}
                  >
                    {couponFeedback.text}
                  </p>
                )}
              </div>
            </>
          )}
        </div>

        {/* Drawer Footer with Calculations & Checkout CTA */}
        {cart.length > 0 && (
          <div className="p-5 bg-white border-t border-amber-200 space-y-3 shadow-lg">
            <div className="space-y-1.5 text-xs font-bold text-neutral-600">
              <div className="flex justify-between">
                <span>Subtotal</span>
                <span>₹{subtotal}</span>
              </div>
              {discount > 0 && (
                <div className="flex justify-between text-emerald-700">
                  <span>Coupon Discount</span>
                  <span>-₹{discount}</span>
                </div>
              )}
              <div className="flex justify-between text-sm sm:text-base font-extrabold text-neutral-900 pt-2 border-t border-neutral-100">
                <span>Total Amount</span>
                <span className="text-xl font-heading text-neutral-900">₹{total}</span>
              </div>
            </div>

            <button
              onClick={() => {
                setIsCartDrawerOpen(false);
                onProceedToCheckout();
              }}
              className="w-full py-4 px-4 rounded-2xl bg-[#FFD93D] hover:bg-[#ffdf59] active:bg-amber-400 text-neutral-900 font-extrabold text-sm flex items-center justify-center gap-2 shadow-md hover:shadow-lg transition-all cursor-pointer border-2 border-amber-400"
            >
              <span>Proceed to Instant Checkout</span>
              <ArrowRight className="w-4 h-4" />
            </button>

            <div className="flex items-center justify-center gap-1.5 text-[10px] font-bold text-neutral-400 pt-1">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
              <span>Razorpay 256-bit Encrypted Checkout • Instant PDF Access</span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
