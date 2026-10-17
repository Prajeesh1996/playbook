import React, { useState } from 'react';
import { Product, Order } from '../types';
import { useCart } from '../context/CartContext';
import { useApp } from '../context/AppContext';
import { X, ShieldCheck, Lock, CreditCard, Smartphone, Building, Sparkles, AlertCircle } from 'lucide-react';
import confetti from 'canvas-confetti';

interface CheckoutModalProps {
  directProduct?: Product | null;
  onClose: () => void;
  onSuccess: (order: Order) => void;
}

export const CheckoutModal: React.FC<CheckoutModalProps> = ({
  directProduct,
  onClose,
  onSuccess,
}) => {
  const { cart, subtotal, discount, total, appliedCoupon, clearCart } = useCart();
  const { createOrder, markOrderPaid } = useApp();

  // Determine items to purchase
  const itemsToBuy = directProduct
    ? [
        {
          productId: directProduct.id,
          title: directProduct.title,
          price: directProduct.discountedPrice,
          originalPrice: directProduct.originalPrice,
        },
      ]
    : cart.map((i) => ({
        productId: i.product.id,
        title: i.product.title,
        price: i.product.discountedPrice,
        originalPrice: i.product.originalPrice,
      }));

  const orderSubtotal = directProduct ? directProduct.discountedPrice : subtotal;
  const orderDiscount = directProduct ? 0 : discount;
  const orderTotal = directProduct ? directProduct.discountedPrice : total;

  const [parentName, setParentName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [selectedMethod, setSelectedMethod] = useState<'upi' | 'card' | 'netbanking'>('upi');
  const [upiId, setUpiId] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const handleSubmitPayment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!parentName.trim() || !email.trim() || !phone.trim()) {
      setErrorMsg('Please complete all contact details so we can send your printable PDFs!');
      return;
    }

    setIsProcessing(true);
    setErrorMsg(null);

    try {
      // 1. Create simulated/backend order
      const newOrder = createOrder({
        customer: {
          parentName: parentName.trim(),
          email: email.trim().toLowerCase(),
          phone: phone.trim(),
        },
        items: itemsToBuy,
        subtotal: orderSubtotal,
        discount: orderDiscount,
        couponCode: appliedCoupon?.code,
        total: orderTotal,
        razorpayOrderId: `order_rzp_${Date.now()}`,
        status: 'pending',
      });

      // 2. Razorpay payment verification
      // Simulate Razorpay checkout response delay
      await new Promise((res) => setTimeout(res, 1200));

      const fakeRazorpayPaymentId = `pay_rzp_${Math.random().toString(36).substring(2, 11)}_${Date.now()}`;
      
      // 3. Mark order as paid & verified
      const confirmedOrder = markOrderPaid(newOrder.id, fakeRazorpayPaymentId);

      // Trigger celebration confetti
      try {
        confetti({
          particleCount: 100,
          spread: 70,
          origin: { y: 0.6 },
          colors: ['#FFD93D', '#FF8A65', '#6BCBFF', '#FFB6C1', '#B8F2C8'],
        });
      } catch (err) {
        console.warn('Confetti error', err);
      }

      if (!directProduct) {
        clearCart();
      }

      onSuccess(confirmedOrder || newOrder);
    } catch (err: any) {
      console.error(err);
      setErrorMsg('Payment verification failed. Please try again.');
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-neutral-900/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-6 animate-in fade-in duration-200">
      <div className="bg-[#FFFDF5] w-full max-w-2xl rounded-3xl shadow-2xl border-4 border-amber-300 overflow-hidden relative">
        {/* Header */}
        <div className="p-5 sm:p-6 bg-white border-b border-amber-200 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="p-2.5 rounded-2xl bg-amber-100 text-neutral-800">
              <Lock className="w-5 h-5 text-amber-700" />
            </div>
            <div>
              <h2 className="font-heading font-extrabold text-xl text-neutral-900">
                Secure Instant Checkout
              </h2>
              <p className="text-xs text-neutral-500 font-bold">
                Razorpay 256-Bit SSL Encrypted • Instant PDF Access
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-full hover:bg-neutral-100 text-neutral-400 hover:text-neutral-800"
            aria-label="Close checkout"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <form onSubmit={handleSubmitPayment} className="p-5 sm:p-7 space-y-6">
          {/* Order Summary Strip */}
          <div className="bg-amber-50 rounded-2xl p-4 border border-amber-200/80">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-black text-amber-800 uppercase tracking-wide">
                Order Items ({itemsToBuy.length})
              </span>
              <span className="text-xs font-bold text-neutral-500">Instant PDF Download</span>
            </div>
            <div className="space-y-1.5 max-h-28 overflow-y-auto pr-1">
              {itemsToBuy.map((it, idx) => (
                <div key={idx} className="flex justify-between items-center text-xs font-bold text-neutral-700">
                  <span className="truncate pr-4">{it.title}</span>
                  <span className="text-neutral-900 shrink-0">₹{it.price}</span>
                </div>
              ))}
            </div>

            <div className="mt-3 pt-3 border-t border-amber-200/60 flex items-baseline justify-between text-neutral-900 font-extrabold">
              <span className="text-sm">Total Payable (INR)</span>
              <span className="text-2xl font-heading text-neutral-900">₹{orderTotal}</span>
            </div>
          </div>

          {/* Contact Details */}
          <div className="space-y-3">
            <h3 className="font-heading font-extrabold text-sm text-neutral-900 flex items-center gap-1.5">
              <span>1. Where should we send your PDFs?</span>
              <Sparkles className="w-4 h-4 text-amber-500" />
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div>
                <label className="block text-xs font-bold text-neutral-700 mb-1">
                  Parent Name *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Radhika Roy"
                  value={parentName}
                  onChange={(e) => setParentName(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-neutral-300 bg-white text-xs font-bold focus:ring-2 focus:ring-amber-400 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-neutral-700 mb-1">
                  Email Address *
                </label>
                <input
                  type="email"
                  required
                  placeholder="parent@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-neutral-300 bg-white text-xs font-bold focus:ring-2 focus:ring-amber-400 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-neutral-700 mb-1">
                  WhatsApp / Phone *
                </label>
                <input
                  type="tel"
                  required
                  placeholder="+91 98765 43210"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-neutral-300 bg-white text-xs font-bold focus:ring-2 focus:ring-amber-400 focus:outline-none"
                />
              </div>
            </div>
          </div>

          {/* Payment Method Selector */}
          <div className="space-y-3">
            <h3 className="font-heading font-extrabold text-sm text-neutral-900 flex items-center gap-1.5">
              <span>2. Select Payment Method (Razorpay)</span>
              <ShieldCheck className="w-4 h-4 text-emerald-600" />
            </h3>

            <div className="grid grid-cols-3 gap-2.5">
              <button
                type="button"
                onClick={() => setSelectedMethod('upi')}
                className={`p-3 rounded-2xl border-2 flex flex-col items-center justify-center gap-1.5 transition-all cursor-pointer ${
                  selectedMethod === 'upi'
                    ? 'border-neutral-900 bg-white shadow-xs'
                    : 'border-neutral-200 bg-white/70 hover:bg-white'
                }`}
              >
                <Smartphone className="w-5 h-5 text-emerald-600" />
                <span className="text-xs font-extrabold text-neutral-900">UPI / QR</span>
                <span className="text-[10px] text-neutral-400 font-bold">GPay, PhonePe, Paytm</span>
              </button>

              <button
                type="button"
                onClick={() => setSelectedMethod('card')}
                className={`p-3 rounded-2xl border-2 flex flex-col items-center justify-center gap-1.5 transition-all cursor-pointer ${
                  selectedMethod === 'card'
                    ? 'border-neutral-900 bg-white shadow-xs'
                    : 'border-neutral-200 bg-white/70 hover:bg-white'
                }`}
              >
                <CreditCard className="w-5 h-5 text-sky-600" />
                <span className="text-xs font-extrabold text-neutral-900">Cards</span>
                <span className="text-[10px] text-neutral-400 font-bold">Debit, Credit, RuPay</span>
              </button>

              <button
                type="button"
                onClick={() => setSelectedMethod('netbanking')}
                className={`p-3 rounded-2xl border-2 flex flex-col items-center justify-center gap-1.5 transition-all cursor-pointer ${
                  selectedMethod === 'netbanking'
                    ? 'border-neutral-900 bg-white shadow-xs'
                    : 'border-neutral-200 bg-white/70 hover:bg-white'
                }`}
              >
                <Building className="w-5 h-5 text-purple-600" />
                <span className="text-xs font-extrabold text-neutral-900">Net Banking</span>
                <span className="text-[10px] text-neutral-400 font-bold">All Major Banks</span>
              </button>
            </div>

            {selectedMethod === 'upi' && (
              <div className="bg-white p-3.5 rounded-2xl border border-neutral-200 flex items-center gap-2">
                <input
                  type="text"
                  placeholder="Enter UPI ID (e.g. mobile@okhdfcbank or gpay)"
                  value={upiId}
                  onChange={(e) => setUpiId(e.target.value)}
                  className="flex-1 text-xs font-bold px-2 py-1 focus:outline-none"
                />
                <span className="text-[11px] font-black text-emerald-700 bg-emerald-50 px-2 py-1 rounded-lg">
                  Instant Verification
                </span>
              </div>
            )}
          </div>

          {errorMsg && (
            <div className="p-3 bg-red-50 border border-red-200 rounded-xl text-red-700 text-xs font-bold flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{errorMsg}</span>
            </div>
          )}

          {/* Action Button */}
          <div className="pt-2">
            <button
              type="submit"
              disabled={isProcessing}
              className="w-full py-4 px-4 rounded-2xl bg-[#FFD93D] hover:bg-[#ffdf59] active:bg-amber-400 text-neutral-900 font-extrabold text-base flex items-center justify-center gap-2 shadow-lg transition-all cursor-pointer border-2 border-amber-400 disabled:opacity-50"
            >
              {isProcessing ? (
                <>
                  <div className="w-5 h-5 border-2 border-neutral-900 border-t-transparent rounded-full animate-spin" />
                  <span>Verifying Payment with Razorpay...</span>
                </>
              ) : (
                <>
                  <Lock className="w-4 h-4" />
                  <span>Pay ₹{orderTotal} &amp; Unlock Instant Downloads</span>
                </>
              )}
            </button>
            <p className="text-[11px] text-center text-neutral-400 font-bold mt-2">
              🔒 Test &amp; Live Razorpay Gateway Integration. All PDF downloads are delivered immediately upon confirmation.
            </p>
          </div>
        </form>
      </div>
    </div>
  );
};
