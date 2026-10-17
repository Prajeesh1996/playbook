import React from 'react';
import { X, Shield, FileCheck, RefreshCw, Send, CheckCircle2 } from 'lucide-react';

export type LegalDocType = 'privacy' | 'terms' | 'refund' | 'delivery' | null;

interface LegalModalsProps {
  activeDoc: LegalDocType;
  onClose: () => void;
}

export const LegalModals: React.FC<LegalModalsProps> = ({ activeDoc, onClose }) => {
  if (!activeDoc) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-neutral-900/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-6 animate-in fade-in duration-200">
      <div className="bg-[#FFFDF5] w-full max-w-2xl rounded-3xl shadow-2xl border-4 border-amber-300 overflow-hidden relative max-h-[90vh] flex flex-col">
        {/* Header */}
        <div className="p-5 sm:p-6 bg-white border-b border-amber-200 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-amber-100 text-amber-800">
              {activeDoc === 'privacy' && <Shield className="w-5 h-5" />}
              {activeDoc === 'terms' && <FileCheck className="w-5 h-5" />}
              {activeDoc === 'refund' && <RefreshCw className="w-5 h-5" />}
              {activeDoc === 'delivery' && <Send className="w-5 h-5" />}
            </div>
            <div>
              <h2 className="font-heading font-extrabold text-xl text-neutral-900">
                {activeDoc === 'privacy' && 'Privacy Policy'}
                {activeDoc === 'terms' && 'Terms and Conditions'}
                {activeDoc === 'refund' && 'Refund & Cancellation Policy'}
                {activeDoc === 'delivery' && 'Digital Product Delivery Policy'}
              </h2>
              <p className="text-xs text-neutral-500 font-bold">
                Little Colour World • Last Updated: October 2026
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-full hover:bg-neutral-100 text-neutral-400 hover:text-neutral-800"
            aria-label="Close legal modal"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Body */}
        <div className="p-6 overflow-y-auto space-y-4 text-xs sm:text-sm text-neutral-700 leading-relaxed font-medium flex-1">
          {activeDoc === 'privacy' && (
            <>
              <h3 className="font-heading font-extrabold text-base text-neutral-900">
                1. Information We Collect
              </h3>
              <p>
                When you purchase printable colouring books or submit a school enquiry on Little Colour World, we collect your name, email address, and phone number solely to deliver your purchased PDF files, verify Razorpay payments, and provide customer support.
              </p>
              <h3 className="font-heading font-extrabold text-base text-neutral-900 pt-2">
                2. Payment Security
              </h3>
              <p>
                We do not store your credit card, debit card, or UPI PIN numbers on our servers. All transactions are processed through Razorpay's PCI-DSS compliant payment gateway using 256-bit encryption.
              </p>
              <h3 className="font-heading font-extrabold text-base text-neutral-900 pt-2">
                3. Use of Data
              </h3>
              <p>
                We never sell, rent, or lease your personal information to third parties. We use your email strictly to transmit your download tokens and critical order receipts.
              </p>
            </>
          )}

          {activeDoc === 'terms' && (
            <>
              <h3 className="font-heading font-extrabold text-base text-neutral-900">
                1. Digital Products License
              </h3>
              <p>
                All colouring books, worksheets, and activity bundles sold on Little Colour World are downloadable digital PDF files. Upon purchase, you are granted a non-exclusive personal license to print the pages unlimited times for your immediate household or homeschool.
              </p>
              <h3 className="font-heading font-extrabold text-base text-neutral-900 pt-2">
                2. Copyright &amp; Restrictions
              </h3>
              <p>
                You may not resell, redistribute, sub-license, upload to public sharing servers, or commercially distribute our artwork files without a specialized School/Institutional License.
              </p>
              <h3 className="font-heading font-extrabold text-base text-neutral-900 pt-2">
                3. School &amp; Playschool Licenses
              </h3>
              <p>
                Educational institutions purchasing our School Activity Packs receive authorized permission to print copies for enrolled students within their licensed classroom branches.
              </p>
            </>
          )}

          {activeDoc === 'refund' && (
            <>
              <h3 className="font-heading font-extrabold text-base text-neutral-900">
                1. Nature of Digital Products
              </h3>
              <p>
                Because Little Colour World products are downloadable digital files delivered immediately upon successful payment verification, standard returns of physical merchandise do not apply.
              </p>
              <h3 className="font-heading font-extrabold text-base text-neutral-900 pt-2">
                2. When Refunds Are Honoured
              </h3>
              <p>
                We stand 100% behind the quality of our educational materials. We gladly issue full refunds or file replacements within 7 days of purchase in cases of:
              </p>
              <ul className="list-disc pl-5 space-y-1">
                <li>Corrupted or unreadable PDF download files.</li>
                <li>Accidental duplicate purchases of the exact same product.</li>
                <li>Payment debited without receipt of download link or access token.</li>
              </ul>
              <h3 className="font-heading font-extrabold text-base text-neutral-900 pt-2">
                3. How to Request a Refund
              </h3>
              <p>
                Simply email <strong>support@littlecolourworld.com</strong> with your Order Number and email address. Our team reviews and processes valid requests within 24–48 business hours.
              </p>
            </>
          )}

          {activeDoc === 'delivery' && (
            <>
              <h3 className="font-heading font-extrabold text-base text-neutral-900">
                1. Instant Digital Delivery
              </h3>
              <p>
                There is zero physical shipping delay! Immediately upon successful payment confirmation via Razorpay:
              </p>
              <ul className="list-disc pl-5 space-y-1">
                <li>A "Download PDF" button appears right on your screen.</li>
                <li>A backup download link is instantly emailed to your provided email address.</li>
                <li>Your purchases are permanently tied to your email in our "My Downloads" portal.</li>
              </ul>
              <h3 className="font-heading font-extrabold text-base text-neutral-900 pt-2">
                2. File Format &amp; Printing Compatibility
              </h3>
              <p>
                All files are standard high-resolution PDF format (300 DPI vector lines), optimized for standard home printers using A4 or US Letter sheets.
              </p>
              <h3 className="font-heading font-extrabold text-base text-neutral-900 pt-2">
                3. Lifetime Personal Access
              </h3>
              <p>
                Save the file to your computer or cloud storage. You can reprint anytime your child wants a fresh page to color again!
              </p>
            </>
          )}
        </div>

        {/* Footer */}
        <div className="p-4 bg-white border-t border-amber-200 flex justify-end">
          <button
            onClick={onClose}
            className="px-5 py-2 rounded-xl bg-neutral-900 hover:bg-neutral-800 text-white font-extrabold text-xs cursor-pointer"
          >
            I Understand
          </button>
        </div>
      </div>
    </div>
  );
};
