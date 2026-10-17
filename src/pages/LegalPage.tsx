import React, { useEffect } from 'react';
import { updatePageSEO } from '../utils/seo';
import { useRouter } from '../context/RouterContext';
import { ChevronRight, Shield, FileCheck, RefreshCw, Send, ArrowLeft, Printer } from 'lucide-react';

interface LegalPageProps {
  docType: 'privacy' | 'terms' | 'refund' | 'shipping';
}

export const LegalPage: React.FC<LegalPageProps> = ({ docType }) => {
  const { navigate } = useRouter();

  const getDocDetails = () => {
    switch (docType) {
      case 'privacy':
        return {
          title: 'Privacy Policy | Little Colour World',
          heading: 'Privacy Policy',
          path: '/privacy-policy',
          description: 'Learn how Little Colour World protects your personal data and contact details during checkout.',
          icon: Shield,
        };
      case 'terms':
        return {
          title: 'Terms and Conditions | Little Colour World',
          heading: 'Terms and Conditions',
          path: '/terms-and-conditions',
          description: 'Terms and conditions for purchasing and downloading printable colouring books and worksheets.',
          icon: FileCheck,
        };
      case 'refund':
        return {
          title: 'Refund & Cancellation Policy | Little Colour World',
          heading: 'Refund & Cancellation Policy',
          path: '/refund-policy',
          description: 'Our customer satisfaction guarantee and refund terms for digital printable workbooks.',
          icon: RefreshCw,
        };
      case 'shipping':
      default:
        return {
          title: 'Instant Digital Delivery Policy | Little Colour World',
          heading: 'Digital Delivery Policy',
          path: '/shipping-delivery',
          description: 'Instant download delivery guidelines for all Little Colour World printable PDF books.',
          icon: Send,
        };
    }
  };

  const doc = getDocDetails();
  const Icon = doc.icon;

  useEffect(() => {
    updatePageSEO({
      title: doc.title,
      description: doc.description,
      canonicalPath: doc.path,
      ogType: 'article',
      jsonLd: {
        '@context': 'https://schema.org',
        '@type': 'WebPage',
        name: doc.heading,
        description: doc.description,
        url: `${window.location.origin}${doc.path}`,
      },
    });
  }, [doc]);

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-8 space-y-6 animate-in fade-in duration-200">
      <nav aria-label="Breadcrumb" className="flex items-center gap-2 text-xs font-bold text-neutral-500">
        <button onClick={() => navigate('/')} className="hover:text-neutral-900 cursor-pointer">
          Home
        </button>
        <ChevronRight className="w-3.5 h-3.5 text-neutral-400 shrink-0" />
        <span className="text-neutral-900 font-extrabold">{doc.heading}</span>
      </nav>

      <div className="bg-white rounded-3xl p-6 sm:p-10 border-2 border-neutral-200 shadow-xs space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-neutral-100">
          <div className="flex items-center gap-3">
            <div className="p-3 rounded-2xl bg-amber-100 text-amber-800">
              <Icon className="w-6 h-6" />
            </div>
            <div>
              <h1 className="font-heading font-extrabold text-2xl sm:text-3xl text-neutral-900">
                {doc.heading}
              </h1>
              <p className="text-xs text-neutral-400 font-bold mt-0.5">
                Little Colour World • Little Hands, Big Imagination! • Last Updated: October 2026
              </p>
            </div>
          </div>

          <button
            onClick={() => window.print()}
            className="px-4 py-2 rounded-xl bg-neutral-100 hover:bg-neutral-200 text-neutral-700 font-bold text-xs inline-flex items-center gap-1.5 self-start cursor-pointer"
          >
            <Printer className="w-4 h-4" />
            <span>Print Policy</span>
          </button>
        </div>

        <div className="space-y-5 text-xs sm:text-sm text-neutral-700 leading-relaxed font-medium">
          {docType === 'privacy' && (
            <>
              <h3 className="font-heading font-extrabold text-base text-neutral-900">
                1. Information We Collect
              </h3>
              <p>
                When you purchase printable colouring books or submit a school enquiry on Little Colour World, we collect your name, email address, and phone number solely to deliver your purchased PDF files, verify Razorpay payments, and provide customer support.
              </p>

              <h3 className="font-heading font-extrabold text-base text-neutral-900 pt-2">
                2. Payment Security &amp; Data Protection
              </h3>
              <p>
                All monetary transactions are processed securely via Razorpay using 256-bit SSL encryption. Little Colour World never stores your credit card, debit card, UPI PIN, or net banking credentials on our servers.
              </p>

              <h3 className="font-heading font-extrabold text-base text-neutral-900 pt-2">
                3. Zero Third-Party Advertising
              </h3>
              <p>
                We do not sell, rent, or lease customer contact information to third-party marketing companies. Your email is exclusively used to email order confirmations, instant download links, and relevant activity updates.
              </p>
            </>
          )}

          {docType === 'terms' && (
            <>
              <h3 className="font-heading font-extrabold text-base text-neutral-900">
                1. License and Permitted Usage
              </h3>
              <p>
                Each purchase grants you a personal, non-exclusive license to download, save, and print unlimited copies of the purchased PDF book for personal household use or classroom teaching.
              </p>

              <h3 className="font-heading font-extrabold text-base text-neutral-900 pt-2">
                2. Commercial Resale Restrictions
              </h3>
              <p>
                You may not redistribute, resell, relicense, or upload our printable files to public file-sharing networks or commercial marketplaces without written licensing permission.
              </p>
            </>
          )}

          {docType === 'refund' && (
            <>
              <h3 className="font-heading font-extrabold text-base text-neutral-900">
                1. Digital Download Nature
              </h3>
              <p>
                Because our colouring books and activity sheets are instant digital downloads delivered immediately upon verified Razorpay payment, standard physical product return windows do not apply.
              </p>

              <h3 className="font-heading font-extrabold text-base text-neutral-900 pt-2">
                2. 100% Parent Satisfaction Guarantee
              </h3>
              <p>
                If you encounter any technical error opening or printing your PDF file, or if you were accidentally charged twice, email us at <strong>hello@littlecolourworld.com</strong> within 7 days of purchase. We will promptly reissue your files or process a full refund.
              </p>
            </>
          )}

          {docType === 'shipping' && (
            <>
              <h3 className="font-heading font-extrabold text-base text-neutral-900">
                1. 100% Instant Digital Delivery
              </h3>
              <p>
                All colouring books, worksheets, and activity packs sold on Little Colour World are instant digital PDF downloads. No physical books will be shipped via courier.
              </p>

              <h3 className="font-heading font-extrabold text-base text-neutral-900 pt-2">
                2. How You Receive Your Files
              </h3>
              <p>
                Immediately after successful payment confirmation from Razorpay, your download will unlock directly on your screen. You will also be able to recover your files anytime via the "My Downloads" section by entering your email.
              </p>
            </>
          )}
        </div>

        <div className="pt-6 border-t border-neutral-100 flex items-center justify-between">
          <button
            onClick={() => navigate('/books')}
            className="px-5 py-2.5 rounded-xl bg-amber-300 hover:bg-amber-400 font-extrabold text-xs inline-flex items-center gap-2 cursor-pointer"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Continue Shopping</span>
          </button>
        </div>
      </div>
    </div>
  );
};
