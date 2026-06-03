import React from 'react';
import { Check } from 'lucide-react';

interface WhySomyraProps {
  features: { feature: string; description: string }[];
}

export const WhySomyra: React.FC<WhySomyraProps> = ({ features }) => {
  return (
    <section className="py-20 bg-[#080808]">
      <div className="max-w-5xl mx-auto px-6">
        <div className="text-center mb-16">
          <h2 className="text-3xl sm:text-4xl font-semibold text-white mb-4">
            Why Somyra?
          </h2>
          <p className="text-slate-400 max-w-xl mx-auto text-base">
            Here's what makes Somyra the smarter choice for LinkedIn growth.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {features.map((item, i) => (
            <div key={i} className="bg-[#141414] border border-white/5 rounded-2xl p-6 hover:border-[#2DD4BF]/20 transition-colors">
              <div className="flex items-start gap-4">
                <div className="w-8 h-8 rounded-lg bg-[#2DD4BF]/10 border border-[#2DD4BF]/20 flex items-center justify-center shrink-0">
                  <Check className="w-4 h-4 text-[#2DD4BF]" />
                </div>
                <div>
                  <h3 className="text-white font-semibold text-base mb-2">{item.feature}</h3>
                  <p className="text-sm text-[#888888] leading-relaxed">{item.description}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
