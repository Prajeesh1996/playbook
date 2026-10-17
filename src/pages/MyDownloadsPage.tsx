import React, { useEffect, useState } from 'react';
import { useApp } from '../context/AppContext';
import { useRouter } from '../context/RouterContext';
import { updatePageSEO } from '../utils/seo';
import { downloadProduct } from '../utils/pdfGenerator';
import { PreviewArtworkPicker } from '../utils/illustrations';
import { Order, Product } from '../types';
import {
  Download,
  Mail,
  Search,
  CheckCircle2,
  AlertCircle,
  ShieldCheck,
  ChevronRight,
  BookOpen,
} from 'lucide-react';

export const MyDownloadsPage: React.FC = () => {
  const { getOrdersByEmail, products } = useApp();
  const { route, navigate } = useRouter();
  const [emailInput, setEmailInput] = useState(route.query.email || '');
  const [searchedOrders, setSearchedOrders] = useState<Order[] | null>(null);
  const [hasSearched, setHasSearched] = useState(false);
  const [downloadingId, setDownloadingId] = useState<string | null>(null);

  useEffect(() => {
    updatePageSEO({
      title: 'My Downloads & Printable PDF Recovery | Little Colour World',
      description:
        'Access and re-download your purchased preschool colouring books and worksheets anytime. Enter your purchase email for instant recovery.',
      canonicalPath: '/my-downloads',
      ogType: 'website',
      jsonLd: {
        '@context': 'https://schema.org',
        '@type': 'WebPage',
        name: 'My Downloads & Printable Recovery',
        description: 'Download recovery portal for Little Colour World purchases.',
        url: `${window.location.origin}/my-downloads`,
      },
    });

    if (route.query.email) {
      performSearch(route.query.email);
    }
  }, [route.query.email]);

  const performSearch = (email: string) => {
    const clean = email.trim();
    if (!clean) return;
    const results = getOrdersByEmail(clean).filter(
      (o) => o.status === 'paid' && Boolean(o.razorpayPaymentId)
    );
    setSearchedOrders(results);
    setHasSearched(true);
  };

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    performSearch(emailInput);
  };

  const handleDownload = async (ord: Order, productId: string, title: string) => {
    if (ord.status !== 'paid' || !ord.razorpayPaymentId) {
      alert('⚠️ Access Denied: Printable PDFs can only be downloaded after verified Razorpay payment.');
      return;
    }

    setDownloadingId(productId);
    try {
      const prod = products.find((p) => p.id === productId) || {
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
        samplePages: [{ pageNumber: 1, title: 'Cute Drawing', description: '', previewSvgType: 'lion' }],
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
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-8 space-y-6 animate-in fade-in duration-200">
      <nav aria-label="Breadcrumb" className="flex items-center gap-2 text-xs font-bold text-neutral-500">
        <button onClick={() => navigate('/')} className="hover:text-neutral-900 cursor-pointer">
          Home
        </button>
        <ChevronRight className="w-3.5 h-3.5 text-neutral-400 shrink-0" />
        <span className="text-neutral-900 font-extrabold">My Downloads</span>
      </nav>

      <div className="bg-white rounded-3xl p-6 sm:p-10 border-2 border-neutral-200 shadow-xs space-y-6">
        <div className="text-center max-w-lg mx-auto space-y-2">
          <div className="w-14 h-14 rounded-2xl bg-sky-100 text-sky-700 flex items-center justify-center mx-auto mb-3">
            <Download className="w-7 h-7" />
          </div>
          <h1 className="font-heading font-extrabold text-2xl sm:text-3xl text-neutral-900">
            Recover Your Printable Downloads
          </h1>
          <p className="text-xs sm:text-sm text-neutral-600 font-bold">
            Enter the email address you used during Razorpay checkout to instantly access and download your printable PDF books.
          </p>
        </div>

        {/* Email Search Form */}
        <form onSubmit={handleSearchSubmit} className="max-w-md mx-auto flex gap-2">
          <div className="relative flex-1">
            <Mail className="w-4 h-4 text-neutral-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="email"
              required
              placeholder="e.g. parent@example.com"
              value={emailInput}
              onChange={(e) => setEmailInput(e.target.value)}
              className="w-full pl-10 pr-4 py-3 rounded-2xl border border-neutral-300 text-xs font-bold text-neutral-900 focus:outline-none focus:ring-2 focus:ring-amber-400"
            />
          </div>
          <button
            type="submit"
            className="px-6 py-3 rounded-2xl bg-neutral-900 hover:bg-neutral-800 text-white font-extrabold text-xs flex items-center gap-1.5 cursor-pointer shadow-xs transition-colors"
          >
            <Search className="w-4 h-4" />
            <span>Search</span>
          </button>
        </form>

        {/* Results Area */}
        {hasSearched && (
          <div className="pt-6 border-t border-neutral-100 space-y-4">
            {searchedOrders && searchedOrders.length > 0 ? (
              <div className="space-y-4">
                <div className="flex items-center gap-2 text-xs font-bold text-emerald-800 bg-emerald-50 p-3 rounded-xl border border-emerald-200">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>
                    Found {searchedOrders.length} confirmed paid order{searchedOrders.length > 1 ? 's' : ''}!
                  </span>
                </div>

                <div className="space-y-4">
                  {searchedOrders.map((ord) => (
                    <div
                      key={ord.id}
                      className="p-5 rounded-2xl bg-amber-50/50 border-2 border-amber-200/80 space-y-3"
                    >
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1 text-xs font-extrabold pb-2 border-b border-amber-200/60">
                        <span className="text-neutral-900">Order #{ord.orderNumber}</span>
                        <div className="flex items-center gap-2">
                          <span className="text-[11px] font-mono text-emerald-800 bg-emerald-100 px-2 py-0.5 rounded-full flex items-center gap-1">
                            <ShieldCheck className="w-3 h-3 text-emerald-700" />
                            <span>Paid via Razorpay</span>
                          </span>
                          <span className="text-neutral-500 font-bold">
                            {new Date(ord.createdAt).toLocaleDateString()}
                          </span>
                        </div>
                      </div>

                      <div className="space-y-2">
                        {ord.items.map((item, idx) => (
                          <div
                            key={idx}
                            className="bg-white p-3 rounded-xl border border-neutral-200 flex items-center justify-between gap-3"
                          >
                            <div className="flex items-center gap-3">
                              <div className="w-10 h-10 rounded-lg bg-amber-100/60 flex items-center justify-center shrink-0">
                                <BookOpen className="w-5 h-5 text-amber-700" />
                              </div>
                              <div>
                                <h4 className="text-xs font-extrabold text-neutral-900">{item.title}</h4>
                                <span className="text-[10px] text-neutral-400 font-bold">
                                  Printable A4 PDF Workbook
                                </span>
                              </div>
                            </div>

                            <button
                              onClick={() => handleDownload(ord, item.productId, item.title)}
                              disabled={downloadingId === item.productId}
                              className="px-4 py-2 rounded-xl bg-amber-300 hover:bg-amber-400 disabled:opacity-50 text-neutral-900 font-extrabold text-xs flex items-center gap-1.5 cursor-pointer shadow-xs transition-colors shrink-0"
                            >
                              <Download className="w-3.5 h-3.5" />
                              <span>{downloadingId === item.productId ? 'Downloading...' : 'Download PDF'}</span>
                            </button>
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              <div className="text-center py-10 bg-neutral-50 rounded-2xl border border-neutral-200 space-y-2">
                <AlertCircle className="w-8 h-8 text-neutral-400 mx-auto" />
                <h4 className="font-heading font-extrabold text-sm text-neutral-900">
                  No Confirmed Paid Orders Found
                </h4>
                <p className="text-xs text-neutral-500 font-bold max-w-sm mx-auto">
                  We could not find any paid orders for <strong>{emailInput}</strong>. Please ensure you entered the exact email used during checkout.
                </p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
