import React from 'react';
import { Check, X } from 'lucide-react';
import { FeatureRow } from '../../data/compareData';

interface ComparisonTableProps {
  features: FeatureRow[];
  competitorName: string;
}

export const ComparisonTable: React.FC<ComparisonTableProps> = ({ features, competitorName }) => {
  const renderValue = (value: string, winner: 'somyra' | 'competitor' | 'tie', side: 'somyra' | 'competitor') => {
    const isWinner = winner === side;
    const color = side === 'somyra' ? 'text-[#2DD4BF]' : 'text-slate-300';
    const notAvailColor = side === 'somyra' ? 'text-red-400' : 'text-red-400';

    if (value === 'Yes') {
      return <span className={`inline-flex items-center gap-1.5 ${color} font-semibold`}><Check className="w-4 h-4 shrink-0" /> Yes</span>;
    }
    if (value === 'No') {
      return <span className={`inline-flex items-center gap-1.5 ${notAvailColor} font-semibold`}><X className="w-4 h-4 shrink-0" /> No</span>;
    }
    return <span className={`${isWinner ? color : 'text-slate-400'} font-semibold`}>{value}</span>;
  };

  return (
    <section className="py-20 bg-[#080808]">
      <div className="max-w-5xl mx-auto px-6">
        <div className="text-center mb-16">
          <h2 className="text-3xl sm:text-4xl font-extrabold text-white mb-4">
            Side-by-Side Comparison
          </h2>
          <p className="text-slate-400 max-w-xl mx-auto text-base">
            A transparent review of core features, capabilities, and pricing metrics.
          </p>
        </div>

        <div className="overflow-x-auto border border-white/5 rounded-2xl bg-[#0D0D0D]">
          <table className="w-full text-left border-collapse text-sm min-w-[600px]">
            <thead>
              <tr className="border-b border-white/5 bg-[#141414]">
                <th className="p-4 sm:p-5 font-bold text-white uppercase tracking-wider">Feature</th>
                <th className="p-4 sm:p-5 font-bold text-[#2DD4BF] uppercase tracking-wider">Somyra</th>
                <th className="p-4 sm:p-5 font-bold text-[#888888] uppercase tracking-wider">{competitorName}</th>
              </tr>
            </thead>
            <tbody>
              {features.map((row, i) => (
                <tr key={i} className={`border-b border-white/5 hover:bg-white/5 transition-colors ${i % 2 === 1 ? 'bg-[#141414]/20' : ''}`}>
                  <td className="p-4 sm:p-5 font-bold text-white">{row.feature}</td>
                  <td className="p-4 sm:p-5">{renderValue(row.somyra, row.winner, 'somyra')}</td>
                  <td className="p-4 sm:p-5">{renderValue(row.competitor, row.winner, 'competitor')}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </section>
  );
};
