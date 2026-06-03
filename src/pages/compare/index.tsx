import React from 'react';
import { Link } from 'react-router-dom';
import { competitors } from '../../data/compareData';
import { SEOPageLayout } from '../../components/seo/SEOPageLayout';
import { SEO } from '../../components/SEO';

const CompareIndexPage: React.FC = () => {
  return (
    <SEOPageLayout>
      <SEO
        title="Somyra vs Competitors — Honest LinkedIn Tool Comparisons | Somyra"
        description="See how Somyra stacks up against Taplio, Hootsuite, Buffer, and 11 other LinkedIn tools. Honest feature-by-feature comparisons to help you choose."
        canonical="https://somyra.online/compare"
      />

      <section className="relative overflow-hidden py-24 sm:py-32 bg-[#080808]">
        <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[550px] h-[550px] bg-[#2DD4BF]/5 rounded-full blur-[140px] pointer-events-none" />
        <div className="max-w-4xl mx-auto px-6 text-center relative z-10">
          <h1 className="text-4xl sm:text-6xl font-semibold tracking-tight text-white mb-6 leading-tight">
            Somyra vs The Competition
          </h1>
          <p className="text-lg sm:text-xl text-[#888888] max-w-2xl mx-auto leading-relaxed font-medium">
            Honest, transparent comparisons. See how Somyra stacks up against every major LinkedIn growth tool.
          </p>
        </div>
      </section>

      <section className="py-20 bg-[#0D0D0D] border-t border-white/5">
        <div className="max-w-6xl mx-auto px-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {competitors.map((competitor) => (
              <Link
                key={competitor.id}
                to={`/compare/somyra-vs-${competitor.id}`}
                className="group bg-[#141414] border border-white/5 rounded-2xl p-6 hover:border-[#2DD4BF]/20 transition-all hover:shadow-[0_0_30px_rgba(45,212,191,0.05)]"
              >
                <h3 className="text-lg font-bold text-white mb-2 group-hover:text-[#2DD4BF] transition-colors">
                  Somyra vs {competitor.name}
                </h3>
                <p className="text-sm text-[#888888] leading-relaxed line-clamp-2">
                  {competitor.comparison.description}
                </p>
                <div className="mt-4 text-[#2DD4BF] text-sm font-semibold group-hover:translate-x-1 transition-transform">
                  Compare &rarr;
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>
    </SEOPageLayout>
  );
};

export default CompareIndexPage;
