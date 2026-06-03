import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';

interface CTASectionProps {
  slug: string;
  pageType: 'compare' | 'alternative';
}

export const CTASection: React.FC<CTASectionProps> = ({ slug, pageType }) => {
  return (
    <section className="py-16 sm:py-24 bg-[#080808] border-t border-white/5">
      <div className="max-w-5xl mx-auto px-6">
        <div className="relative rounded-3xl overflow-hidden p-8 sm:p-16 bg-gradient-to-b from-[#141414] to-[#0D0D0D] border border-white/5 text-center">
          <div className="absolute inset-0 bg-radial-at-t from-[#2DD4BF]/5 via-transparent to-transparent pointer-events-none" />

          <div className="relative z-10">
            <h2 className="text-3xl sm:text-5xl font-extrabold text-white mb-4">
              Try Somyra Free — No Card Needed
            </h2>
            <p className="text-slate-400 text-sm sm:text-base max-w-xl mx-auto mb-8 font-medium">
              Build your personal brand with tools built specifically for individuals.
            </p>

            <Link
              to={`/?utm_source=seo&utm_medium=organic&utm_campaign=${slug}`}
              className="inline-flex items-center gap-2 px-8 py-4 bg-[#2DD4BF] text-black font-extrabold rounded-xl hover:shadow-[0_0_30px_rgba(45,212,191,0.5)] hover:bg-[#2DD4BF]/90 transition-all text-base mb-2"
            >
              Start Free
              <ArrowRight className="w-4 h-4" />
            </Link>

            <p className="text-xs text-[#555555] font-semibold uppercase tracking-wider">
              Cancel or downgrade any time.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};
