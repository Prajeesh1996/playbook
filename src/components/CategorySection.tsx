import React from 'react';
import { CATEGORIES_DATA } from '../data/initialData';
import { ProductCategory } from '../types';
import { ArrowRight } from 'lucide-react';
import {
  LineArtLion,
  LineArtAlphabet,
  LineArtNumbers,
  LineArtFruits,
  LineArtVehicle,
} from '../utils/illustrations';

interface CategorySectionProps {
  onSelectCategory: (category: ProductCategory) => void;
  selectedCategory: ProductCategory | 'All';
}

export const CategorySection: React.FC<CategorySectionProps> = ({
  onSelectCategory,
  selectedCategory,
}) => {
  const renderCategoryIcon = (iconType: string) => {
    switch (iconType) {
      case 'lion':
        return <LineArtLion isColoured={true} className="w-12 h-12 sm:w-16 sm:h-16" />;
      case 'alphabet':
        return <LineArtAlphabet isColoured={true} className="w-12 h-12 sm:w-16 sm:h-16" />;
      case 'numbers':
        return <LineArtNumbers isColoured={true} className="w-12 h-12 sm:w-16 sm:h-16" />;
      case 'fruits':
        return <LineArtFruits isColoured={true} className="w-12 h-12 sm:w-16 sm:h-16" />;
      case 'vehicle':
        return <LineArtVehicle isColoured={true} className="w-12 h-12 sm:w-16 sm:h-16" />;
      default:
        return <LineArtLion isColoured={true} className="w-12 h-12 sm:w-16 sm:h-16" />;
    }
  };

  return (
    <section id="categories" className="py-14 sm:py-20 bg-[#FFFDF5]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto mb-10 sm:mb-14">
          <div className="inline-block px-3 py-1 rounded-full bg-amber-100 text-amber-900 text-xs font-black tracking-wide mb-2">
            CURATED PRESCHOOL TOPICS
          </div>
          <h2 className="font-heading font-extrabold text-3xl sm:text-4xl text-neutral-900 tracking-tight">
            Explore a World of Colours! 🎨
          </h2>
          <p className="mt-2 text-sm sm:text-base text-neutral-600 font-medium">
            From adorable safari animals and juicy fruits to phonics alphabet tracing and school packs.
          </p>
        </div>

        {/* Categories Grid (2 columns on mobile, 3-4 on tablet, 6 on desktop) */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-3 sm:gap-5">
          {CATEGORIES_DATA.map((cat) => {
            const isSelected = selectedCategory === cat.id;
            return (
              <div
                key={cat.id}
                style={{ backgroundColor: cat.bgPastel }}
                onClick={() => onSelectCategory(cat.id)}
                className={`group rounded-3xl p-4 sm:p-5 flex flex-col justify-between items-center text-center cursor-pointer border-2 transition-all duration-200 transform hover:-translate-y-1.5 hover:shadow-md ${
                  isSelected
                    ? 'border-neutral-900 shadow-md ring-2 ring-amber-300'
                    : 'border-neutral-200/60 hover:border-neutral-400'
                }`}
              >
                {/* Icon Container */}
                <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl bg-white/90 shadow-xs flex items-center justify-center p-2 mb-3 group-hover:scale-105 transition-transform">
                  {renderCategoryIcon(cat.iconType)}
                </div>

                {/* Category Title */}
                <h3 className="font-heading font-extrabold text-xs sm:text-sm text-neutral-900 leading-snug line-clamp-2 min-h-[2.5rem] flex items-center">
                  {cat.title}
                </h3>

                {/* Explore pill / action */}
                <button
                  type="button"
                  className="mt-3 w-full py-1.5 px-2 rounded-xl bg-white/90 group-hover:bg-neutral-900 text-neutral-800 group-hover:text-white text-[11px] font-extrabold flex items-center justify-center gap-1 transition-colors shadow-2xs"
                >
                  <span>Explore</span>
                  <ArrowRight className="w-3 h-3 transition-transform group-hover:translate-x-0.5" />
                </button>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
