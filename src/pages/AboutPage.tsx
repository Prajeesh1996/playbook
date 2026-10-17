import React, { useEffect } from 'react';
import { AboutUsSection } from '../components/AboutUsSection';
import { updatePageSEO } from '../utils/seo';
import { useRouter } from '../context/RouterContext';
import { ChevronRight } from 'lucide-react';

export const AboutPage: React.FC = () => {
  const { navigate } = useRouter();

  useEffect(() => {
    updatePageSEO({
      title: 'About Us – Little Colour World (Little Hands, Big Imagination!)',
      description:
        'Learn how Little Colour World brings joyful screen-free learning, fine motor skill development, and creative confidence to preschool and nursery children across India.',
      canonicalPath: '/about',
      ogType: 'website',
      jsonLd: {
        '@context': 'https://schema.org',
        '@type': 'AboutPage',
        name: 'About Little Colour World',
        description: 'Screen-free printable coloring books and early learning worksheets for children ages 2 to 6.',
        url: `${window.location.origin}/about`,
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
        <span className="text-neutral-900 font-extrabold">About Little Colour World</span>
      </nav>

      <AboutUsSection />
    </div>
  );
};
