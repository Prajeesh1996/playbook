/**
 * Dynamic SEO and Metadata Manager
 * Updates document title, meta descriptions, canonical links, OpenGraph, Twitter cards,
 * and Schema.org structured data (JSON-LD) dynamically per page.
 */

export interface SEOConfig {
  title: string;
  description: string;
  canonicalPath?: string;
  ogType?: 'website' | 'product' | 'article';
  image?: string;
  jsonLd?: Record<string, any> | Array<Record<string, any>>;
}

const DEFAULT_DESCRIPTION =
  'Discover magical printable colouring books, fun worksheets, and creative learning activities for preschool, nursery, LKG, and UKG children. Instant PDF downloads.';

export function updatePageSEO(config: SEOConfig): void {
  if (typeof document === 'undefined') return;

  const origin = window.location.origin;
  const canonicalUrl = config.canonicalPath
    ? `${origin}${config.canonicalPath.startsWith('/') ? config.canonicalPath : `/${config.canonicalPath}`}`
    : window.location.href.split('?')[0];

  // 1. Page Title
  document.title = config.title;

  // 2. Meta Description
  let metaDesc = document.querySelector('meta[name="description"]');
  if (!metaDesc) {
    metaDesc = document.createElement('meta');
    metaDesc.setAttribute('name', 'description');
    document.head.appendChild(metaDesc);
  }
  metaDesc.setAttribute('content', config.description || DEFAULT_DESCRIPTION);

  // 3. Canonical Link
  let canonicalLink = document.querySelector('link[rel="canonical"]');
  if (!canonicalLink) {
    canonicalLink = document.createElement('link');
    canonicalLink.setAttribute('rel', 'canonical');
    document.head.appendChild(canonicalLink);
  }
  canonicalLink.setAttribute('href', canonicalUrl);

  // 4. OpenGraph Tags
  setMetaTag('property', 'og:title', config.title);
  setMetaTag('property', 'og:description', config.description || DEFAULT_DESCRIPTION);
  setMetaTag('property', 'og:url', canonicalUrl);
  setMetaTag('property', 'og:type', config.ogType || 'website');
  setMetaTag('property', 'og:site_name', 'Little Colour World');

  // 5. Twitter Card Tags
  setMetaTag('name', 'twitter:card', 'summary_large_image');
  setMetaTag('name', 'twitter:title', config.title);
  setMetaTag('name', 'twitter:description', config.description || DEFAULT_DESCRIPTION);

  // 6. Schema.org JSON-LD Structured Data
  let ldScript = document.getElementById('dynamic-jsonld-schema') as HTMLScriptElement | null;
  if (!ldScript) {
    ldScript = document.createElement('script');
    ldScript.id = 'dynamic-jsonld-schema';
    ldScript.type = 'application/ld+json';
    document.head.appendChild(ldScript);
  }

  if (config.jsonLd) {
    ldScript.textContent = JSON.stringify(config.jsonLd, null, 2);
  } else {
    // Default WebSite Schema
    ldScript.textContent = JSON.stringify(
      {
        '@context': 'https://schema.org',
        '@type': 'WebPage',
        name: config.title,
        description: config.description || DEFAULT_DESCRIPTION,
        url: canonicalUrl,
        publisher: {
          '@type': 'Organization',
          name: 'Little Colour World',
          url: origin,
        },
      },
      null,
      2
    );
  }
}

function setMetaTag(attrName: 'name' | 'property', attrValue: string, content: string): void {
  let element = document.querySelector(`meta[${attrName}="${attrValue}"]`);
  if (!element) {
    element = document.createElement('meta');
    element.setAttribute(attrName, attrValue);
    document.head.appendChild(element);
  }
  element.setAttribute('content', content);
}
