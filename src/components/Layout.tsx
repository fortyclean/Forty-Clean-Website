import React, { Suspense, lazy, useEffect, useState } from 'react';
import Header from './Header';

const Footer = lazy(() => import('./Footer'));
const FloatingButtons = lazy(() => import('./FloatingButtons'));

interface LayoutProps {
  children: React.ReactNode;
  variant?: 'landing' | 'cleaning' | 'pest' | 'offers' | 'blog' | 'pricing';
}

const Layout = ({ children, variant = 'landing' }: LayoutProps) => {
  const [showFloatingButtons, setShowFloatingButtons] = useState(false);

  useEffect(() => {
    const enableFloatingButtons = () => {
      setShowFloatingButtons(true);
    };

    const idleWindow = window as Window & {
      requestIdleCallback?: (callback: IdleRequestCallback, options?: IdleRequestOptions) => number;
      cancelIdleCallback?: (handle: number) => void;
    };

    if (typeof idleWindow.requestIdleCallback === 'function') {
      const idleId = idleWindow.requestIdleCallback(enableFloatingButtons, { timeout: 1200 });
      return () => {
        idleWindow.cancelIdleCallback?.(idleId);
      };
    }

    const timeoutId = setTimeout(enableFloatingButtons, 700);
    return () => {
      clearTimeout(timeoutId);
    };
  }, []);

  return (
    <div className="min-h-screen bg-gray-light text-slate-700 transition-colors duration-300 dark:bg-slate-950 dark:text-slate-100">
      <Header variant={variant === 'offers' || variant === 'blog' || variant === 'pricing' ? 'landing' : variant} />
      <main>{children}</main>
      <Suspense fallback={null}>
        <Footer variant={variant === 'offers' || variant === 'blog' || variant === 'pricing' ? 'landing' : variant} />
      </Suspense>
      {showFloatingButtons ? (
        <Suspense fallback={null}>
          <FloatingButtons />
        </Suspense>
      ) : null}
    </div>
  );
};

export default Layout;
