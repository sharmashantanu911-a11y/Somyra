import React from 'react';
import { Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';

interface SEOPageLayoutProps {
  children: React.ReactNode;
}

export const SEOPageLayout: React.FC<SEOPageLayoutProps> = ({ children }) => {
  return (
    <div 
      className="min-h-screen bg-[#080808] text-white flex flex-col justify-between"
      style={{ fontFamily: "'DM Sans', sans-serif" }}
    >
      <Helmet>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700&display=swap" rel="stylesheet" />
      </Helmet>

      {/* Navigation */}
      <header className="border-b border-white/5 bg-[#0D0D0D]/80 backdrop-blur-md sticky top-0 z-50">
        <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-3 hover:opacity-90 transition-opacity">
            <svg className="w-6 h-6 text-[#2DD4BF]" viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
              <path d="M3 3h18v6H9v2h12v10H3v-6h12v-2H3V3z" />
            </svg>
            <span className="text-xl font-bold tracking-tight text-white">Somyra</span>
          </Link>

          <Link 
            to="/?utm_source=seo&utm_medium=organic&utm_campaign=seo-nav" 
            className="px-5 py-2.5 bg-[#2DD4BF] text-black font-bold rounded-xl hover:shadow-[0_0_20px_rgba(45,212,191,0.4)] hover:bg-[#2DD4BF]/90 transition-all text-sm"
          >
            Try Somyra Free
          </Link>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="flex-grow">
        {children}
      </main>

      {/* Footer */}
      <footer className="border-t border-white/5 bg-[#0D0D0D] py-12">
        <div className="max-w-6xl mx-auto px-6">
          <div className="flex flex-col md:flex-row justify-between items-center gap-6 md:gap-0">
            {/* Logo and Credits */}
            <div className="flex flex-col items-center md:items-start gap-2">
              <Link to="/" className="flex items-center gap-2 hover:opacity-90 transition-opacity">
                <svg className="w-5 h-5 text-[#2DD4BF]" viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
                  <path d="M3 3h18v6H9v2h12v10H3v-6h12v-2H3V3z" />
                </svg>
                <span className="text-base font-bold text-white">Somyra</span>
              </Link>
              <p className="text-[11px] text-[#888888] font-bold uppercase tracking-[0.2em] text-center md:text-left">
                Made with ❤️ in India by <a href="https://www.linkedin.com/in/sharmashantanu911" target="_blank" rel="noopener noreferrer" className="text-[#2DD4BF] hover:shadow-[0_0_15px_rgba(45,212,191,0.4)] transition-all">Shantanu Sharma</a>
              </p>
            </div>

            {/* Links */}
            <div className="flex items-center gap-6 md:gap-8">
              <Link 
                to="/terms" 
                className="text-[12px] font-bold uppercase tracking-widest text-[#888888] hover:text-[#2DD4BF] transition-all duration-300"
              >
                Terms
              </Link>
              <Link 
                to="/privacy" 
                className="text-[12px] font-bold uppercase tracking-widest text-[#888888] hover:text-[#2DD4BF] transition-all duration-300"
              >
                Privacy
              </Link>
              <Link 
                to="/contact" 
                className="text-[12px] font-bold uppercase tracking-widest text-[#888888] hover:text-[#2DD4BF] transition-all duration-300"
              >
                Contact
              </Link>
            </div>
          </div>
          
          <div className="mt-8 text-center border-t border-white/5 pt-8">
            <p className="text-[10px] text-[#555555] font-bold uppercase tracking-[0.1em]">
              © 2026 Somyra AI. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
};
