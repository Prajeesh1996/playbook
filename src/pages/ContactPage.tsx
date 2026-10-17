import React, { useEffect } from 'react';
import { ContactSection } from '../components/ContactSection';
import { updatePageSEO } from '../utils/seo';
import { useRouter } from '../context/RouterContext';
import { ChevronRight } from 'lucide-react';

export const ContactPage: React.FC = () => {
  const { navigate } = useRouter();

  useEffect(() => {
    updatePageSEO({
      title: 'Contact Us & Help Center | Little Colour World',
      description:
        'Have a question about printable PDFs, school activity bundles, or payment verification? Get in touch with the Little Colour World team.',
      canonicalPath: '/contact',
      ogType: 'website',
      jsonLd: {
        '@context': 'https://schema.org',
        '@type': 'ContactPage',
        name: 'Little Colour World Customer Support',
        description: 'Customer support and educational inquiries for Little Colour World printables.',
        url: `${window.location.origin}/contact`,
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
        <span className="text-neutral-900 font-extrabold">Contact &amp; Support</span>
      </nav>

      <ContactSection />
    </div>
  );
};
