import React, { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import { useCart } from '../context/CartContext';
import { useRouter } from '../context/RouterContext';
import { Product, Order } from '../types';
import { updatePageSEO } from '../utils/seo';
import { PreviewArtworkPicker } from '../utils/illustrations';
import { generateProductPDF } from '../utils/pdfGenerator';
import {
  ShieldCheck,
  Lock,
  CreditCard,
  Smartphone,
  Building,
  Sparkles,
  AlertCircle,
  CheckCircle2,
  ArrowLeft,
  Download,
  Printer,
  Clock,
  Heart,
  Tag,
  Star,
  RefreshCw,
} from 'lucide-react';
import confetti from 'canvas-confetti';

interface CheckoutPageProps {
  slug?: string;
}

export const CheckoutPage: React.FC<CheckoutPageProps> = ({ slug }) => {
  const { products, createOrder, markOrderPaid } = useApp();
  const { cart, subtotal, discount, total, appliedCoupon, applyCoupon, removeCoupon, clearCart } = useCart();
  const { navigate } = useRouter();

  // If slug is provided, we are purchasing that specific product; otherwise, purchase all cart items
  const directProduct: Product | undefined = slug
    ? products.find((p) => p.slug === slug || p.id === slug)
    : undefined;

  const itemsToBuy = directProduct
    ? [
        {
          productId: directProduct.id,
          title: directProduct.title,
          price: directProduct.discountedPrice,
          originalPrice: directProduct.originalPrice,
          pageCount: directProduct.pageCount,
          category: directProduct.category,
        },
      ]
    : cart.map((i) => ({
        productId: i.product.id,
        title: i.product.title,
        price: i.product.discountedPrice,
        originalPrice: i.product.originalPrice,
        pageCount: i.product.pageCount,
        category: i.product.category,
      }));

  // Form Fields
  const [parentName, setParentName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [childName, setChildName] = useState('');
  const [couponInput, setCouponInput] = useState('');
  const [couponError, setCouponError] = useState<string | null>(null);
  const [selectedMethod, setSelectedMethod] = useState<'upi' | 'card' | 'netbanking'>('upi');

  // Payment & Verification States
  const [isProcessing, setIsProcessing] = useState(false);
  const [isVerifying, setIsVerifying] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [verifiedOrder, setVerifiedOrder] = useState<Order | null>(null);
  const [verifiedDownloadToken, setVerifiedDownloadToken] = useState<string | null>(null);
  const [isDownloading, setIsDownloading] = useState(false);

  // Pricing calculations
  const rawSubtotal = directProduct ? directProduct.discountedPrice : subtotal;
  const rawDiscount = directProduct ? 0 : discount;
  const finalPayable = directProduct ? directProduct.discountedPrice : total;

  // SEO Update
  useEffect(() => {
    const title = directProduct
      ? `Checkout: ${directProduct.title} | Little Colour World`
      : 'Secure Checkout | Little Colour World';
    updatePageSEO({
      title,
      description: 'Instant and secure printable colouring book checkout powered by Razorpay. 256-bit encrypted.',
    });
  }, [directProduct]);

  // Load Razorpay script if not already present
  const loadRazorpayScript = (): Promise<boolean> => {
    return new Promise((resolve) => {
      if (typeof window !== 'undefined' && (window as any).Razorpay) {
        resolve(true);
        return;
      }
      const existing = document.querySelector('script[src*="checkout.razorpay.com"]');
      if (existing) {
        existing.addEventListener('load', () => resolve(true));
        existing.addEventListener('error', () => resolve(false));
        setTimeout(() => resolve(Boolean((window as any).Razorpay)), 1200);
        return;
      }
      const script = document.createElement('script');
      script.src = 'https://checkout.razorpay.com/v1/checkout.js';
      script.async = true;
      script.onload = () => resolve(true);
      script.onerror = () => resolve(false);
      document.body.appendChild(script);
    });
  };

  const handleApplyCoupon = (e: React.FormEvent) => {
    e.preventDefault();
    setCouponError(null);
    if (!couponInput.trim()) return;
    const res = applyCoupon(couponInput.trim());
    if (!res.success) {
      setCouponError(res.message);
    } else {
      setCouponInput('');
    }
  };

  // Complete Payment Verification strictly on server
  const verifyPaymentOnServer = async (
    localOrder: Order,
    razorpayOrderId: string,
    razorpayPaymentId: string,
    razorpaySignature?: string
  ) => {
    setIsVerifying(true);
    setErrorMessage(null);

    try {
      const verifyRes = await fetch('/api/orders/verify', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          orderId: localOrder.id,
          razorpayOrderId: razorpayOrderId || localOrder.razorpayOrderId,
          razorpayPaymentId,
          razorpaySignature,
        }),
      });

      const verifyData = await verifyRes.json();

      if (!verifyRes.ok || !verifyData.success || !verifyData.downloadToken) {
        throw new Error(verifyData.error || 'Server payment verification was not confirmed. Download remains locked.');
      }

      // Mark order as paid in client context
      const paidOrder = markOrderPaid(
        localOrder.id,
        razorpayPaymentId,
        verifyData.downloadToken,
        true
      );

      setVerifiedDownloadToken(verifyData.downloadToken);
      setVerifiedOrder(paidOrder || localOrder);
      setIsVerifying(false);
      setIsProcessing(false);

      if (!directProduct) {
        clearCart();
      }

      // Trigger celebration confetti
      try {
        confetti({
          particleCount: 120,
          spread: 80,
          origin: { y: 0.6 },
          colors: ['#FFD93D', '#FF8A65', '#6BCBFF', '#A0E7E5', '#FFAAA6'],
        });
      } catch (e) {
        // Confetti silent fallback
      }
    } catch (err: any) {
      setIsVerifying(false);
      setIsProcessing(false);
      setErrorMessage(
        err.message || 'Payment verification failed. PDFs are strictly unlocked only after successful payment confirmation.'
      );
    }
  };

  // Handle Pay via Razorpay
  const handleInitiatePayment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!parentName.trim() || !email.trim() || !phone.trim()) {
      setErrorMessage('Please provide your name, email, and phone number so we can deliver your printable files!');
      return;
    }

    setIsProcessing(true);
    setErrorMessage(null);

    // Meta Pixel Checkout Tracking
    try {
      if (typeof (window as any).fbq === 'function') {
        (window as any).fbq('track', 'InitiateCheckout', {
          value: finalPayable,
          currency: 'INR',
          num_items: itemsToBuy.length,
        });
      }
    } catch {
      // Pixel tracking safe catch
    }

    try {
      // Step 1: Create Order on backend
      let backendOrder: any = null;
      try {
        const orderRes = await fetch('/api/orders/create', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            customer: {
              parentName: parentName.trim(),
              email: email.trim().toLowerCase(),
              phone: phone.trim(),
            },
            items: itemsToBuy,
            couponCode: appliedCoupon?.code,
          }),
        });
        if (orderRes.ok) {
          const json = await orderRes.json();
          backendOrder = json.order;
        }
      } catch (beErr) {
        console.warn('Backend order creation warning', beErr);
      }

      // Step 2: Register local pending order
      const newOrder = createOrder({
        id: backendOrder?.id,
        orderNumber: backendOrder?.orderNumber,
        customer: {
          parentName: parentName.trim(),
          email: email.trim().toLowerCase(),
          phone: phone.trim(),
        },
        items: itemsToBuy.map((i) => ({
          productId: i.productId,
          title: i.title,
          price: i.price,
          originalPrice: i.originalPrice,
        })),
        subtotal: rawSubtotal,
        discount: rawDiscount,
        couponCode: appliedCoupon?.code,
        total: finalPayable,
        razorpayOrderId: backendOrder?.razorpayOrderId || `order_rzp_${Date.now()}`,
        status: 'pending',
      });

      // Step 3: Check Razorpay SDK availability
      const scriptReady = await loadRazorpayScript();
      if (!scriptReady || !(window as any).Razorpay) {
        throw new Error('Could not load Razorpay payment gateway. Please check your internet connection.');
      }

      // Step 4: Retrieve public Razorpay Key
      let rzpKey = backendOrder?.razorpayKeyId || '';
      if (!rzpKey) {
        try {
          const cfgRes = await fetch('/api/razorpay/config');
          const cfgData = await cfgRes.json();
          if (cfgData.keyId) rzpKey = cfgData.keyId;
        } catch {
          // Fallback to official Razorpay demo key for sandbox
        }
      }
      if (!rzpKey) {
        rzpKey = 'rzp_test_1DP5mmOlF5G5ag'; // Official public Razorpay demo test key
      }

      // Step 5: Open Official Razorpay Checkout Modal
      const options: any = {
        key: rzpKey,
        amount: Math.round(finalPayable * 100), // in paise
        currency: 'INR',
        name: 'Little Colour World',
        description: `Order #${newOrder.orderNumber} • ${itemsToBuy.length} Printable Book(s)`,
        image: 'https://cdn-icons-png.flaticon.com/512/3661/3661337.png',
        order_id:
          backendOrder?.razorpayOrderId?.startsWith('order_') &&
          !backendOrder.razorpayOrderId.startsWith('order_test_') &&
          !backendOrder.razorpayOrderId.startsWith('order_rzp_')
            ? backendOrder.razorpayOrderId
            : undefined,
        prefill: {
          name: parentName.trim(),
          email: email.trim().toLowerCase(),
          contact: phone.trim(),
        },
        notes: {
          orderId: newOrder.id,
          orderNumber: newOrder.orderNumber,
          customerEmail: email.trim().toLowerCase(),
          childName: childName.trim(),
        },
        theme: {
          color: '#F59E0B',
        },
        modal: {
          ondismiss: () => {
            setIsProcessing(false);
            setErrorMessage(
              '⚠️ Payment was cancelled or modal closed. Printable PDFs are strictly locked and will not be shared without verified payment confirmation.'
            );
          },
        },
        handler: async (response: {
          razorpay_payment_id: string;
          razorpay_order_id?: string;
          razorpay_signature?: string;
        }) => {
          if (!response.razorpay_payment_id) {
            setIsProcessing(false);
            setErrorMessage('No payment identifier received from Razorpay. Cannot verify transaction.');
            return;
          }

          // Meta Pixel Purchase Event
          try {
            if (typeof (window as any).fbq === 'function') {
              (window as any).fbq('track', 'Purchase', {
                value: finalPayable,
                currency: 'INR',
                num_items: itemsToBuy.length,
              });
            }
          } catch {
            // Pixel tracking catch
          }

          // Strict server payment verification
          await verifyPaymentOnServer(
            newOrder,
            response.razorpay_order_id || newOrder.razorpayOrderId,
            response.razorpay_payment_id,
            response.razorpay_signature
          );
        },
      };

      const rzpInstance = new (window as any).Razorpay(options);
      rzpInstance.on('payment.failed', (resp: any) => {
        setIsProcessing(false);
        setErrorMessage(
          `❌ Razorpay Payment Failed: ${
            resp.error?.description || 'Transaction declined'
          }. PDFs remain strictly locked until payment is completed.`
        );
      });
      rzpInstance.open();
    } catch (err: any) {
      setIsProcessing(false);
      setErrorMessage(err.message || 'Failed to initialize payment gateway.');
    }
  };

  // Secure Download Handler (Authorized exclusively with verified download token)
  const handleDownloadPurchasedBook = async (productId: string) => {
    if (!verifiedDownloadToken) {
      setErrorMessage('Access Denied: Payment has not been verified. Cannot download file.');
      return;
    }

    setIsDownloading(true);
    try {
      // Authorize with server
      const authRes = await fetch('/api/downloads/authorize', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          downloadToken: verifiedDownloadToken,
          productId,
        }),
      });

      const authData = await authRes.json();
      if (!authRes.ok || !authData.authorized) {
        throw new Error(authData.error || 'Server denied download authorization.');
      }

      // Generate the complete high-resolution printable PDF
      const targetProd = products.find((p) => p.id === productId);
      if (targetProd) {
        generateProductPDF(targetProd, childName.trim() || 'Super Star Little Artist');
      }
    } catch (err: any) {
      setErrorMessage(err.message || 'Could not download PDF. Please try again.');
    } finally {
      setIsDownloading(false);
    }
  };

  // SUCCESS / VERIFIED STATE (UNLOCKED DOWNLOAD ONLY AFTER PAYMENT VERIFICATION)
  if (verifiedOrder && verifiedDownloadToken) {
    return (
      <div className="max-w-4xl mx-auto px-4 sm:px-6 py-8 sm:py-14 animate-in fade-in duration-300">
        <div className="bg-white rounded-3xl p-6 sm:p-10 border-4 border-emerald-400 shadow-xl space-y-8">
          {/* Success Banner */}
          <div className="text-center space-y-3">
            <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto shadow-inner animate-bounce">
              <CheckCircle2 className="w-10 h-10" />
            </div>
            <span className="px-3 py-1 rounded-full text-xs font-black bg-emerald-100 text-emerald-800 uppercase tracking-widest">
              Verified Razorpay Payment
            </span>
            <h1 className="font-heading font-extrabold text-2xl sm:text-3xl text-neutral-900">
              Payment Successful! Your Printable PDFs Are Unlocked 🎉
            </h1>
            <p className="text-xs sm:text-sm text-neutral-600 font-bold max-w-xl mx-auto">
              Thank you, <span className="text-neutral-900">{verifiedOrder.customer.parentName}</span>! Your transaction has been verified by the Razorpay Gateway. Download your high-resolution A4 colouring books below.
            </p>
          </div>

          {/* Transaction Audit Details */}
          <div className="bg-[#FFFDF5] p-5 rounded-2xl border border-amber-200 grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
            <div>
              <span className="text-neutral-400 font-bold block text-[11px]">Order Reference:</span>
              <span className="font-extrabold text-neutral-900 font-mono text-sm">
                #{verifiedOrder.orderNumber}
              </span>
            </div>
            <div>
              <span className="text-neutral-400 font-bold block text-[11px]">Razorpay Payment ID:</span>
              <span className="font-mono text-emerald-700 font-extrabold text-xs break-all">
                {verifiedOrder.razorpayPaymentId}
              </span>
            </div>
            <div>
              <span className="text-neutral-400 font-bold block text-[11px]">Files Delivered To:</span>
              <span className="font-extrabold text-neutral-900 truncate block">
                {verifiedOrder.customer.email}
              </span>
            </div>
          </div>

          {/* Unlocked Printable Workbooks List */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="font-heading font-extrabold text-lg text-neutral-900 flex items-center gap-2">
                <Download className="w-5 h-5 text-emerald-600" />
                <span>Unlocked Downloads ({verifiedOrder.items.length})</span>
              </h2>
              <span className="text-xs font-bold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-200">
                Lifetime Access
              </span>
            </div>

            <div className="space-y-3">
              {verifiedOrder.items.map((item) => {
                const fullProd = products.find((p) => p.id === item.productId);
                return (
                  <div
                    key={item.productId}
                    className="p-5 rounded-2xl bg-amber-50/60 border-2 border-amber-300 flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow-xs"
                  >
                    <div className="flex items-center gap-3.5">
                      <div className="w-14 h-14 rounded-xl bg-white border border-amber-200 flex items-center justify-center shrink-0">
                        {fullProd?.samplePages?.[0] ? (
                          <PreviewArtworkPicker
                            type={fullProd.samplePages[0].previewSvgType}
                            className="w-10 h-10"
                          />
                        ) : (
                          <Sparkles className="w-6 h-6 text-amber-600" />
                        )}
                      </div>
                      <div>
                        <h3 className="font-heading font-extrabold text-base text-neutral-900">
                          {item.title}
                        </h3>
                        <p className="text-xs font-bold text-neutral-500">
                          Printable A4 PDF • {fullProd?.pageCount || 30} Pages • Certificate Included
                        </p>
                      </div>
                    </div>

                    <button
                      type="button"
                      disabled={isDownloading}
                      onClick={() => handleDownloadPurchasedBook(item.productId)}
                      className="px-6 py-3.5 rounded-2xl bg-emerald-500 hover:bg-emerald-600 active:scale-95 text-white font-heading font-extrabold text-sm flex items-center justify-center gap-2 shadow-md shadow-emerald-500/20 cursor-pointer transition-all disabled:opacity-50 shrink-0"
                    >
                      {isDownloading ? (
                        <RefreshCw className="w-4 h-4 animate-spin" />
                      ) : (
                        <Download className="w-4 h-4" />
                      )}
                      <span>Download PDF</span>
                    </button>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Action Row */}
          <div className="pt-4 border-t border-neutral-100 flex flex-col sm:flex-row items-center justify-between gap-3">
            <button
              onClick={() => navigate('/my-downloads')}
              className="text-xs font-extrabold text-sky-700 hover:text-sky-800 underline cursor-pointer"
            >
              Recover or Re-download anytime via My Downloads
            </button>
            <button
              onClick={() => navigate('/books')}
              className="px-6 py-2.5 rounded-xl bg-neutral-900 hover:bg-neutral-800 text-white font-extrabold text-xs cursor-pointer shadow-xs"
            >
              Explore More Books
            </button>
          </div>
        </div>
      </div>
    );
  }

  // EMPTY CART CHECK (if not purchasing a direct product)
  if (!directProduct && itemsToBuy.length === 0) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-20 text-center space-y-4">
        <div className="w-16 h-16 rounded-3xl bg-amber-100 text-amber-700 flex items-center justify-center mx-auto">
          <Lock className="w-8 h-8" />
        </div>
        <h1 className="font-heading font-extrabold text-2xl text-neutral-900">
          Your Backpack is Empty
        </h1>
        <p className="text-xs font-bold text-neutral-500 max-w-md mx-auto">
          Pick any colouring book or worksheet pack to proceed with secure Razorpay checkout.
        </p>
        <button
          onClick={() => navigate('/books')}
          className="px-6 py-3 rounded-2xl bg-[#FFD93D] hover:bg-[#ffdf59] text-neutral-900 font-extrabold text-xs inline-flex items-center gap-2 cursor-pointer shadow-xs"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Browse All Printable Books</span>
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-6 sm:py-10 space-y-6 animate-in fade-in duration-200">
      {/* Top Header Navigation */}
      <div className="flex items-center justify-between pb-4 border-b border-amber-200">
        <button
          onClick={() => (directProduct ? navigate(`/book/${directProduct.slug}`) : navigate('/books'))}
          className="inline-flex items-center gap-2 text-xs font-bold text-neutral-600 hover:text-neutral-900 cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>{directProduct ? `Back to ${directProduct.title}` : 'Back to Books'}</span>
        </button>

        <div className="flex items-center gap-2 text-xs font-extrabold text-emerald-700 bg-emerald-50 px-3 py-1.5 rounded-full border border-emerald-200">
          <ShieldCheck className="w-4 h-4 text-emerald-600" />
          <span>Razorpay Verified Payment Gateway</span>
        </div>
      </div>

      {/* Main Grid: Form Left, Product Summary Right */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Column: Checkout Details Form (7 cols) */}
        <div className="lg:col-span-7 space-y-6">
          <div className="bg-white rounded-3xl p-6 sm:p-8 border-2 border-amber-200 shadow-sm space-y-6">
            <div>
              <h1 className="font-heading font-extrabold text-2xl text-neutral-900">
                Secure Checkout
              </h1>
              <p className="text-xs font-bold text-neutral-500 mt-1">
                Fill in parent contact information to receive your verified PDF download link.
              </p>
            </div>

            {/* Error Message Box */}
            {errorMessage && (
              <div className="p-4 rounded-2xl bg-red-50 border border-red-200 text-xs font-bold text-red-700 flex items-start gap-2.5">
                <AlertCircle className="w-4 h-4 text-red-600 shrink-0 mt-0.5" />
                <div className="flex-1">
                  <span>{errorMessage}</span>
                </div>
              </div>
            )}

            {/* Verification Loading Box */}
            {isVerifying && (
              <div className="p-5 rounded-2xl bg-amber-50 border-2 border-amber-300 text-center space-y-2">
                <div className="w-8 h-8 border-3 border-amber-600 border-t-transparent rounded-full animate-spin mx-auto" />
                <h3 className="font-heading font-extrabold text-sm text-neutral-900">
                  Verifying Payment with Razorpay Gateway...
                </h3>
                <p className="text-xs font-bold text-neutral-500">
                  Please hold on while the server confirms transaction authorization and unlocks your printable PDF.
                </p>
              </div>
            )}

            <form onSubmit={handleInitiatePayment} className="space-y-6">
              {/* Step 1: Customer Info */}
              <div className="space-y-3">
                <h2 className="font-heading font-extrabold text-sm text-neutral-900 flex items-center gap-1.5">
                  <span className="w-5 h-5 rounded-full bg-amber-200 text-amber-900 text-xs font-black flex items-center justify-center">
                    1
                  </span>
                  <span>Parent / Customer Details</span>
                </h2>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-bold text-neutral-700 mb-1">
                      Parent's Full Name *
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Radhika Roy"
                      value={parentName}
                      onChange={(e) => setParentName(e.target.value)}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-neutral-300 bg-[#FFFDF5] text-xs font-bold focus:ring-2 focus:ring-amber-400 focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-neutral-700 mb-1">
                      WhatsApp / Phone Number *
                    </label>
                    <input
                      type="tel"
                      required
                      placeholder="+91 98765 43210"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-neutral-300 bg-[#FFFDF5] text-xs font-bold focus:ring-2 focus:ring-amber-400 focus:outline-none"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-neutral-700 mb-1">
                    Email Address (For Verified PDF Access) *
                  </label>
                  <input
                    type="email"
                    required
                    placeholder="parent@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-neutral-300 bg-[#FFFDF5] text-xs font-bold focus:ring-2 focus:ring-amber-400 focus:outline-none"
                  />
                  <span className="text-[11px] font-bold text-neutral-400 mt-1 block">
                    Your download access token and payment receipt will be associated with this email.
                  </span>
                </div>
              </div>

              {/* Step 2: Child's Name (Personalized Certificate) */}
              <div className="space-y-3 pt-2 border-t border-neutral-100">
                <h2 className="font-heading font-extrabold text-sm text-neutral-900 flex items-center justify-between">
                  <div className="flex items-center gap-1.5">
                    <span className="w-5 h-5 rounded-full bg-amber-200 text-amber-900 text-xs font-black flex items-center justify-center">
                      2
                    </span>
                    <span>Little Artist's Name (Optional)</span>
                  </div>
                  <span className="text-[11px] font-bold text-amber-700 bg-amber-50 px-2 py-0.5 rounded-full">
                    Award Certificate
                  </span>
                </h2>
                <input
                  type="text"
                  placeholder="e.g. Aarav, Ananya, Kabir"
                  value={childName}
                  onChange={(e) => setChildName(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-neutral-300 bg-[#FFFDF5] text-xs font-bold focus:ring-2 focus:ring-amber-400 focus:outline-none"
                />
                <span className="text-[11px] font-bold text-neutral-400 block">
                  Their name will be printed onto the official Star Artist Completion Award inside the PDF!
                </span>
              </div>

              {/* Step 3: Payment Channel */}
              <div className="space-y-3 pt-2 border-t border-neutral-100">
                <h2 className="font-heading font-extrabold text-sm text-neutral-900 flex items-center gap-1.5">
                  <span className="w-5 h-5 rounded-full bg-amber-200 text-amber-900 text-xs font-black flex items-center justify-center">
                    3
                  </span>
                  <span>Payment Channel (Official Razorpay Gateway)</span>
                </h2>

                <div className="grid grid-cols-3 gap-2.5">
                  <button
                    type="button"
                    onClick={() => setSelectedMethod('upi')}
                    className={`p-3 rounded-2xl border-2 flex flex-col items-center justify-center gap-1 transition-all cursor-pointer ${
                      selectedMethod === 'upi'
                        ? 'border-neutral-900 bg-amber-50/50 shadow-xs ring-1 ring-amber-300'
                        : 'border-neutral-200 bg-white hover:border-neutral-300'
                    }`}
                  >
                    <Smartphone className="w-5 h-5 text-emerald-600" />
                    <span className="text-xs font-extrabold text-neutral-900">UPI / QR</span>
                    <span className="text-[10px] text-neutral-400 font-bold">GPay, PhonePe, Paytm</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setSelectedMethod('card')}
                    className={`p-3 rounded-2xl border-2 flex flex-col items-center justify-center gap-1 transition-all cursor-pointer ${
                      selectedMethod === 'card'
                        ? 'border-neutral-900 bg-amber-50/50 shadow-xs ring-1 ring-amber-300'
                        : 'border-neutral-200 bg-white hover:border-neutral-300'
                    }`}
                  >
                    <CreditCard className="w-5 h-5 text-sky-600" />
                    <span className="text-xs font-extrabold text-neutral-900">Cards</span>
                    <span className="text-[10px] text-neutral-400 font-bold">Debit, Credit, RuPay</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setSelectedMethod('netbanking')}
                    className={`p-3 rounded-2xl border-2 flex flex-col items-center justify-center gap-1 transition-all cursor-pointer ${
                      selectedMethod === 'netbanking'
                        ? 'border-neutral-900 bg-amber-50/50 shadow-xs ring-1 ring-amber-300'
                        : 'border-neutral-200 bg-white hover:border-neutral-300'
                    }`}
                  >
                    <Building className="w-5 h-5 text-purple-600" />
                    <span className="text-xs font-extrabold text-neutral-900">NetBanking</span>
                    <span className="text-[10px] text-neutral-400 font-bold">All Major Banks</span>
                  </button>
                </div>

                <div className="p-3 bg-emerald-50/70 rounded-2xl border border-emerald-200/70 flex items-center justify-between text-xs">
                  <div className="flex items-center gap-2">
                    <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
                    <span className="font-extrabold text-neutral-900">
                      Razorpay Gateway: UPI, Debit/Credit Cards &amp; NetBanking
                    </span>
                  </div>
                  <span className="text-[10px] font-black text-emerald-800 bg-emerald-100/80 px-2 py-0.5 rounded-full">
                    256-Bit SSL
                  </span>
                </div>
              </div>

              {/* Payment Action Button */}
              <div className="pt-2">
                <button
                  type="submit"
                  disabled={isProcessing || isVerifying}
                  className="w-full py-4 rounded-2xl bg-gradient-to-r from-[#FFD93D] to-[#ffc93d] hover:brightness-105 active:scale-[0.99] text-neutral-900 font-heading font-extrabold text-base flex items-center justify-center gap-2.5 shadow-lg shadow-amber-300/40 cursor-pointer transition-all disabled:opacity-50"
                >
                  {isProcessing || isVerifying ? (
                    <RefreshCw className="w-5 h-5 animate-spin" />
                  ) : (
                    <Lock className="w-5 h-5 fill-neutral-900" />
                  )}
                  <span>Pay ₹{finalPayable} via Razorpay &amp; Unlock Download</span>
                </button>
                <div className="text-center text-[11px] font-bold text-neutral-400 mt-2">
                  🔒 Strictly protected: PDF downloads are unlocked only after successful payment verification.
                </div>
              </div>
            </form>
          </div>
        </div>

        {/* Right Column: Order Summary & Product Cards (5 cols) */}
        <div className="lg:col-span-5 space-y-6">
          <div className="bg-white rounded-3xl p-6 sm:p-7 border-2 border-amber-200 shadow-sm space-y-5">
            <h2 className="font-heading font-extrabold text-base text-neutral-900 flex items-center justify-between pb-3 border-b border-neutral-100">
              <span>Order Summary</span>
              <span className="text-xs font-bold text-neutral-400">
                {itemsToBuy.length} {itemsToBuy.length === 1 ? 'Book' : 'Books'}
              </span>
            </h2>

            {/* Product Items List */}
            <div className="space-y-3">
              {itemsToBuy.map((item) => {
                const fullProd = products.find((p) => p.id === item.productId);
                return (
                  <div
                    key={item.productId}
                    className="flex items-center gap-3 p-3 rounded-2xl bg-[#FFFDF5] border border-amber-200/70"
                  >
                    <div className="w-12 h-12 rounded-xl bg-white border border-amber-200 flex items-center justify-center shrink-0">
                      {fullProd?.samplePages?.[0] ? (
                        <PreviewArtworkPicker
                          type={fullProd.samplePages[0].previewSvgType}
                          className="w-8 h-8"
                        />
                      ) : (
                        <Sparkles className="w-5 h-5 text-amber-500" />
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="text-xs font-extrabold text-neutral-900 truncate">
                        {item.title}
                      </h3>
                      <p className="text-[11px] font-bold text-neutral-500">
                        {fullProd?.pageCount || 30} Printable Pages • {fullProd?.category || 'Kids Book'}
                      </p>
                    </div>
                    <div className="text-right">
                      <div className="text-xs font-extrabold text-neutral-900">₹{item.price}</div>
                      <div className="text-[10px] font-bold text-neutral-400 line-through">
                        ₹{item.originalPrice}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Coupon Code Input */}
            <form onSubmit={handleApplyCoupon} className="pt-2 border-t border-neutral-100 space-y-1.5">
              <label className="block text-xs font-bold text-neutral-700">
                Have a Discount Coupon?
              </label>
              <div className="flex gap-2">
                <input
                  type="text"
                  placeholder="e.g. LITTLE10"
                  value={couponInput}
                  onChange={(e) => setCouponInput(e.target.value.toUpperCase())}
                  className="flex-1 px-3 py-2 rounded-xl border border-neutral-300 bg-[#FFFDF5] text-xs font-extrabold uppercase focus:outline-none focus:ring-2 focus:ring-amber-400"
                />
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl bg-neutral-900 hover:bg-neutral-800 text-white font-extrabold text-xs cursor-pointer"
                >
                  Apply
                </button>
              </div>
              {appliedCoupon && (
                <div className="text-xs font-bold text-emerald-700 flex items-center justify-between pt-1">
                  <span>Coupon {appliedCoupon.code} applied ({appliedCoupon.discountPercentage}% OFF)!</span>
                  <button
                    type="button"
                    onClick={removeCoupon}
                    className="text-[11px] font-extrabold text-red-600 hover:underline cursor-pointer"
                  >
                    Remove
                  </button>
                </div>
              )}
              {couponError && <p className="text-xs font-bold text-red-600">{couponError}</p>}
            </form>

            {/* Price Calculations */}
            <div className="space-y-2 pt-3 border-t border-neutral-100 text-xs">
              <div className="flex justify-between text-neutral-600 font-bold">
                <span>Subtotal</span>
                <span>₹{rawSubtotal}</span>
              </div>
              {rawDiscount > 0 && (
                <div className="flex justify-between text-emerald-700 font-bold">
                  <span>Coupon Discount</span>
                  <span>-₹{rawDiscount}</span>
                </div>
              )}
              <div className="flex justify-between text-base font-extrabold text-neutral-900 pt-2 border-t border-neutral-200">
                <span>Total Amount</span>
                <span className="font-heading text-xl text-neutral-900">₹{finalPayable}</span>
              </div>
            </div>

            {/* Trust Badges */}
            <div className="p-4 rounded-2xl bg-amber-50/70 border border-amber-200/80 space-y-2.5 text-xs">
              <div className="flex items-center gap-2">
                <Printer className="w-4 h-4 text-amber-700 shrink-0" />
                <span className="font-bold text-neutral-700">Standard A4 Printable PDF</span>
              </div>
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4 text-sky-700 shrink-0" />
                <span className="font-bold text-neutral-700">Instant Download After Payment</span>
              </div>
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-emerald-700 shrink-0" />
                <span className="font-bold text-neutral-700">100% Secure Razorpay Verification</span>
              </div>
              <div className="flex items-center gap-2">
                <Heart className="w-4 h-4 text-rose-600 shrink-0" />
                <span className="font-bold text-neutral-700">Screen-Free Creative Activity</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
