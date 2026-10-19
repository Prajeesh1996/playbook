import React, { Component, ErrorInfo, ReactNode } from 'react';

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

export class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
    error: null,
  };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('ErrorBoundary caught an unhandled error:', error, errorInfo);
  }

  private handleResetCache = () => {
    try {
      localStorage.removeItem('lcw_products_v3');
      localStorage.removeItem('little_colour_world_cart_v2');
      localStorage.removeItem('little_colour_world_coupon');
    } catch {
      // ignore
    }
    window.location.href = '/';
  };

  private handleReload = () => {
    window.location.reload();
  };

  public render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-[#FFFDF5] text-neutral-800 flex items-center justify-center p-4">
          <div className="max-w-md w-full bg-white rounded-3xl border-2 border-amber-300 p-6 sm:p-8 shadow-xl text-center">
            <div className="w-16 h-16 rounded-full bg-amber-100 mx-auto flex items-center justify-center text-3xl mb-4 shadow-xs">
              🖍️
            </div>
            <h1 className="font-heading font-extrabold text-2xl text-neutral-900 mb-2">
              Oops! Little hiccup...
            </h1>
            <p className="text-sm text-neutral-600 mb-6 font-medium">
              We encountered a minor glitch while loading the page. Don&apos;t worry, your orders and downloads are completely safe!
            </p>

            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <button
                onClick={this.handleReload}
                className="px-5 py-2.5 rounded-xl bg-[#FFD93D] hover:bg-amber-300 text-neutral-900 font-extrabold text-sm shadow-xs transition-transform active:scale-95 cursor-pointer"
              >
                Reload Page
              </button>
              <button
                onClick={this.handleResetCache}
                className="px-5 py-2.5 rounded-xl bg-neutral-100 hover:bg-neutral-200 text-neutral-700 font-bold text-sm transition-colors cursor-pointer"
              >
                Reset &amp; Go Home
              </button>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
