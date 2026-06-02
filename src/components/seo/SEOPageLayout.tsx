import React from 'react';
import { Link } from 'react-router-dom';
import SomyraFooter from '../SomyraFooter';

interface SEOPageLayoutProps {
  children: React.ReactNode;
}

export const SEOPageLayout: React.FC<SEOPageLayoutProps> = ({ children }) => {
  return (
    <div className="min-h-screen bg-[#080808] text-white flex flex-col justify-between font-sans">

      {/* Navigation */}
      <header className="border-b border-white/5 bg-[#0D0D0D]/80 backdrop-blur-md sticky top-0 z-50">
        <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-3 hover:opacity-90 transition-opacity">
            <svg className="w-6 h-6 text-[#2DD4BF]" viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
              <path d="M3 3h18v6H9v2h12v10H3v-6h12v-2H3V3z" />
            </svg>
            <span className="text-xl font-bold tracking-tight text-white">Somyra</span>
          </Link>

          <div className="flex items-center gap-6">
            <Link to="/blog" className="text-sm font-bold text-[#888888] hover:text-[#2DD4BF] transition-colors">
              Blog
            </Link>
            <Link 
              to="/?utm_source=seo&utm_medium=organic&utm_campaign=seo-nav" 
              className="px-5 py-2.5 bg-[#2DD4BF] text-black font-bold rounded-xl hover:shadow-[0_0_20px_rgba(45,212,191,0.4)] hover:bg-[#2DD4BF]/90 transition-all text-sm"
            >
              Try Somyra Free
            </Link>
          </div>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="flex-grow">
        {children}
      </main>

      {/* Footer */}
      <SomyraFooter />
    </div>
  );
};
