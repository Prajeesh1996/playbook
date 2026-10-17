import React, { useState, useEffect } from 'react';
import { Product, Order } from '../types';
import { useCart } from '../context/CartContext';
import { useApp } from '../context/AppContext';
import { X, ShieldCheck, Lock, CreditCard, Smartphone, Building, Sparkles, AlertCircle, CheckCircle2, Key, HelpCircle, RefreshCw } from 'lucide-react';
import confetti from 'canvas-confetti';

interface CheckoutModalProps {
  directProduct?: Product | null;
  onClose: () => void;
  onSuccess: (order: Order) => void;
}

export interface VerificationProgress {
  order: Order;
  paymentId: string;
  stage: 'initiating' | 'polling_webhook' | 'verifying_signature' | 'granted' | 'failed';
  message: string;
  attempt?: number;
  maxAttempts?: number;
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
  const [isVerifying, setIsVerifying] = useState(false);
  const [verificationProgress, setVerificationProgress] = useState<VerificationProgress | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  // Razorpay Gateway Config
  const [razorpayKey, setRazorpayKey] = useState<string>(() => {
    return (
      (import.meta.env.VITE_RAZORPAY_KEY_ID as string) ||
      localStorage.getItem('lcw_razorpay_key_id') ||
      ''
    );
  });
  const [showKeyConfig, setShowKeyConfig] = useState(false);
  const [keyInput, setKeyInput] = useState(razorpayKey);
  const [keySaveSuccess, setKeySaveSuccess] = useState(false);
  const [showSimulatorModal, setShowSimulatorModal] = useState<null | {
    order: Order;
    backendOrder?: any;
  }>(null);

  // Check backend server Razorpay configuration
  useEffect(() => {
    fetch('/api/razorpay/config')
      .then((res) => res.json())
      .then((data) => {
        if (data.keyId && !razorpayKey) {
          setRazorpayKey(data.keyId);
          setKeyInput(data.keyId);
        }
      })
      .catch(() => {});
  }, [razorpayKey]);

  const handleSaveKey = (e: React.FormEvent) => {
    e.preventDefault();
    const cleanKey = keyInput.trim();
    setRazorpayKey(cleanKey);
    if (cleanKey) {
      localStorage.setItem('lcw_razorpay_key_id', cleanKey);
    } else {
      localStorage.removeItem('lcw_razorpay_key_id');
    }
    setKeySaveSuccess(true);
    setTimeout(() => setKeySaveSuccess(false), 2500);
  };

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

  // Process verified payment strictly through server webhook confirmation
  const completePaymentVerification = async (
    localOrder: Order,
    razorpayOrderId: string,
    razorpayPaymentId: string,
    razorpaySignature?: string,
    knownServerToken?: string
  ) => {
    setIsVerifying(true);
    setErrorMsg(null);
    setShowSimulatorModal(null);

    setVerificationProgress({
      order: localOrder,
      paymentId: razorpayPaymentId,
      stage: 'initiating',
      message: 'Submitting payment confirmation to server verification gateway...',
    });

    try {
      // STRICT VALIDATION: Require valid Razorpay payment ID (must start with 'pay_')
      if (!razorpayPaymentId || (!razorpayPaymentId.startsWith('pay_') && !razorpayPaymentId.startsWith('pay_sim_'))) {
        throw new Error('Payment confirmation failed. No authentic payment ID received from Razorpay.');
      }

      let serverVerified = false;
      let verifiedDownloadToken = knownServerToken || '';
      let serverOrderNumber = localOrder.orderNumber;

      // 1. Mandatory server-side verification request
      setVerificationProgress((prev) =>
        prev
          ? {
              ...prev,
              stage: 'verifying_signature',
              message: 'Validating cryptographic payment signature and order state on server...',
            }
          : null
      );

      const verifyRes = await fetch('/api/orders/verify', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          orderId: localOrder.id,
          razorpayOrderId,
          razorpayPaymentId,
          razorpaySignature,
        }),
      });

      if (verifyRes.ok) {
        const verifyData = await verifyRes.json();
        if (verifyData.success && verifyData.webhookVerified && verifyData.downloadToken) {
          serverVerified = true;
          verifiedDownloadToken = verifyData.downloadToken;
          serverOrderNumber = verifyData.orderNumber || serverOrderNumber;
        } else if (verifyData.error) {
          throw new Error(verifyData.error);
        }
      } else if (verifyRes.status === 202) {
        // Server is waiting for authoritative server-side Razorpay webhook delivery
        console.log('Awaiting server-side Razorpay webhook confirmation...');
      } else {
        const errJson = await verifyRes.json().catch(() => null);
        throw new Error(errJson?.error || 'Server rejected payment verification.');
      }

      // If webhook has delivery latency, poll server status endpoint
      if (!serverVerified) {
        setVerificationProgress((prev) =>
          prev
            ? {
                ...prev,
                stage: 'polling_webhook',
                message: 'Awaiting server-side Razorpay webhook confirmation (payment.captured)...',
                attempt: 1,
                maxAttempts: 8,
              }
            : null
        );

        for (let attempt = 0; attempt < 8; attempt++) {
          await new Promise((res) => setTimeout(res, 1200));
          setVerificationProgress((prev) =>
            prev
              ? {
                  ...prev,
                  attempt: attempt + 1,
                  message: `Awaiting Razorpay server webhook (payment.captured) confirmation (Attempt ${attempt + 1}/8)...`,
                }
              : null
          );
          const statusRes = await fetch(`/api/orders/status/${localOrder.id}`);
          if (statusRes.ok) {
            const statusData = await statusRes.json();
            if (statusData.isPaid && statusData.webhookVerified && statusData.downloadToken) {
              serverVerified = true;
              verifiedDownloadToken = statusData.downloadToken;
              serverOrderNumber = statusData.orderNumber || serverOrderNumber;
              break;
            }
          }
        }
      }

      // STRICT PROTECTION: If server did not verify via webhook, PREVENT CLIENT-SIDE BYPASS!
      if (!serverVerified || !verifiedDownloadToken) {
        throw new Error(
          'Access Denied: Payment has not been verified by Razorpay webhook on the server. Client-side bypass prevented. PDF download access blocked.'
        );
      }

      // Show verified success state on the verification screen
      setVerificationProgress((prev) =>
        prev
          ? {
              ...prev,
              stage: 'granted',
              message: 'Payment verified by server webhook! Secure download token granted. Unlocking your printable books...',
            }
          : null
      );
      await new Promise((res) => setTimeout(res, 900));

      // 2. Mark order as verified and paid locally ONLY with verified server download token
      const confirmedOrder = markOrderPaid(localOrder.id, razorpayPaymentId, verifiedDownloadToken, true);

      if (!confirmedOrder) {
        throw new Error('Verification failure: Could not record confirmed order state with server download token.');
      }

      // Trigger celebration confetti
      try {
        confetti({
          particleCount: 120,
          spread: 80,
          origin: { y: 0.6 },
          colors: ['#FFD93D', '#FF8A65', '#6BCBFF', '#FFB6C1', '#B8F2C8'],
        });
      } catch (err) {
        console.warn('Confetti error', err);
      }

      if (!directProduct) {
        clearCart();
      }

      setIsProcessing(false);
      setIsVerifying(false);
      setShowSimulatorModal(null);

      // 3. ONLY now share the PDF by calling onSuccess with the confirmed order
      onSuccess(confirmedOrder);
    } catch (err: any) {
      console.error('Payment confirmation error:', err);
      setIsProcessing(false);
      setIsVerifying(false);
      setVerificationProgress((prev) =>
        prev
          ? {
              ...prev,
              stage: 'failed',
              message: err.message || 'Payment confirmation failed. PDFs cannot be shared without verified Razorpay webhook confirmation.',
            }
          : {
              order: localOrder,
              paymentId: razorpayPaymentId,
              stage: 'failed',
              message: err.message || 'Payment confirmation failed. PDFs cannot be shared without verified Razorpay webhook confirmation.',
            }
      );
      setErrorMsg(
        err.message || 'Payment confirmation failed. PDFs cannot be shared without verified Razorpay webhook confirmation.'
      );
    }
  };

  const handleSubmitPayment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!parentName.trim() || !email.trim() || !phone.trim()) {
      setErrorMsg('Please complete all contact details so we can deliver your printable PDFs!');
      return;
    }

    setIsProcessing(true);
    setErrorMsg(null);

    try {
      // Step 1: Create a pending order on the server
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
          const orderJson = await orderRes.json();
          backendOrder = orderJson.order;
        }
      } catch (backendErr) {
        console.warn('Could not reach backend order creator, using local pending record', backendErr);
      }

      // Step 2: Register local pending order synchronized with backend
      const newOrder = createOrder({
        id: backendOrder?.id,
        orderNumber: backendOrder?.orderNumber,
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
        razorpayOrderId: backendOrder?.razorpayOrderId || `order_rzp_${Date.now()}`,
        status: 'pending',
      });

      // Step 3: Check if official Razorpay checkout script is available
      const scriptLoaded = await loadRazorpayScript();
      const effectiveKey =
        razorpayKey.trim() ||
        (backendOrder?.razorpayKeyId && !backendOrder.razorpayKeyId.includes('demo')
          ? backendOrder.razorpayKeyId
          : '');

      // If we have an active Razorpay key and the official script loaded
      if (scriptLoaded && effectiveKey && (window as any).Razorpay) {
        const options: any = {
          key: effectiveKey,
          amount: Math.round(orderTotal * 100), // in paise
          currency: 'INR',
          name: 'Little Colour World',
          description: `Order #${newOrder.orderNumber} – ${itemsToBuy.length} Printable PDF Workbook(s)`,
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
          },
          theme: {
            color: '#F59E0B',
          },
          modal: {
            ondismiss: () => {
              setIsProcessing(false);
              setErrorMsg(
                '⚠️ Payment was cancelled or window closed. Printable PDFs are strictly locked and will NOT be shared without payment confirmation.'
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
              setErrorMsg('No Razorpay payment ID received. Cannot verify payment.');
              return;
            }
            // ONLY after successful Razorpay response:
            await completePaymentVerification(
              newOrder,
              response.razorpay_order_id || newOrder.razorpayOrderId,
              response.razorpay_payment_id,
              response.razorpay_signature
            );
          },
        };

        const rzp = new (window as any).Razorpay(options);
        rzp.on('payment.failed', (resp: any) => {
          setIsProcessing(false);
          setErrorMsg(
            `❌ Razorpay Payment Failed: ${
              resp.error?.description || 'Transaction declined'
            }. Your PDFs remain locked until payment is completed.`
          );
        });
        rzp.open();
      } else {
        // If Razorpay Key is not set yet or running in sandbox simulation
        // Present explicit payment simulator modal so user must explicitly confirm or cancel
        setShowSimulatorModal({
          order: newOrder,
          backendOrder,
        });
      }
    } catch (err: any) {
      console.error(err);
      setIsProcessing(false);
      setErrorMsg('Failed to initialize Razorpay checkout. Please try again.');
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-neutral-900/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-6 animate-in fade-in duration-200">
      <div className="bg-[#FFFDF5] w-full max-w-2xl rounded-3xl shadow-2xl border-4 border-amber-300 overflow-hidden relative">
        {/* Header */}
        <div className="p-5 sm:p-6 bg-white border-b border-amber-200 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="p-2.5 rounded-2xl bg-amber-100 text-neutral-800">
              {verificationProgress ? (
                <ShieldCheck className="w-5 h-5 text-amber-700" />
              ) : (
                <Lock className="w-5 h-5 text-amber-700" />
              )}
            </div>
            <div>
              <h2 className="font-heading font-extrabold text-xl text-neutral-900">
                {verificationProgress ? 'Server Order Verification' : 'Razorpay Secure Checkout'}
              </h2>
              <p className="text-xs text-neutral-500 font-bold">
                {verificationProgress
                  ? 'Step 3 of 3 • Webhook Confirmation & Secure PDF Unlock'
                  : '256-Bit SSL Encrypted • PDFs Unlocked Only After Payment Confirmation'}
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-full hover:bg-neutral-100 text-neutral-400 hover:text-neutral-800 cursor-pointer"
            aria-label="Close checkout"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        {verificationProgress ? (
          <div className="p-6 sm:p-8 space-y-6">
            <div className="text-center space-y-2">
              <div className="inline-flex p-4 rounded-3xl bg-amber-100 text-amber-800 shadow-xs mb-1">
                {verificationProgress.stage === 'granted' ? (
                  <CheckCircle2 className="w-10 h-10 text-emerald-600 animate-bounce" />
                ) : verificationProgress.stage === 'failed' ? (
                  <AlertCircle className="w-10 h-10 text-red-600" />
                ) : (
                  <ShieldCheck className="w-10 h-10 text-amber-700 animate-pulse" />
                )}
              </div>
              <h3 className="font-heading font-extrabold text-xl text-neutral-900">
                {verificationProgress.stage === 'granted'
                  ? 'Payment Confirmed by Server Webhook! 🎉'
                  : verificationProgress.stage === 'failed'
                  ? 'Verification Incomplete'
                  : 'Server Order Verification in Progress'}
              </h3>
              <p className="text-xs font-bold text-neutral-600 max-w-md mx-auto">
                {verificationProgress.message}
              </p>
            </div>

            {/* Verification Progress Stepper */}
            <div className="bg-white rounded-2xl p-5 border-2 border-neutral-200 shadow-2xs space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-neutral-100 text-xs">
                <div>
                  <span className="text-neutral-400 block text-[10px] font-bold">Order Reference</span>
                  <span className="font-extrabold text-neutral-900">#{verificationProgress.order.orderNumber}</span>
                </div>
                <div className="text-right">
                  <span className="text-neutral-400 block text-[10px] font-bold">Payment Transaction</span>
                  <span className="font-mono text-emerald-700 font-extrabold text-[11px]">
                    {verificationProgress.paymentId}
                  </span>
                </div>
              </div>

              <div className="space-y-3">
                {/* Step 1: Gateway Transaction */}
                <div className="flex items-center gap-3">
                  <div className="w-6 h-6 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center shrink-0">
                    <CheckCircle2 className="w-4 h-4" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-extrabold text-neutral-900">1. Razorpay Payment Captured</p>
                    <p className="text-[11px] text-neutral-400 font-bold truncate">Gateway transaction ID validated</p>
                  </div>
                </div>

                {/* Step 2: Webhook Confirmation */}
                <div className="flex items-center gap-3">
                  <div
                    className={`w-6 h-6 rounded-full flex items-center justify-center shrink-0 ${
                      verificationProgress.stage === 'granted'
                        ? 'bg-emerald-100 text-emerald-700'
                        : verificationProgress.stage === 'failed'
                        ? 'bg-red-100 text-red-700'
                        : 'bg-amber-100 text-amber-700'
                    }`}
                  >
                    {verificationProgress.stage === 'granted' ? (
                      <CheckCircle2 className="w-4 h-4" />
                    ) : verificationProgress.stage === 'failed' ? (
                      <AlertCircle className="w-4 h-4" />
                    ) : (
                      <div className="w-3.5 h-3.5 border-2 border-amber-700 border-t-transparent rounded-full animate-spin" />
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-extrabold text-neutral-900">2. Authoritative Server Webhook Audit</p>
                    <p className="text-[11px] text-neutral-400 font-bold">
                      {verificationProgress.stage === 'granted'
                        ? 'payment.captured event confirmed on server'
                        : verificationProgress.stage === 'polling_webhook'
                        ? `Awaiting server webhook delivery (Attempt ${verificationProgress.attempt || 1}/${verificationProgress.maxAttempts || 8})...`
                        : 'Auditing server-side Razorpay webhook status & signature...'}
                    </p>
                  </div>
                </div>

                {/* Step 3: Download Token Authorization */}
                <div className="flex items-center gap-3">
                  <div
                    className={`w-6 h-6 rounded-full flex items-center justify-center shrink-0 ${
                      verificationProgress.stage === 'granted'
                        ? 'bg-emerald-100 text-emerald-700'
                        : 'bg-neutral-100 text-neutral-400'
                    }`}
                  >
                    {verificationProgress.stage === 'granted' ? (
                      <CheckCircle2 className="w-4 h-4" />
                    ) : (
                      <Lock className="w-3.5 h-3.5" />
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-extrabold text-neutral-900">3. PDF Download Token Issuance</p>
                    <p className="text-[11px] text-neutral-400 font-bold">
                      {verificationProgress.stage === 'granted'
                        ? 'Signed download access token issued • PDFs unlocked'
                        : 'Download links remain locked until server verification succeeds'}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Strict Anti-Fraud Notice */}
            <div className="p-3.5 bg-amber-50 rounded-2xl border border-amber-200 text-neutral-700 text-xs font-bold flex items-start gap-2.5">
              <ShieldCheck className="w-4 h-4 text-amber-700 shrink-0 mt-0.5" />
              <span className="text-[11px] leading-relaxed">
                <strong>Server-Authoritative Gatekeeping:</strong> PDF download links are only exposed after confirmed server-side verification from the Razorpay webhook, preventing any client-side file access bypass.
              </span>
            </div>

            {verificationProgress.stage === 'failed' && (
              <div className="space-y-2 pt-2">
                <button
                  type="button"
                  onClick={() => {
                    completePaymentVerification(
                      verificationProgress.order,
                      verificationProgress.order.razorpayOrderId,
                      verificationProgress.paymentId
                    );
                  }}
                  className="w-full py-3 rounded-xl bg-amber-400 hover:bg-amber-500 text-neutral-900 font-extrabold text-xs flex items-center justify-center gap-2 cursor-pointer shadow-xs"
                >
                  <RefreshCw className="w-4 h-4" />
                  <span>Retry Server Webhook Verification</span>
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setVerificationProgress(null);
                    setIsProcessing(false);
                    setIsVerifying(false);
                  }}
                  className="w-full py-2.5 rounded-xl bg-neutral-100 hover:bg-neutral-200 text-neutral-700 font-bold text-xs cursor-pointer"
                >
                  Return to Checkout
                </button>
              </div>
            )}
          </div>
        ) : (
          <form onSubmit={handleSubmitPayment} className="p-5 sm:p-7 space-y-6">
          {/* Order Summary Strip */}
          <div className="bg-amber-50 rounded-2xl p-4 border border-amber-200/80">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-black text-amber-800 uppercase tracking-wide">
                Order Items ({itemsToBuy.length})
              </span>
              <span className="text-xs font-bold text-neutral-500">Instant PDF Access Upon Payment</span>
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

          {/* Razorpay Gateway Status / Config Toggle */}
          <div className="p-3.5 bg-neutral-50 rounded-2xl border border-neutral-200 space-y-2">
            <div className="flex items-center justify-between text-xs font-bold">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
                <span className="text-neutral-800 font-extrabold">
                  Razorpay Payment Gateway:
                </span>
                <span className="text-emerald-700 font-bold">
                  {razorpayKey ? `Connected (${razorpayKey.substring(0, 8)}...)` : 'Standard Gateway'}
                </span>
              </div>
              <button
                type="button"
                onClick={() => setShowKeyConfig(!showKeyConfig)}
                className="text-[11px] font-extrabold text-amber-800 hover:text-amber-900 underline cursor-pointer"
              >
                {showKeyConfig ? 'Hide Settings' : 'Configure Key'}
              </button>
            </div>

            {showKeyConfig && (
              <div className="pt-2 border-t border-neutral-200 space-y-2 text-xs">
                <p className="text-neutral-600 font-medium">
                  Enter your Razorpay Key ID (starts with <code className="bg-neutral-200 px-1 rounded">rzp_test_</code> or <code className="bg-neutral-200 px-1 rounded">rzp_live_</code>) from your Razorpay Dashboard:
                </p>
                <div className="flex gap-2">
                  <input
                    type="text"
                    placeholder="rzp_test_xxxxxxxxxxxxxxxx"
                    value={keyInput}
                    onChange={(e) => setKeyInput(e.target.value)}
                    className="flex-1 px-3 py-1.5 rounded-xl border border-neutral-300 text-xs font-mono font-bold bg-white focus:outline-none focus:ring-2 focus:ring-amber-400"
                  />
                  <button
                    type="button"
                    onClick={handleSaveKey}
                    className="px-3 py-1.5 rounded-xl bg-neutral-900 hover:bg-neutral-800 text-white font-extrabold text-xs cursor-pointer"
                  >
                    Save Key
                  </button>
                </div>
                {keySaveSuccess && (
                  <p className="text-emerald-700 font-bold text-[11px] flex items-center gap-1">
                    <CheckCircle2 className="w-3.5 h-3.5" /> Razorpay Key updated!
                  </p>
                )}
              </div>
            )}
          </div>

          {/* Contact Details */}
          <div className="space-y-3">
            <h3 className="font-heading font-extrabold text-sm text-neutral-900 flex items-center gap-1.5">
              <span>1. Customer Details for Verified PDF Delivery</span>
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
              <span>2. Choose Payment Channel (Processed by Razorpay)</span>
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
                  placeholder="Enter UPI ID (optional, or pay via QR on Razorpay popup)"
                  value={upiId}
                  onChange={(e) => setUpiId(e.target.value)}
                  className="flex-1 text-xs font-bold px-2 py-1 focus:outline-none"
                />
                <span className="text-[11px] font-black text-emerald-700 bg-emerald-50 px-2 py-1 rounded-lg">
                  Instant UPI
                </span>
              </div>
            )}
          </div>

          {/* Strict Security Policy Notice */}
          <div className="p-3 bg-amber-50/70 border border-amber-200 rounded-xl text-neutral-700 text-xs font-bold flex items-start gap-2">
            <ShieldCheck className="w-4 h-4 text-amber-700 shrink-0 mt-0.5" />
            <span>
              <strong>Strict Anti-Fraud Guarantee:</strong> All printable colouring books &amp; worksheets are protected. High-resolution PDF downloads and secure email links are delivered <em>only</em> after verified Razorpay payment confirmation.
            </span>
          </div>

          {errorMsg && (
            <div className="p-3 bg-red-50 border border-red-200 rounded-xl text-red-700 text-xs font-bold flex items-start gap-2">
              <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
              <span>{errorMsg}</span>
            </div>
          )}

          {/* Action Button */}
          <div className="pt-2">
            <button
              type="submit"
              disabled={isProcessing || isVerifying}
              className="w-full py-4 px-4 rounded-2xl bg-[#FFD93D] hover:bg-[#ffdf59] active:bg-amber-400 text-neutral-900 font-extrabold text-base flex items-center justify-center gap-2 shadow-lg transition-all cursor-pointer border-2 border-amber-400 disabled:opacity-50"
            >
              {isVerifying ? (
                <>
                  <div className="w-5 h-5 border-2 border-neutral-900 border-t-transparent rounded-full animate-spin" />
                  <span>Verifying Payment Confirmation with Razorpay...</span>
                </>
              ) : isProcessing ? (
                <>
                  <div className="w-5 h-5 border-2 border-neutral-900 border-t-transparent rounded-full animate-spin" />
                  <span>Connecting to Razorpay...</span>
                </>
              ) : (
                <>
                  <Lock className="w-4 h-4" />
                  <span>Pay ₹{orderTotal} via Razorpay &amp; Unlock PDFs</span>
                </>
              )}
            </button>
            <p className="text-[11px] text-center text-neutral-400 font-bold mt-2">
              🔒 Powered by Razorpay. Zero downloads are shared without payment confirmation.
            </p>
          </div>
        </form>
        )}

        {/* Razorpay Confirmation / Simulator Modal (Used when testing without live API keys) */}
        {showSimulatorModal && (
          <div className="absolute inset-0 bg-neutral-900/80 backdrop-blur-xs flex items-center justify-center p-4 z-50 animate-in fade-in">
            <div className="bg-white rounded-3xl p-6 max-w-md w-full border-4 border-amber-400 shadow-2xl space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-neutral-200">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-xl bg-amber-100 flex items-center justify-center">
                    <ShieldCheck className="w-5 h-5 text-amber-700" />
                  </div>
                  <div>
                    <h4 className="font-heading font-extrabold text-sm text-neutral-900">
                      Razorpay Gateway Confirmation
                    </h4>
                    <p className="text-[10px] text-neutral-500 font-bold">
                      Order #{showSimulatorModal.order.orderNumber} • ₹{orderTotal}
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => {
                    setShowSimulatorModal(null);
                    setIsProcessing(false);
                    setErrorMsg('⚠️ Payment cancelled: Modal closed without payment confirmation. PDFs remain locked.');
                  }}
                  className="p-1.5 rounded-full hover:bg-neutral-100 text-neutral-400"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <div className="text-xs text-neutral-700 space-y-2">
                <p>
                  You are completing payment of <strong>₹{orderTotal}</strong> for{' '}
                  <strong>{itemsToBuy.length} printable book(s)</strong>.
                </p>
                <div className="p-3 bg-amber-50 rounded-xl border border-amber-200 space-y-1">
                  <div className="flex justify-between">
                    <span className="text-neutral-500">Customer:</span>
                    <span className="font-extrabold text-neutral-900">{parentName}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-neutral-500">Email:</span>
                    <span className="font-extrabold text-neutral-900">{email}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-neutral-500">Status:</span>
                    <span className="font-extrabold text-amber-700">Awaiting Payment Confirmation</span>
                  </div>
                </div>
                <p className="text-[11px] text-neutral-500 font-medium">
                  PDF downloads are strictly protected. They will only be unlocked if payment is successfully confirmed.
                </p>
              </div>

              <div className="pt-2 space-y-2">
                <button
                  type="button"
                  onClick={async () => {
                    const simPaymentId = `pay_sim_${Date.now()}`;
                    const targetOrder = showSimulatorModal.order;
                    const targetRzpOrderId = showSimulatorModal.order.razorpayOrderId;
                    setShowSimulatorModal(null);
                    setIsVerifying(true);
                    setErrorMsg(null);
                    try {
                      // Dispatch real server-side webhook simulation
                      const simRes = await fetch('/api/razorpay/webhook/simulate', {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({
                          orderId: targetOrder.id,
                          razorpayPaymentId: simPaymentId,
                        }),
                      });

                      const simData = await simRes.json();
                      if (!simRes.ok || !simData.success || !simData.order?.webhookVerified || !simData.order?.downloadToken) {
                        throw new Error(simData.error || 'Server webhook simulation rejected. Access denied.');
                      }

                      // Complete verification step with server-verified order data
                      await completePaymentVerification(
                        targetOrder,
                        targetRzpOrderId,
                        simPaymentId,
                        undefined,
                        simData.order.downloadToken
                      );
                    } catch (simErr: any) {
                      setIsProcessing(false);
                      setIsVerifying(false);
                      setErrorMsg(simErr.message || 'Server webhook verification failed.');
                    }
                  }}
                  className="w-full py-3 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold text-xs flex items-center justify-center gap-2 cursor-pointer shadow-xs"
                >
                  <CheckCircle2 className="w-4 h-4" />
                  <span>Confirm via Server Webhook &amp; Unlock PDFs</span>
                </button>

                <button
                  type="button"
                  onClick={() => {
                    setShowSimulatorModal(null);
                    setIsProcessing(false);
                    setErrorMsg('❌ Payment was declined or cancelled. PDFs are strictly not shared without verified payment confirmation.');
                  }}
                  className="w-full py-2.5 rounded-xl bg-red-50 hover:bg-red-100 text-red-700 font-bold text-xs flex items-center justify-center gap-2 cursor-pointer"
                >
                  <AlertCircle className="w-4 h-4" />
                  <span>Cancel / Decline Payment (Keep PDFs Locked)</span>
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
