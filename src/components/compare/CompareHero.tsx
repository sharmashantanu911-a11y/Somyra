import React, { useEffect, useRef, useState } from 'react';
import { Scale } from 'lucide-react';

interface CompareHeroProps {
  tagline: string;
  description: string;
  competitorName: string;
}

export const CompareHero: React.FC<CompareHeroProps> = ({ tagline, description, competitorName }) => {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) setVisible(true); },
      { threshold: 0.1 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return (
    <section className="relative overflow-hidden py-24 sm:py-32 bg-[#080808]">
      <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[550px] h-[550px] bg-[#2DD4BF]/5 rounded-full blur-[140px] pointer-events-none" />
      <div ref={ref} className="max-w-4xl mx-auto px-6 text-center relative z-10">
        <div className={`transition-all duration-800 ease-out ${visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
          <div className="type-overline inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#2DD4BF]/10 border border-[#2DD4BF]/20 text-[#2DD4BF] mb-6">
            <Scale className="w-3.5 h-3.5" />
            Honest Competitor Comparison
          </div>
          <h1 className="text-4xl sm:text-6xl font-semibold tracking-tight text-white mb-6 leading-tight">
            {tagline.split(':')[0]}:<br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#2DD4BF] to-teal-400">
              {tagline.split(':')[1] || tagline}
            </span>
          </h1>
          <p className="text-lg sm:text-xl text-[#888888] max-w-2xl mx-auto mb-10 leading-relaxed font-medium">
            {description}
          </p>
          <p className="type-caption text-[#555555]">
            This comparison is accurate as of 2026. We update it regularly.
          </p>
        </div>
      </div>
    </section>
  );
};
