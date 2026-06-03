import React, { useState } from 'react';
import { ChevronDown, ChevronUp } from 'lucide-react';
import { FAQ as FAQType } from '../../data/compareData';

interface FAQSectionProps {
  faqs: FAQType[];
  title?: string;
  subtitle?: string;
}

export const FAQSection: React.FC<FAQSectionProps> = ({
  faqs,
  title = 'Frequently Asked Questions',
  subtitle = 'Got questions? We\'ve got answers.'
}) => {
  const [activeFAQ, setActiveFAQ] = useState<number | null>(null);

  const toggleFAQ = (index: number) => {
    setActiveFAQ(activeFAQ === index ? null : index);
  };

  return (
    <section className="py-20 bg-[#080808]">
      <div className="max-w-3xl mx-auto px-6">
        <div className="text-center mb-16">
          <h2 className="text-3xl sm:text-4xl font-semibold text-white mb-4">
            {title}
          </h2>
          <p className="text-slate-400 max-w-xl mx-auto text-base">
            {subtitle}
          </p>
        </div>

        <div className="space-y-4">
          {faqs.map((item, index) => (
            <div
              key={index}
              className="bg-[#0D0D0D] border border-white/5 rounded-2xl overflow-hidden transition-all duration-300"
            >
              <button
                onClick={() => toggleFAQ(index)}
                className="w-full flex items-center justify-between p-6 text-left focus:outline-none"
              >
                <span className="font-semibold text-white text-base sm:text-lg">{item.question}</span>
                {activeFAQ === index ? (
                  <ChevronUp className="w-5 h-5 text-[#2DD4BF] shrink-0 ml-4" />
                ) : (
                  <ChevronDown className="w-5 h-5 text-[#888888] shrink-0 ml-4" />
                )}
              </button>
              <div
                className={`transition-all duration-300 ease-in-out overflow-hidden ${
                  activeFAQ === index ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'
                }`}
              >
                {activeFAQ === index && (
                  <div className="p-6 pt-0 border-t border-white/5 text-sm text-[#888888] leading-relaxed">
                    {item.answer}
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
