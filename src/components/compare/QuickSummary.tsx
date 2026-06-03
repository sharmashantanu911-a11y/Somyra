import React from 'react';
import { Link } from 'react-router-dom';

interface QuickSummaryProps {
  summarySomyra: { label: string; value: string }[];
  summaryCompetitor: { label: string; value: string }[];
  competitorName: string;
  slug: string;
}

const SomyraLogo: React.FC = () => (
  <svg className="w-6 h-6 text-[#2DD4BF]" viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
    <path d="M3 3h18v6H9v2h12v10H3v-6h12v-2H3V3z" />
  </svg>
);

export const QuickSummary: React.FC<QuickSummaryProps> = ({ summarySomyra, summaryCompetitor, competitorName, slug }) => {
  return (
    <section className="py-20 bg-[#0D0D0D] border-t border-white/5">
      <div className="max-w-6xl mx-auto px-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="bg-[#141414] border border-[#2DD4BF]/20 shadow-[0_0_30px_rgba(45,212,191,0.05)] rounded-3xl p-8 flex flex-col justify-between h-full">
            <div>
              <h3 className="text-2xl font-bold text-white mb-4 flex items-center gap-2">
                <SomyraLogo />
                Somyra
              </h3>
              <ul className="space-y-4 text-sm mb-8">
                {summarySomyra.map((item, i) => (
                  <li key={i} className="flex items-start gap-3">
                    <span className="text-[#888888] font-bold w-28 shrink-0">{item.label}:</span>
                    <span className="text-slate-300">{item.value}</span>
                  </li>
                ))}
              </ul>
            </div>
            <Link
              to="/?utm_source=seo&utm_medium=organic&utm_campaign=compare"
              className="block w-full py-3.5 bg-[#2DD4BF] text-black font-extrabold rounded-xl hover:shadow-[0_0_20px_rgba(45,212,191,0.3)] hover:bg-[#2DD4BF]/90 text-center transition-all text-sm"
            >
              Try Somyra Free
            </Link>
          </div>

          <div className="bg-[#141414] border border-white/5 rounded-3xl p-8 flex flex-col justify-between h-full">
            <div>
              <h3 className="text-2xl font-bold text-white mb-4">{competitorName}</h3>
              <ul className="space-y-4 text-sm mb-8">
                {summaryCompetitor.map((item, i) => (
                  <li key={i} className="flex items-start gap-3">
                    <span className="text-[#888888] font-bold w-28 shrink-0">{item.label}:</span>
                    <span className="text-slate-400">{item.value}</span>
                  </li>
                ))}
              </ul>
            </div>
            <div className="text-xs text-center text-[#555555] font-semibold py-3 border border-white/5 rounded-xl uppercase tracking-wider">
              Visit {competitorName}'s Website
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
