import React, { useState } from 'react';
import { Order, Product } from '../types';
import { Download, CheckCircle2, X, Sparkles, Printer, Mail, Heart } from 'lucide-react';
import { generateProductPDF } from '../utils/pdfGenerator';
import { PreviewArtworkPicker } from '../utils/illustrations';

interface SuccessCelebrationModalProps {
  order: Order | null;
  onClose: () => void;
  allProducts: Product[];
}

export const SuccessCelebrationModal: React.FC<SuccessCelebrationModalProps> = ({
  order,
  onClose,
  allProducts,
}) => {
  const [downloadingId, setDownloadingId] = useState<string | null>(null);
  const [childName, setChildName] = useState<string>('');
  const [downloadedIds, setDownloadedIds] = useState<string[]>([]);

  if (!order) return null;

  const handleDownloadItem = async (productId: string, title: string) => {
    setDownloadingId(productId);
    try {
      // Find full product details or fallback
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

      await generateProductPDF(prod, childName.trim());
      setDownloadedIds((prev) => [...prev, productId]);
    } catch (err) {
      console.error(err);
    } finally {
      setDownloadingId(null);
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-neutral-900/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-6 animate-in zoom-in-95 duration-200">
      <div className="bg-[#FFFDF5] w-full max-w-2xl rounded-3xl shadow-2xl border-4 border-amber-300 overflow-hidden relative max-h-[92vh] flex flex-col">
        {/* Header Ribbon */}
        <div className="bg-gradient-to-r from-[#FFD93D] via-[#FFB6C1] to-[#6BCBFF] p-6 text-center relative border-b-2 border-amber-300">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-2 rounded-full bg-white/80 hover:bg-white text-neutral-700 hover:text-black shadow-xs transition-colors cursor-pointer"
            aria-label="Close celebration modal"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="inline-flex p-3 bg-white rounded-full shadow-md text-3xl mb-2 animate-bounce">
            🎉
          </div>
          <h2 className="font-heading font-extrabold text-2xl sm:text-3xl text-neutral-900">
            Yay! Your Colouring Adventure Is Ready! 🌈
          </h2>
          <p className="text-xs sm:text-sm font-bold text-neutral-800 mt-1">
            Thank you, {order.customer.parentName}! Your payment of ₹{order.total} is verified.
          </p>
        </div>

        {/* Modal Body */}
        <div className="p-5 sm:p-7 overflow-y-auto space-y-6 flex-1">
          {/* Order Details Badge */}
          <div className="bg-white rounded-2xl p-4 border border-amber-200 flex flex-wrap items-center justify-between gap-3 text-xs font-bold text-neutral-600">
            <div>
              <span className="text-neutral-400 block text-[10px]">Order Number</span>
              <span className="text-neutral-900 font-extrabold">{order.orderNumber}</span>
            </div>
            <div>
              <span className="text-neutral-400 block text-[10px]">Razorpay Payment ID</span>
              <span className="text-emerald-700 font-mono text-[11px] font-bold">
                {order.razorpayPaymentId || 'Verified'}
              </span>
            </div>
            <div>
              <span className="text-neutral-400 block text-[10px]">Email Destination</span>
              <span className="text-neutral-900 truncate max-w-[140px] block">{order.customer.email}</span>
            </div>
          </div>

          {/* Child's Name Personalization for the Cover & Certificate */}
          <div className="bg-amber-50 rounded-2xl p-4 border border-amber-200/80 space-y-2">
            <label className="block text-xs font-extrabold text-neutral-900">
              Personalize with Your Child's Name (Optional):
            </label>
            <p className="text-[11px] text-neutral-600 font-medium">
              We'll print their name on the book cover and the Super Artist Certificate!
            </p>
            <input
              type="text"
              placeholder="e.g. Aarav, Ananya, Kabir"
              value={childName}
              onChange={(e) => setChildName(e.target.value)}
              className="w-full px-3.5 py-2 rounded-xl border border-amber-300 bg-white text-xs font-bold text-neutral-800 focus:outline-none focus:ring-2 focus:ring-amber-400"
            />
          </div>

          {/* Purchased Books List with Download Buttons */}
          <div className="space-y-3">
            <h3 className="font-heading font-extrabold text-sm text-neutral-900 flex items-center justify-between">
              <span>Your Purchased Printable Files ({order.items.length})</span>
              <span className="text-xs font-bold text-emerald-600 flex items-center gap-1">
                <CheckCircle2 className="w-3.5 h-3.5" /> Ready for Download
              </span>
            </h3>

            <div className="space-y-3">
              {order.items.map((item) => {
                const isDownloading = downloadingId === item.productId;
                const isDownloaded = downloadedIds.includes(item.productId);

                return (
                  <div
                    key={item.productId}
                    className="bg-white rounded-2xl p-3.5 border-2 border-amber-200 shadow-2xs flex items-center justify-between gap-3"
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <div className="w-12 h-14 rounded-xl bg-amber-100 flex items-center justify-center p-1 shrink-0">
                        <div className="w-8 h-8">
                          <PreviewArtworkPicker type="lion" isColoured={true} />
                        </div>
                      </div>
                      <div className="min-w-0">
                        <h4 className="font-heading font-extrabold text-xs sm:text-sm text-neutral-900 truncate">
                          {item.title}
                        </h4>
                        <div className="text-[11px] font-bold text-neutral-400 flex items-center gap-2 mt-0.5">
                          <span>Printable PDF (A4)</span>
                          <span>•</span>
                          <span className="text-emerald-700">₹{item.price} Paid</span>
                        </div>
                      </div>
                    </div>

                    <button
                      onClick={() => handleDownloadItem(item.productId, item.title)}
                      disabled={isDownloading}
                      className={`px-4 py-2.5 rounded-xl text-xs font-black flex items-center gap-1.5 shrink-0 transition-colors cursor-pointer shadow-xs ${
                        isDownloaded
                          ? 'bg-emerald-100 text-emerald-800 hover:bg-emerald-200'
                          : 'bg-[#FFD93D] hover:bg-[#ffdf59] text-neutral-900'
                      }`}
                    >
                      <Download className="w-4 h-4" />
                      <span>{isDownloading ? 'Generating...' : isDownloaded ? 'Download Again' : 'Download PDF'}</span>
                    </button>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Email Confirmation Notice */}
          <div className="bg-sky-50 rounded-2xl p-4 border border-sky-200 flex items-start gap-3">
            <Mail className="w-5 h-5 text-sky-600 shrink-0 mt-0.5" />
            <div className="text-xs font-bold text-sky-900">
              <p>Download link emailed to {order.customer.email}</p>
              <p className="text-[11px] text-sky-700 font-medium mt-0.5">
                You can also recover your books anytime using the "My Downloads" button in the menu.
              </p>
            </div>
          </div>
        </div>

        {/* Modal Footer */}
        <div className="p-4 bg-white border-t border-amber-200 flex items-center justify-between">
          <div className="flex items-center gap-1.5 text-xs font-bold text-neutral-500">
            <Heart className="w-4 h-4 text-red-500 fill-current" />
            <span>Happy Colouring from Little Colour World!</span>
          </div>

          <button
            onClick={onClose}
            className="px-5 py-2 rounded-xl bg-neutral-900 hover:bg-neutral-800 text-white font-extrabold text-xs transition-colors cursor-pointer"
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
};
