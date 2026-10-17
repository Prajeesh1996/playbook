import React from 'react';
import { Sparkles, ArrowRight, Download, CheckCircle2 } from 'lucide-react';
import { SmilingSun, FloatingCloud, CrayonMascot, LineArtLion, LineArtElephant } from '../utils/illustrations';

interface HeroProps {
  onExploreBooks: () => void;
  onExploreSchoolPacks: () => void;
}

export const Hero: React.FC<HeroProps> = ({ onExploreBooks, onExploreSchoolPacks }) => {
  return (
    <section className="relative overflow-hidden bg-gradient-to-b from-[#FFF9D2]/70 via-[#E3F6FF]/50 to-[#FFFDF5] pt-8 pb-16 lg:py-20 border-b border-amber-100">
      {/* Decorative Background Elements */}
      <div className="absolute top-4 left-6 sm:left-12 opacity-80 pointer-events-none animate-drift">
        <FloatingCloud width={110} height={60} />
      </div>
      <div className="absolute top-12 right-10 sm:right-24 opacity-80 pointer-events-none animate-float">
        <SmilingSun size={72} />
      </div>
      <div className="absolute bottom-6 left-1/4 opacity-60 pointer-events-none hidden md:block animate-float-delayed">
        <FloatingCloud width={90} height={45} />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-8 items-center">
          {/* Left Column: Heading, Subheading & CTAs */}
          <div className="lg:col-span-7 space-y-6 text-center lg:text-left">
            {/* Playful Floating Badges */}
            <div className="flex flex-wrap items-center justify-center lg:justify-start gap-2.5">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-100/90 text-amber-900 text-xs font-black tracking-wide border border-amber-300 shadow-xs">
                <Sparkles className="w-3.5 h-3.5 text-amber-600" />
                Made for Ages 2–6
              </span>
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-sky-100/90 text-sky-900 text-xs font-black tracking-wide border border-sky-300 shadow-xs">
                <CheckCircle2 className="w-3.5 h-3.5 text-sky-600" />
                Instant PDF Downloads
              </span>
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-100/90 text-emerald-900 text-xs font-black tracking-wide border border-emerald-300 shadow-xs">
                Print Unlimited Times
              </span>
            </div>

            {/* Main Headline */}
            <h1 className="font-heading font-extrabold text-4xl sm:text-5xl lg:text-6xl text-neutral-900 tracking-tight leading-[1.12]">
              Little Hands,
              <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#FF8A65] via-[#E11D48] to-[#9333EA]">
                Big Imagination! 🌈
              </span>
            </h1>

            {/* Subheading */}
            <p className="text-base sm:text-lg lg:text-xl text-neutral-700 font-medium max-w-2xl mx-auto lg:mx-0 leading-relaxed">
              Discover magical printable colouring books, fun worksheets, and creative learning activities
              crafted specially for preschool, nursery, LKG, and UKG children.
            </p>

            {/* Key Value Points */}
            <div className="grid grid-cols-3 gap-2 sm:gap-4 max-w-lg mx-auto lg:mx-0 pt-1 text-left">
              <div className="bg-white/80 backdrop-blur-xs rounded-2xl p-2.5 sm:p-3 border border-amber-200/60 shadow-xs">
                <div className="text-xl sm:text-2xl font-extrabold text-[#FF8A65]">160+</div>
                <div className="text-[11px] sm:text-xs font-bold text-neutral-600">Printable Pages</div>
              </div>
              <div className="bg-white/80 backdrop-blur-xs rounded-2xl p-2.5 sm:p-3 border border-sky-200/60 shadow-xs">
                <div className="text-xl sm:text-2xl font-extrabold text-[#0284C7]">₹29</div>
                <div className="text-[11px] sm:text-xs font-bold text-neutral-600">Starting Price</div>
              </div>
              <div className="bg-white/80 backdrop-blur-xs rounded-2xl p-2.5 sm:p-3 border border-emerald-200/60 shadow-xs">
                <div className="text-xl sm:text-2xl font-extrabold text-[#16A34A]">100%</div>
                <div className="text-[11px] sm:text-xs font-bold text-neutral-600">Screen-Free Fun</div>
              </div>
            </div>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-3 pt-2">
              <button
                onClick={onExploreBooks}
                className="w-full sm:w-auto px-7 py-4 rounded-2xl bg-[#FFD93D] hover:bg-[#ffdf59] text-neutral-900 font-extrabold text-base shadow-md hover:shadow-lg transition-all transform hover:-translate-y-0.5 active:translate-y-0 flex items-center justify-center gap-2 cursor-pointer border-2 border-amber-400"
              >
                <span>Explore Colouring Books</span>
                <ArrowRight className="w-5 h-5" />
              </button>

              <button
                onClick={onExploreSchoolPacks}
                className="w-full sm:w-auto px-7 py-4 rounded-2xl bg-white hover:bg-neutral-50 text-neutral-800 font-extrabold text-base border-2 border-neutral-300 shadow-sm hover:shadow transition-all flex items-center justify-center gap-2 cursor-pointer"
              >
                <span>Explore School Packs</span>
                <ArrowRight className="w-5 h-5 text-neutral-600" />
              </button>
            </div>

            {/* Trust line */}
            <div className="pt-2 flex items-center justify-center lg:justify-start gap-4 text-xs font-bold text-neutral-500">
              <span>Trusted by 4,500+ happy parents</span>
              <span>•</span>
              <span>Playschool approved</span>
              <span>•</span>
              <span>Safe instant checkout</span>
            </div>
          </div>

          {/* Right Column: Visual Showcase Card */}
          <div className="lg:col-span-5 relative">
            {/* Playful Floating Crayons */}
            <div className="absolute -top-6 -left-6 z-20 animate-float hidden sm:block">
              <CrayonMascot color="#FF8A65" size={54} />
            </div>
            <div className="absolute -bottom-6 -right-4 z-20 animate-float-delayed hidden sm:block">
              <CrayonMascot color="#6BCBFF" size={54} />
            </div>

            {/* Central Playful Art Showcase */}
            <div className="relative bg-white rounded-3xl p-6 sm:p-8 shadow-xl border-4 border-amber-200">
              {/* Cute top tape effect */}
              <div className="absolute -top-3 left-1/2 -translate-x-1/2 w-28 h-6 bg-amber-200/70 rounded-sm transform rotate-1" />

              <div className="flex items-center justify-between pb-4 border-b border-neutral-100">
                <div className="flex items-center gap-2">
                  <div className="w-3.5 h-3.5 rounded-full bg-red-400" />
                  <div className="w-3.5 h-3.5 rounded-full bg-amber-400" />
                  <div className="w-3.5 h-3.5 rounded-full bg-emerald-400" />
                </div>
                <span className="text-xs font-black text-amber-800 tracking-wider">
                  SAMPLE PRINTABLE PREVIEW
                </span>
                <span className="text-xs font-bold text-neutral-400">A4 Ready</span>
              </div>

              {/* Two Interactive Preview Sheets */}
              <div className="grid grid-cols-2 gap-3 pt-5">
                <div className="bg-[#FFFDF5] border-2 border-dashed border-amber-300 rounded-2xl p-3 flex flex-col items-center justify-between aspect-[3/4] shadow-xs group hover:border-amber-500 transition-colors">
                  <div className="w-full flex justify-between text-[10px] font-bold text-amber-700">
                    <span>Animal Series</span>
                    <span>Pg 1</span>
                  </div>
                  <div className="w-full flex-1 p-1">
                    <LineArtLion isColoured={true} />
                  </div>
                  <span className="text-[11px] font-extrabold text-neutral-700">Smiling Lion</span>
                </div>

                <div className="bg-[#FFFDF5] border-2 border-dashed border-sky-300 rounded-2xl p-3 flex flex-col items-center justify-between aspect-[3/4] shadow-xs group hover:border-sky-500 transition-colors">
                  <div className="w-full flex justify-between text-[10px] font-bold text-sky-700">
                    <span>Safari Series</span>
                    <span>Pg 2</span>
                  </div>
                  <div className="w-full flex-1 p-1">
                    <LineArtElephant isColoured={false} />
                  </div>
                  <span className="text-[11px] font-extrabold text-neutral-700">Baby Elephant</span>
                </div>
              </div>

              {/* Bottom Card Footer */}
              <div className="mt-5 pt-4 border-t border-neutral-100 flex items-center justify-between">
                <div className="flex items-center gap-2 text-xs font-bold text-neutral-600">
                  <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
                  <span>High-Res 300 DPI Vector PDF</span>
                </div>
                <span className="text-xs font-black text-[#FF8A65]">From ₹29</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
