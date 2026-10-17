import React from 'react';
import { Heart, Sparkles, Smile, ShieldCheck, Palette, Scissors } from 'lucide-react';
import { RainbowLogo, CrayonMascot } from '../utils/illustrations';

export const AboutUsSection: React.FC = () => {
  return (
    <section id="about-us" className="py-16 sm:py-24 bg-[#FFFDF5] border-t border-amber-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-14">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-rose-100 text-rose-900 text-xs font-black tracking-wide mb-2">
            <Heart className="w-3.5 h-3.5 text-rose-600 fill-current" />
            OUR STORY &amp; PASSION
          </div>
          <h2 className="font-heading font-extrabold text-3xl sm:text-4xl text-neutral-900 tracking-tight">
            Making Childhood More Colourful! 🌈
          </h2>
          <p className="mt-2 text-base text-neutral-600 font-medium leading-relaxed">
            We believe that early childhood should be filled with physical crayons, paper smiles,
            and screen-free wonder. Every Little Colour World page is designed with gentle love for little toddlers.
          </p>
        </div>

        {/* 3 Pillars */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-16">
          <div className="bg-amber-50/70 rounded-3xl p-6 sm:p-8 border-2 border-amber-200/80 shadow-xs flex flex-col justify-between">
            <div className="w-12 h-12 rounded-2xl bg-amber-200 text-amber-900 flex items-center justify-center mb-4">
              <Palette className="w-6 h-6 text-amber-700" />
            </div>
            <div>
              <h3 className="font-heading font-extrabold text-lg text-neutral-900 mb-2">
                Extra-Bold Outlines
              </h3>
              <p className="text-xs sm:text-sm text-neutral-600 font-medium leading-relaxed">
                Ordinary adult colouring books frustrate 2–4 year olds. Our drawings feature 3x thicker boundary lines and generous spaces so little hands can colour with confidence and pride.
              </p>
            </div>
          </div>

          <div className="bg-sky-50/70 rounded-3xl p-6 sm:p-8 border-2 border-sky-200/80 shadow-xs flex flex-col justify-between">
            <div className="w-12 h-12 rounded-2xl bg-sky-200 text-sky-900 flex items-center justify-center mb-4">
              <Scissors className="w-6 h-6 text-sky-700" />
            </div>
            <div>
              <h3 className="font-heading font-extrabold text-lg text-neutral-900 mb-2">
                Fine Motor Grip Mastery
              </h3>
              <p className="text-xs sm:text-sm text-neutral-600 font-medium leading-relaxed">
                Before children can write letters comfortably in primary school, their hand-eye coordination must develop. Tracing our gentle dotted paths builds natural pencil control without pressure.
              </p>
            </div>
          </div>

          <div className="bg-emerald-50/70 rounded-3xl p-6 sm:p-8 border-2 border-emerald-200/80 shadow-xs flex flex-col justify-between">
            <div className="w-12 h-12 rounded-2xl bg-emerald-200 text-emerald-900 flex items-center justify-center mb-4">
              <Smile className="w-6 h-6 text-emerald-700" />
            </div>
            <div>
              <h3 className="font-heading font-extrabold text-lg text-neutral-900 mb-2">
                100% Screen-Free Calm
              </h3>
              <p className="text-xs sm:text-sm text-neutral-600 font-medium leading-relaxed">
                Colouring activates sensory touch, quiet concentration, and peaceful family table time. Say goodbye to hyper-stimulating digital video loops with healthy printable art.
              </p>
            </div>
          </div>
        </div>

        {/* Parent Reassurance Card */}
        <div className="bg-white rounded-3xl p-8 border-4 border-amber-200 shadow-md flex flex-col md:flex-row items-center gap-8">
          <div className="shrink-0 flex items-center justify-center">
            <RainbowLogo size={90} />
          </div>
          <div className="space-y-2 text-center md:text-left flex-1">
            <h4 className="font-heading font-extrabold text-xl text-neutral-900">
              Created by Parents &amp; Early Educators
            </h4>
            <p className="text-xs sm:text-sm text-neutral-600 leading-relaxed font-medium">
              We started Little Colour World when trying to find clean, cheerful printable worksheets for our own preschool kids. Today, over 4,500 parents and 120 playschools trust our printables daily.
            </p>
            <div className="pt-2 flex flex-wrap items-center justify-center md:justify-start gap-4 text-xs font-black text-neutral-800">
              <span className="flex items-center gap-1.5 text-emerald-700">
                <ShieldCheck className="w-4 h-4" /> Child-Safe Content
              </span>
              <span className="flex items-center gap-1.5 text-sky-700">
                <Sparkles className="w-4 h-4" /> Standard A4 Printer Friendly
              </span>
              <span className="flex items-center gap-1.5 text-purple-700">
                <Heart className="w-4 h-4" /> Lifetime Re-printing
              </span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
