import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { Product, Order } from '../types';
import { X, Download, Mail, Search, CheckCircle2, AlertCircle, ShieldCheck, Lock } from 'lucide-react';
import { generateProductPDF, downloadProduct } from '../utils/pdfGenerator';
import { PreviewArtworkPicker } from '../utils/illustrations';

interface MyDownloadsModalProps {
  onClose: () => void;
  allProducts: Product[];
}

export const MyDownloadsModal: React.FC<MyDownloadsModalProps> = ({ onClose, allProducts }) => {
  const { getOrdersByEmail } = useApp();
  const [emailInput, setEmailInput] = useState('');
  const [searchedOrders, setSearchedOrders] = useState<Order[] | null>(null);
  const [hasSearched, setHasSearched] = useState(false);
  const [downloadingId, setDownloadingId] = useState<string | null>(null);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (!emailInput.trim()) return;
    // STRICT SECURITY: Only display orders with verified 'paid' status and Razorpay Payment ID
    const results = getOrdersByEmail(emailInput).filter(
      (o) => o.status === 'paid' && Boolean(o.razorpayPaymentId)
    );
    setSearchedOrders(results);
    setHasSearched(true);
  };

  const handleDownloadItem = async (ord: Order, productId: string, title: string) => {
    // STRICT PAYMENT CHECK: Refuse download if order is not paid or missing payment ID
    if (ord.status !== 'paid' || !ord.razorpayPaymentId) {
      alert('⚠️ Access Denied: Printable PDFs can only be shared after verified Razorpay payment confirmation.');
      return;
    }

    setDownloadingId(productId);
    try {
      const prod = allProducts.find((p) => p.id === productId) || {
        id: productId,
        title,
        slug: 'colouring-book',
        category: 'Animals Colouring' as any,
        ageGroup: 'Ages 2–6' as any,
        pageCount: 32,
        fileFormat: 'Printable PDF (A4)',
        fileSizeMb: 8.4,
        originalPrice: 129,
        discountedPrice: 49,
        rating: 5,
        reviewsCount: 100,
        description: 'Complete high-resolution printable preschool workbook.',
        shortDescription: 'Complete printable preschool workbook.',
        learningOutcomes: ['Fine motor skills', 'Creativity'],
        samplePages: [{ pageNumber: 1, title: 'Cute Lion', description: '', previewSvgType: 'lion' }],
        isFeatured: true,
        themeColor: '#FFD93D',
        active: true,
        createdAt: new Date().toISOString(),
      };

      await downloadProduct(prod, 'Little Artist');
    } catch (err) {
      console.error(err);
    } finally {
      setDownloadingId(null);
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-neutral-900/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-6 animate-in fade-in duration-200">
      <div className="bg-[#FFFDF5] w-full max-w-xl rounded-3xl shadow-2xl border-4 border-sky-300 overflow-hidden relative max-h-[92vh] flex flex-col">
        {/* Header */}
        <div className="p-5 sm:p-6 bg-white border-b border-sky-200 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="p-2.5 rounded-2xl bg-sky-100 text-sky-800">
              <Download className="w-5 h-5 text-sky-600" />
            </div>
            <div>
              <h2 className="font-heading font-extrabold text-xl text-neutral-900">
                My Downloads Portal
              </h2>
              <p className="text-xs text-neutral-500 font-bold">
                Access your verified purchases • Razorpay Confirmation Protected
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-full hover:bg-neutral-100 text-neutral-400 hover:text-neutral-800 cursor-pointer"
            aria-label="Close downloads portal"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-5 sm:p-6 overflow-y-auto space-y-6 flex-1">
          {/* Email Search Box */}
          <form onSubmit={handleSearch} className="space-y-2">
            <label className="block text-xs font-extrabold text-neutral-800">
              Enter the Email Address Used During Purchase:
            </label>
            <div className="flex gap-2">
              <div className="relative flex-1">
                <Mail className="w-4 h-4 text-neutral-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="email"
                  required
                  placeholder="e.g. parent@example.com (or priya.sharma@example.com)"
                  value={emailInput}
                  onChange={(e) => setEmailInput(e.target.value)}
                  className="w-full pl-9 pr-3 py-2.5 rounded-xl border border-neutral-300 bg-white text-xs font-bold text-neutral-800 focus:outline-none focus:ring-2 focus:ring-sky-400"
                />
              </div>
              <button
                type="submit"
                className="px-5 py-2.5 rounded-xl bg-sky-500 hover:bg-sky-600 text-white font-extrabold text-xs flex items-center gap-1.5 transition-colors cursor-pointer"
              >
                <Search className="w-4 h-4" />
                <span>Find Books</span>
              </button>
            </div>
            <p className="text-[11px] text-neutral-500 font-medium">
              Demo tip: Try <strong>priya.sharma@example.com</strong> or the email you used during checkout!
            </p>
          </form>

          {/* Search Results */}
          {hasSearched && (
            <div className="space-y-4 pt-2">
              {searchedOrders && searchedOrders.length > 0 ? (
                <div className="space-y-4">
                  <div className="text-xs font-black text-emerald-800 flex items-center gap-1.5">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                    <span>Found {searchedOrders.length} verified purchase order(s):</span>
                  </div>

                  {searchedOrders.map((ord) => (
                    <div
                      key={ord.id}
                      className="bg-white rounded-2xl p-4 border border-neutral-200 shadow-2xs space-y-3"
                    >
                      <div className="flex items-center justify-between text-xs font-bold text-neutral-500 pb-2 border-b border-neutral-100">
                        <div>
                          <span className="font-extrabold text-neutral-900">Order #{ord.orderNumber}</span>
                          <span className="text-neutral-400 ml-2">
                            {new Date(ord.createdAt).toLocaleDateString()}
                          </span>
                        </div>
                        <div className="flex items-center gap-1 text-[11px] font-mono font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md">
                          <ShieldCheck className="w-3.5 h-3.5" />
                          <span>{ord.razorpayPaymentId}</span>
                        </div>
                      </div>

                      <div className="space-y-2">
                        {ord.items.map((item) => (
                          <div
                            key={item.productId}
                            className="flex items-center justify-between gap-3 p-2 rounded-xl bg-[#FFFDF5] border border-amber-200/60"
                          >
                            <div className="flex items-center gap-2.5 min-w-0">
                              <div className="w-8 h-8 rounded-lg bg-amber-100 flex items-center justify-center shrink-0">
                                <PreviewArtworkPicker type="lion" isColoured={true} />
                              </div>
                              <div className="min-w-0">
                                <span className="text-xs font-extrabold text-neutral-900 block truncate">
                                  {item.title}
                                </span>
                                <span className="text-[10px] font-bold text-emerald-700">
                                  Payment Confirmed (₹{item.price})
                                </span>
                              </div>
                            </div>

                            <button
                              onClick={() => handleDownloadItem(ord, item.productId, item.title)}
                              disabled={downloadingId === item.productId}
                              className="px-3 py-1.5 rounded-lg bg-[#FFD93D] hover:bg-[#ffdf59] text-neutral-900 font-extrabold text-[11px] flex items-center gap-1 shadow-2xs shrink-0 cursor-pointer"
                            >
                              <Download className="w-3.5 h-3.5" />
                              <span>{downloadingId === item.productId ? 'Generating...' : 'Download PDF'}</span>
                            </button>
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="bg-amber-50 rounded-2xl p-6 text-center border border-amber-200 space-y-2">
                  <AlertCircle className="w-8 h-8 text-amber-600 mx-auto" />
                  <h4 className="font-heading font-extrabold text-sm text-neutral-900">
                    No Confirmed Purchases Found for this Email
                  </h4>
                  <p className="text-xs text-neutral-600">
                    PDF downloads are strictly protected and only shared after successful Razorpay payment confirmation. Please verify the email used at checkout.
                  </p>
                </div>
              )}
            </div>
          )}

          {/* Security policy note */}
          <div className="p-3 bg-sky-50 rounded-2xl border border-sky-200/80 text-[11px] font-bold text-sky-900 flex items-center gap-2">
            <Lock className="w-4 h-4 text-sky-700 shrink-0" />
            <span>
              All digital files are strictly linked to verified Razorpay transaction confirmations.
            </span>
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 bg-white border-t border-sky-200 flex justify-end">
          <button
            onClick={onClose}
            className="px-5 py-2 rounded-xl bg-neutral-900 hover:bg-neutral-800 text-white font-extrabold text-xs cursor-pointer"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
