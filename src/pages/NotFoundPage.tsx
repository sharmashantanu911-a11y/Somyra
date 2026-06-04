import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'motion/react';
import { ArrowRight, Compass } from 'lucide-react';
import { SEOPageLayout } from '../components/seo/SEOPageLayout';
import { SEO } from '../components/SEO';

const NotFoundPage: React.FC = () => {
  return (
    <SEOPageLayout>
      <SEO
        title="Page Not Found | Somyra"
        description="This page doesn't exist. Head back to Somyra and keep building your LinkedIn presence."
        canonical="https://somyra.online/404"
        noIndex={true}
      />

      <section className="relative min-h-[70vh] flex items-center justify-center bg-[#080808] overflow-hidden py-24">
        {/* Glow backdrop */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-[#2DD4BF]/5 rounded-full blur-[130px] pointer-events-none" />

        <div className="max-w-md mx-auto px-6 text-center relative z-10">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6 }}
          >
            <div className="w-16 h-16 rounded-2xl bg-[#2DD4BF]/10 flex items-center justify-center mb-8 mx-auto text-[#2DD4BF]">
              <Compass className="w-8 h-8 animate-pulse" />
            </div>

            <h1 className="text-7xl sm:text-9xl font-semibold tracking-tight text-[#2DD4BF] mb-4">
              404
            </h1>

            <h2 className="text-2xl sm:text-3xl font-semibold text-white mb-3">
              This page doesn't exist
            </h2>

            <p className="text-sm sm:text-base text-[#888888] mb-10 leading-relaxed font-medium">
              But your LinkedIn presence should. Let's fix that.
            </p>

            <Link
              to="/"
              className="inline-flex items-center gap-2 px-8 py-4 bg-[#2DD4BF] text-black font-semibold rounded-xl hover:shadow-[0_0_30px_rgba(45,212,191,0.5)] hover:bg-[#2DD4BF]/90 transition-all text-base"
            >
              Go Back to Somyra
              <ArrowRight className="w-4.5 h-4.5" />
            </Link>
          </motion.div>
        </div>
      </section>
    </SEOPageLayout>
  );
};

export default NotFoundPage;
