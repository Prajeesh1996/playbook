import React from 'react';
import { RainbowLogo } from '../utils/illustrations';
import { Heart, ShieldCheck, Mail, Phone, Download } from 'lucide-react';
import { LegalDocType } from './LegalModals';
import { useRouter } from '../context/RouterContext';

interface FooterProps {
  onNavigate: (sectionId: string) => void;
  onOpenLegal: (doc: LegalDocType) => void;
  onOpenMyDownloads: () => void;
  onOpenAdmin: () => void;
}

export const Footer: React.FC<FooterProps> = ({
  onNavigate,
  onOpenLegal,
  onOpenMyDownloads,
  onOpenAdmin,
}) => {
  const { navigate } = useRouter();

  return (
    <footer className="bg-neutral-900 text-neutral-300 pt-16 pb-12 border-t-4 border-[#FFD93D]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10 pb-12 border-b border-neutral-800">
          {/* Brand info */}
          <div className="lg:col-span-2 space-y-4">
            <div className="flex items-center gap-3">
              <button
                onClick={() => navigate('/')}
                className="flex items-center gap-3 text-left cursor-pointer"
              >
                <RainbowLogo size={44} />
                <div>
                  <span className="font-heading font-extrabold text-2xl text-white tracking-tight">
                    Little <span className="text-[#FF8A65]">Colour</span> <span className="text-[#6BCBFF]">World</span>
                  </span>
                  <p className="text-xs font-bold text-amber-400">Little Hands, Big Imagination! 🌈</p>
                </div>
              </button>
            </div>

            <p className="text-xs text-neutral-400 leading-relaxed font-medium max-w-sm">
              We design delightful, printable colouring books, tracing worksheets, and preschool activity PDFs.
              Nurturing creativity and early fine motor skills for little learners aged 2 to 6.
            </p>

            <div className="flex items-center gap-3 pt-2 text-xs font-bold text-neutral-400">
              <span className="flex items-center gap-1 text-emerald-400">
                <ShieldCheck className="w-4 h-4" /> 100% Screen-Free
              </span>
              <span>•</span>
              <span>Instant PDF Delivery</span>
              <span>•</span>
              <span>Made with Love</span>
            </div>
          </div>

          {/* Quick Links */}
          <div className="space-y-3">
            <h4 className="font-heading font-extrabold text-sm text-white uppercase tracking-wider">
              Explore
            </h4>
            <ul className="space-y-2 text-xs font-bold text-neutral-400">
              <li>
                <button
                  onClick={() => navigate('/books')}
                  className="hover:text-amber-400 transition-colors text-left cursor-pointer"
                >
                  Colouring Books (Ages 2–6)
                </button>
              </li>
              <li>
                <button
                  onClick={() => navigate('/books')}
                  className="hover:text-amber-400 transition-colors text-left cursor-pointer"
                >
                  Explore Categories
                </button>
              </li>
              <li>
                <button
                  onClick={() => navigate('/schools')}
                  className="hover:text-amber-400 transition-colors text-left cursor-pointer"
                >
                  School &amp; Nursery Packs
                </button>
              </li>
              <li>
                <button
                  onClick={() => navigate('/about')}
                  className="hover:text-amber-400 transition-colors text-left cursor-pointer"
                >
                  Our Philosophy
                </button>
              </li>
            </ul>
          </div>

          {/* Parent Customer Care */}
          <div className="space-y-3">
            <h4 className="font-heading font-extrabold text-sm text-white uppercase tracking-wider">
              Parent Portal
            </h4>
            <ul className="space-y-2 text-xs font-bold text-neutral-400">
              <li>
                <button
                  onClick={() => navigate('/my-downloads')}
                  className="flex items-center gap-1.5 text-sky-400 hover:text-sky-300 font-extrabold text-left cursor-pointer"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>My Downloads (Recover Files)</span>
                </button>
              </li>
              <li>
                <button
                  onClick={() => navigate('/contact')}
                  className="hover:text-amber-400 transition-colors text-left cursor-pointer"
                >
                  Frequently Asked Questions
                </button>
              </li>
              <li>
                <a
                  href="mailto:support@littlecolourworld.com"
                  className="hover:text-amber-400 transition-colors flex items-center gap-1.5"
                >
                  <Mail className="w-3.5 h-3.5" />
                  <span>support@littlecolourworld.com</span>
                </a>
              </li>
            </ul>
          </div>

          {/* Legal & Policies */}
          <div className="space-y-3">
            <h4 className="font-heading font-extrabold text-sm text-white uppercase tracking-wider">
              Legal &amp; Trust
            </h4>
            <ul className="space-y-2 text-xs font-bold text-neutral-400">
              <li>
                <button
                  onClick={() => navigate('/privacy-policy')}
                  className="hover:text-amber-400 transition-colors text-left cursor-pointer"
                >
                  Privacy Policy
                </button>
              </li>
              <li>
                <button
                  onClick={() => navigate('/terms-and-conditions')}
                  className="hover:text-amber-400 transition-colors text-left cursor-pointer"
                >
                  Terms and Conditions
                </button>
              </li>
              <li>
                <button
                  onClick={() => navigate('/refund-policy')}
                  className="hover:text-amber-400 transition-colors text-left cursor-pointer"
                >
                  Refund &amp; Cancellation Policy
                </button>
              </li>
              <li>
                <button
                  onClick={() => navigate('/shipping-delivery')}
                  className="hover:text-amber-400 transition-colors text-left cursor-pointer"
                >
                  Digital Delivery Policy
                </button>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar with Payment Trust Badges */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs font-bold text-neutral-500">
          <div className="flex items-center gap-2">
            <span>© 2026 Little Colour World. All rights reserved.</span>
            <span>•</span>
            <span className="text-neutral-400 flex items-center gap-1">
              Made for little artists with <Heart className="w-3 h-3 text-red-500 fill-current inline" />
            </span>
          </div>

          {/* Payment Badges */}
          <div className="flex items-center gap-2">
            <span className="text-[11px] text-neutral-400 mr-1">Secured by Razorpay:</span>
            <span className="bg-neutral-800 text-neutral-300 px-2 py-0.5 rounded-md text-[10px] font-black border border-neutral-700">
              UPI
            </span>
            <span className="bg-neutral-800 text-neutral-300 px-2 py-0.5 rounded-md text-[10px] font-black border border-neutral-700">
              VISA
            </span>
            <span className="bg-neutral-800 text-neutral-300 px-2 py-0.5 rounded-md text-[10px] font-black border border-neutral-700">
              MasterCard
            </span>
            <span className="bg-neutral-800 text-neutral-300 px-2 py-0.5 rounded-md text-[10px] font-black border border-neutral-700">
              RuPay
            </span>
            <span className="bg-neutral-800 text-neutral-300 px-2 py-0.5 rounded-md text-[10px] font-black border border-neutral-700">
              NetBanking
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
};
