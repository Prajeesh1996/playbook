import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';

export type RouteType =
  | 'home'
  | 'books'
  | 'product'
  | 'category'
  | 'schools'
  | 'about'
  | 'contact'
  | 'my-downloads'
  | 'admin'
  | 'legal';

export interface RouteState {
  type: RouteType;
  path: string;
  params: Record<string, string>;
  query: Record<string, string>;
}

interface RouterContextType {
  route: RouteState;
  navigate: (path: string, options?: { replace?: boolean; scrollToTop?: boolean }) => void;
}

const RouterContext = createContext<RouterContextType | undefined>(undefined);

function parsePath(pathname: string, search: string): RouteState {
  const queryParams: Record<string, string> = {};
  if (search) {
    const searchParams = new URLSearchParams(search);
    searchParams.forEach((val, key) => {
      queryParams[key] = val;
    });
  }

  // Clean trailing slashes
  const cleanPath = pathname.length > 1 && pathname.endsWith('/') ? pathname.slice(0, -1) : pathname;

  // Support query parameter fallback (e.g. /?book=slug, /?category=slug, /?page=about)
  if (queryParams.book) {
    return {
      type: 'product',
      path: `/book/${queryParams.book}`,
      params: { slug: queryParams.book },
      query: queryParams,
    };
  }
  if (queryParams.category) {
    return {
      type: 'category',
      path: `/category/${queryParams.category}`,
      params: { slug: queryParams.category },
      query: queryParams,
    };
  }
  if (queryParams.page) {
    const page = queryParams.page;
    if (page === 'schools' || page === 'about' || page === 'contact' || page === 'my-downloads' || page === 'admin' || page === 'books') {
      return {
        type: page as RouteType,
        path: `/${page}`,
        params: {},
        query: queryParams,
      };
    }
  }

  // Clean URL matching
  if (cleanPath === '' || cleanPath === '/' || cleanPath === '/home') {
    return { type: 'home', path: '/', params: {}, query: queryParams };
  }

  if (cleanPath === '/books') {
    return { type: 'books', path: '/books', params: {}, query: queryParams };
  }

  // /book/:slug
  const bookMatch = cleanPath.match(/^\/book\/([a-zA-Z0-9_-]+)$/);
  if (bookMatch) {
    return {
      type: 'product',
      path: cleanPath,
      params: { slug: bookMatch[1] },
      query: queryParams,
    };
  }

  // /category/:slug
  const catMatch = cleanPath.match(/^\/category\/([a-zA-Z0-9_-]+)$/);
  if (catMatch) {
    return {
      type: 'category',
      path: cleanPath,
      params: { slug: catMatch[1] },
      query: queryParams,
    };
  }

  if (cleanPath === '/schools' || cleanPath === '/school-packs') {
    return { type: 'schools', path: '/schools', params: {}, query: queryParams };
  }

  if (cleanPath === '/about' || cleanPath === '/about-us') {
    return { type: 'about', path: '/about', params: {}, query: queryParams };
  }

  if (cleanPath === '/contact' || cleanPath === '/contact-us') {
    return { type: 'contact', path: '/contact', params: {}, query: queryParams };
  }

  if (cleanPath === '/my-downloads' || cleanPath === '/downloads') {
    return { type: 'my-downloads', path: '/my-downloads', params: {}, query: queryParams };
  }

  if (cleanPath === '/admin') {
    return { type: 'admin', path: '/admin', params: {}, query: queryParams };
  }

  if (cleanPath === '/privacy-policy') {
    return { type: 'legal', path: '/privacy-policy', params: { doc: 'privacy' }, query: queryParams };
  }
  if (cleanPath === '/terms-and-conditions' || cleanPath === '/terms') {
    return { type: 'legal', path: '/terms-and-conditions', params: { doc: 'terms' }, query: queryParams };
  }
  if (cleanPath === '/refund-policy' || cleanPath === '/refunds') {
    return { type: 'legal', path: '/refund-policy', params: { doc: 'refund' }, query: queryParams };
  }
  if (cleanPath === '/shipping-delivery' || cleanPath === '/shipping') {
    return { type: 'legal', path: '/shipping-delivery', params: { doc: 'shipping' }, query: queryParams };
  }

  // Fallback to home
  return { type: 'home', path: '/', params: {}, query: queryParams };
}

export const RouterProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [route, setRoute] = useState<RouteState>(() => {
    if (typeof window === 'undefined') {
      return { type: 'home', path: '/', params: {}, query: {} };
    }
    return parsePath(window.location.pathname, window.location.search);
  });

  // Listen to browser forward/back buttons
  useEffect(() => {
    const handlePopState = () => {
      setRoute(parsePath(window.location.pathname, window.location.search));
    };

    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  const navigate = useCallback(
    (toPath: string, options?: { replace?: boolean; scrollToTop?: boolean }) => {
      if (typeof window === 'undefined') return;

      const [pathname, search = ''] = toPath.split('?');
      const searchWithQuestion = search ? `?${search}` : '';
      const fullUrl = `${pathname}${searchWithQuestion}`;

      if (options?.replace) {
        window.history.replaceState({}, '', fullUrl);
      } else {
        window.history.pushState({}, '', fullUrl);
      }

      setRoute(parsePath(pathname, searchWithQuestion));

      if (options?.scrollToTop !== false) {
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }
    },
    []
  );

  return <RouterContext.Provider value={{ route, navigate }}>{children}</RouterContext.Provider>;
};

export const useRouter = (): RouterContextType => {
  const ctx = useContext(RouterContext);
  if (!ctx) {
    throw new Error('useRouter must be used within a RouterProvider');
  }
  return ctx;
};
