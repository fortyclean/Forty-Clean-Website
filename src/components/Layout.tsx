import React from 'react';
import Header from './Header';
import Footer from './Footer';
import FloatingButtons from './FloatingButtons';

interface LayoutProps {
  children: React.ReactNode;
  variant?: 'landing' | 'cleaning' | 'pest' | 'offers' | 'blog';
}

const Layout = ({ children, variant = 'landing' }: LayoutProps) => {
  return (
    <div className="min-h-screen bg-gray-light text-slate-700 transition-colors duration-300 dark:bg-slate-950 dark:text-slate-100">
      <Header variant={variant === 'offers' || variant === 'blog' ? 'landing' : variant} />
      <main>{children}</main>
      <Footer variant={variant === 'offers' || variant === 'blog' ? 'landing' : variant} />
      <FloatingButtons />
    </div>
  );
};

export default Layout;
