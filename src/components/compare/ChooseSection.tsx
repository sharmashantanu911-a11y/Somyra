import React from 'react';

interface ChooseSectionProps {
  chooseSomyra: string[];
  chooseCompetitor: string[];
  competitorName: string;
}

export const ChooseSection: React.FC<ChooseSectionProps> = ({ chooseSomyra, chooseCompetitor, competitorName }) => {
  return (
    <section className="py-20 bg-[#0D0D0D] border-t border-b border-white/5">
      <div className="max-w-6xl mx-auto px-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
          <div>
            <h3 className="text-2xl font-semibold text-white mb-6 border-b border-white/5 pb-4">
              Choose Somyra if...
            </h3>
            <ul className="space-y-4 text-sm text-[#888888]">
              {chooseSomyra.map((point, i) => (
                <li key={i} className="flex items-start gap-3">
                  <span className="w-2 h-2 rounded-full bg-[#2DD4BF] mt-1.5 shrink-0" />
                  <span>{point}</span>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="text-2xl font-semibold text-white mb-6 border-b border-white/5 pb-4">
              Choose {competitorName} if...
            </h3>
            <ul className="space-y-4 text-sm text-[#888888]">
              {chooseCompetitor.map((point, i) => (
                <li key={i} className="flex items-start gap-3">
                  <span className="w-2 h-2 rounded-full bg-[#888888] mt-1.5 shrink-0" />
                  <span>{point}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
};
