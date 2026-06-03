import React from 'react';
import { AlertTriangle, Sparkles } from 'lucide-react';
import { PainPoint } from '../../data/compareData';

interface PainPointsProps {
  painPoints: PainPoint[];
  competitorName: string;
}

export const PainPoints: React.FC<PainPointsProps> = ({ painPoints, competitorName }) => {
  return (
    <section className="py-20 bg-[#0D0D0D] border-t border-b border-white/5">
      <div className="max-w-4xl mx-auto px-6">
        <div className="text-center mb-16">
          <h2 className="text-3xl sm:text-4xl font-extrabold text-white mb-4">
            Why Users Are Switching from {competitorName}
          </h2>
          <p className="text-slate-400 max-w-xl mx-auto text-base">
            Common pain points with {competitorName} and how Somyra solves them.
          </p>
        </div>

        <div className="space-y-6">
          {painPoints.map((item, i) => (
            <div key={i} className="bg-[#141414] border border-white/5 rounded-2xl p-6 sm:p-8">
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-xl bg-red-500/10 border border-red-500/20 flex items-center justify-center shrink-0 mt-0.5">
                  <AlertTriangle className="w-5 h-5 text-red-400" />
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="text-white font-bold text-base sm:text-lg mb-3">
                    {item.pain}
                  </h3>
                  <div className="flex items-start gap-3">
                    <Sparkles className="w-4 h-4 text-[#2DD4BF] shrink-0 mt-0.5" />
                    <p className="text-sm text-[#888888] leading-relaxed">{item.somyraSolution}</p>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
