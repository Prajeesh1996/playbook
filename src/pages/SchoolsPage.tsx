import React, { useEffect } from 'react';
import { SchoolPacksSection } from '../components/SchoolPacksSection';
import { updatePageSEO } from '../utils/seo';
import { useRouter } from '../context/RouterContext';
import { ChevronRight } from 'lucide-react';

export const SchoolsPage: React.FC = () => {
  const { navigate } = useRouter();

  useEffect(() => {
    updatePageSEO({
      title: 'School Activity Packs & Preschool Licensing | Little Colour World',
      description:
        'Printable colouring book curriculum packages, classroom activity bundles, and bulk licensing for preschools, daycares, teachers, and nursery institutions.',
      canonicalPath: '/schools',
      ogType: 'website',
      jsonLd: {
        '@context': 'https://schema.org',
        '@type': 'EducationalOccupationalProgram',
        name: 'Little Colour World School Activity Packs',
        description: 'Comprehensive printable preschool coloring and early learning packs for educational institutions.',
        educationalCredentialAwarded: 'Certificate of Little Artist Completion',
        url: `${window.location.origin}/schools`,
      },
    });
  }, []);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6 animate-in fade-in duration-200">
      <nav aria-label="Breadcrumb" className="flex items-center gap-2 text-xs font-bold text-neutral-500">
        <button onClick={() => navigate('/')} className="hover:text-neutral-900 cursor-pointer">
          Home
        </button>
        <ChevronRight className="w-3.5 h-3.5 text-neutral-400 shrink-0" />
        <span className="text-neutral-900 font-extrabold">School Activity Packs</span>
      </nav>

      <SchoolPacksSection />
    </div>
  );
};
