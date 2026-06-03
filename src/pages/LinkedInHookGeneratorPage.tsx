import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';
import { ChevronDown, ChevronUp, Sparkles, AlertTriangle, ArrowRight, Check, Eye, HelpCircle, FileText, Zap } from 'lucide-react';
import { SEOPageLayout } from '../components/seo/SEOPageLayout';
import { SEO } from '../components/SEO';

interface FAQItem {
  question: string;
  answer: string;
}

const faqData: FAQItem[] = [
  {
    question: "What makes a good LinkedIn hook?",
    answer: "A good LinkedIn hook creates a reason to click \"see more\" — through curiosity, a bold claim, a relatable problem, or a compelling story opening. It should be specific, not generic, and match your natural voice."
  },
  {
    question: "How many hooks does Somyra generate at once?",
    answer: "Somyra generates multiple hook variants simultaneously so you can pick the one that feels most organic for your natural voice, topic, and personal style."
  },
  {
    question: "Does the hook generator work with the post writer?",
    answer: "Yes. Somyra's Topic Generator, Hook Generator, and Post Writer are fully integrated to work together — you can generate a topic, pick a hook direction, then write the full post based on it."
  }
];

const schemaData = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "WebApplication",
      "@id": "https://somyra.online/linkedin-hook-generator#webapp",
      "name": "Somyra LinkedIn Hook Generator",
      "url": "https://somyra.online/linkedin-hook-generator",
      "description": "AI-powered LinkedIn hook generator that creates high-converting scroll-stopping opening lines matched to your voice.",
      "applicationCategory": "BusinessApplication",
      "featureList": ["8 high-converting hook formulas", "Dynamic tone matching", "Instantly copyable hook suggestions", "Knowledge gap creation logic"],
      "offers": {
        "@type": "Offer",
        "price": "0",
        "priceCurrency": "USD"
      }
    },
    {
      "@type": "FAQPage",
      "@id": "https://somyra.online/linkedin-hook-generator#faq",
      "mainEntity": faqData.map(item => ({
        "@type": "Question",
        "name": item.question,
        "acceptedAnswer": {
          "@type": "Answer",
          "text": item.answer
        }
      }))
    }
  ]
};

const LinkedInHookGeneratorPage: React.FC = () => {
  const [activeFAQ, setActiveFAQ] = useState<number | null>(null);

  const toggleFAQ = (index: number) => {
    setActiveFAQ(activeFAQ === index ? null : index);
  };

  return (
    <SEOPageLayout>
      <SEO
        title="LinkedIn Hook Generator — First Lines That Stop the Scroll | Somyra"
        description="Your first line determines if anyone reads your LinkedIn post. Somyra generates scroll-stopping hooks matched to your voice and topic. Free to use."
        canonical="https://somyra.online/linkedin-hook-generator"
        schema={schemaData}
      />

      {/* SECTION 1 — Hero */}
      <section className="relative overflow-hidden py-24 sm:py-32 bg-[#080808]">
        {/* Glow backdrop */}
        <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[550px] h-[550px] bg-[#2DD4BF]/5 rounded-full blur-[140px] pointer-events-none" />

        <div className="max-w-4xl mx-auto px-6 text-center relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#2DD4BF]/10 border border-[#2DD4BF]/20 text-[#2DD4BF] text-xs font-semibold tracking-wider uppercase mb-6">
              <Eye className="w-3.5 h-3.5" />
              Scroll-Stopping Hook Generator
            </div>

            <h1 className="text-4xl sm:text-6xl font-semibold tracking-tight text-white mb-6 leading-tight">
              Your First Line Is Killing <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-red-400 to-[#2DD4BF]">
                Your LinkedIn Posts
              </span>
            </h1>

            <p className="text-lg sm:text-xl text-[#888888] max-w-2xl mx-auto mb-10 leading-relaxed font-medium">
              95% of people decide in 1 second whether to read more. Somyra generates hooks that make them stop, read, and engage.
            </p>

            <div className="mb-12">
              <Link
                to="/?utm_source=seo&utm_medium=organic&utm_campaign=hook-generator"
                className="inline-flex items-center gap-2 px-8 py-4 bg-[#2DD4BF] text-black font-semibold rounded-xl hover:shadow-[0_0_30px_rgba(45,212,191,0.5)] hover:bg-[#2DD4BF]/90 transition-all text-base"
              >
                Generate Hooks Free
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>

            <p className="text-xs sm:text-sm text-[#888888] font-bold uppercase tracking-widest">
              Capture attention, open curiosity loops, and trigger high-converting clicks
            </p>
          </motion.div>
        </div>
      </section>

      {/* SECTION 2 — Why Hooks Matter */}
      <section className="py-20 bg-[#0D0D0D] border-t border-white/5">
        <div className="max-w-4xl mx-auto px-6">
          <div className="bg-[#141414] border border-white/5 rounded-3xl p-8 sm:p-12 relative overflow-hidden flex flex-col md:flex-row items-center gap-8 shadow-2xl">
            {/* HSL Teal stat circle */}
            <div className="flex flex-col items-center justify-center shrink-0 w-32 h-32 rounded-full border border-[#2DD4BF]/20 bg-[#2DD4BF]/5 text-center">
              <span className="text-4xl font-semibold text-[#2DD4BF]">95%</span>
              <span className="type-overline text-[#888888] font-bold">Bounce</span>
            </div>

            <div>
              <h2 className="text-2xl font-semibold text-white mb-4">
                The first 3 lines of your LinkedIn post determine whether 95% of your audience sees anything else.
              </h2>
              <p className="text-slate-400 text-sm leading-relaxed">
                LinkedIn cuts off posts after the first 2–3 lines, hiding the remaining content behind a subtle "see more" button. If your opening doesn't immediately hook your readers, the rest of your post effectively doesn't exist for most people.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* SECTION 3 — Hook Types Somyra Generates */}
      <section className="py-20 bg-[#080808]">
        <div className="max-w-6xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-semibold text-white mb-4">
              8 Hook Formulas That Work on LinkedIn
            </h2>
            <p className="text-slate-400 max-w-xl mx-auto text-base">
              A comprehensive system of psychologically proven, scroll-stopping framework variants.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="bg-[#0D0D0D] p-6 rounded-2xl border border-white/5 flex flex-col justify-between">
              <div>
                <div className="type-overline font-bold text-[#2DD4BF] mb-2">01. The Contrarian</div>
                <p className="text-xs text-[#888888] mb-4 leading-relaxed">
                  Challenges a common industry belief or standard best practice.
                </p>
              </div>
              <div className="border-t border-white/5 pt-4 text-xs italic text-slate-300">
                "Everyone says post every day. That's why most people never grow."
              </div>
            </div>

            <div className="bg-[#0D0D0D] p-6 rounded-2xl border border-white/5 flex flex-col justify-between">
              <div>
                <div className="type-overline font-bold text-[#2DD4BF] mb-2">02. The Number Hook</div>
                <p className="text-xs text-[#888888] mb-4 leading-relaxed">
                  Brings specific, highly credible metrics or statistics to support authority.
                </p>
              </div>
              <div className="border-t border-white/5 pt-4 text-xs italic text-slate-300">
                "I analyzed 200 LinkedIn posts. Here's what the top 1% have in common."
              </div>
            </div>

            <div className="bg-[#0D0D0D] p-6 rounded-2xl border border-white/5 flex flex-col justify-between">
              <div>
                <div className="type-overline font-bold text-[#2DD4BF] mb-2">03. The Story Opening</div>
                <p className="text-xs text-[#888888] mb-4 leading-relaxed">
                  Instantly drops the reader right into a high-stakes, narrative moment.
                </p>
              </div>
              <div className="border-t border-white/5 pt-4 text-xs italic text-slate-300">
                "The client called me at 9pm to cancel. Best thing that ever happened to me."
              </div>
            </div>

            <div className="bg-[#0D0D0D] p-6 rounded-2xl border border-white/5 flex flex-col justify-between">
              <div>
                <div className="type-overline font-bold text-[#2DD4BF] mb-2">04. The Bold Claim</div>
                <p className="text-xs text-[#888888] mb-4 leading-relaxed">
                  Asserts an uncompromising opinion or statement worth debating.
                </p>
              </div>
              <div className="border-t border-white/5 pt-4 text-xs italic text-slate-300">
                "Cold outreach on LinkedIn is not dead. Bad outreach is dead."
              </div>
            </div>

            <div className="bg-[#0D0D0D] p-6 rounded-2xl border border-white/5 flex flex-col justify-between">
              <div>
                <div className="type-overline font-bold text-[#2DD4BF] mb-2">05. The Question</div>
                <p className="text-xs text-[#888888] mb-4 leading-relaxed">
                  Generates an immediate psychological curiosity or knowledge gap.
                </p>
              </div>
              <div className="border-t border-white/5 pt-4 text-xs italic text-slate-300">
                "Why do some founders grow to 50k followers while better ones stay at 300?"
              </div>
            </div>

            <div className="bg-[#0D0D0D] p-6 rounded-2xl border border-white/5 flex flex-col justify-between">
              <div>
                <div className="type-overline font-bold text-[#2DD4BF] mb-2">06. Relatable Struggle</div>
                <p className="text-xs text-[#888888] mb-4 leading-relaxed">
                  Instantly names a universal pain point that your audience struggles with daily.
                </p>
              </div>
              <div className="border-t border-white/5 pt-4 text-xs italic text-slate-300">
                "Staring at a blank post box for 20 minutes is not a content strategy problem."
              </div>
            </div>

            <div className="bg-[#0D0D0D] p-6 rounded-2xl border border-white/5 flex flex-col justify-between">
              <div>
                <div className="type-overline font-bold text-[#2DD4BF] mb-2">07. Value Promise</div>
                <p className="text-xs text-[#888888] mb-4 leading-relaxed">
                  Sets clear expectations and tells the reader exactly what they will gain.
                </p>
              </div>
              <div className="border-t border-white/5 pt-4 text-xs italic text-slate-300">
                "In the next 90 seconds I'll show you the LinkedIn hook formula I use every week."
              </div>
            </div>

            <div className="bg-[#0D0D0D] p-6 rounded-2xl border border-white/5 flex flex-col justify-between">
              <div>
                <div className="type-overline font-bold text-[#2DD4BF] mb-2">08. The Observation</div>
                <p className="text-xs text-[#888888] mb-4 leading-relaxed">
                  Points out a compelling behavioral pattern or industry shift.
                </p>
              </div>
              <div className="border-t border-white/5 pt-4 text-xs italic text-slate-300">
                "LinkedIn posts that start with 'I' consistently outperform posts that start with 'We'."
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* SECTION 4 — FAQ */}
      <section className="py-20 bg-[#0D0D0D] border-t border-b border-white/5">
        <div className="max-w-3xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-semibold text-white mb-4">
              Frequently Asked Questions
            </h2>
            <p className="text-slate-400 max-w-xl mx-auto text-base">
              Everything you need to understand about scroll-stopping openings.
            </p>
          </div>

          <div className="space-y-4">
            {faqData.map((item, index) => (
              <div 
                key={index} 
                className="bg-[#141414] border border-white/5 rounded-2xl overflow-hidden transition-all duration-300"
              >
                <button
                  onClick={() => toggleFAQ(index)}
                  className="w-full flex items-center justify-between p-6 text-left focus:outline-none"
                >
                  <span className="font-bold text-white text-base sm:text-lg">{item.question}</span>
                  {activeFAQ === index ? (
                    <ChevronUp className="w-5 h-5 text-[#2DD4BF] shrink-0 ml-4" />
                  ) : (
                    <ChevronDown className="w-5 h-5 text-[#888888] shrink-0 ml-4" />
                  )}
                </button>

                <AnimatePresence initial={false}>
                  {activeFAQ === index && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.25 }}
                    >
                      <div className="p-6 pt-0 border-t border-white/5 text-sm text-[#888888] leading-relaxed">
                        {item.answer}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* SECTION 5 — CTA */}
      <section className="py-16 sm:py-24 bg-[#080808]">
        <div className="max-w-5xl mx-auto px-6">
          <div className="relative rounded-3xl overflow-hidden p-8 sm:p-16 bg-gradient-to-b from-[#141414] to-[#0D0D0D] border border-white/5 text-center">
            {/* Glow backdrop */}
            <div className="absolute inset-0 bg-radial-at-t from-[#2DD4BF]/5 via-transparent to-transparent pointer-events-none" />
            
            <div className="relative z-10">
              <h2 className="text-3xl sm:text-5xl font-semibold text-white mb-4">
                Write Hooks That Make People Stop Scrolling
              </h2>
              <p className="text-slate-400 text-sm sm:text-base max-w-xl mx-auto mb-8 font-medium">
                Somyra generates tailored openers that trigger curiosity and clicks instantly.
              </p>
              
              <Link
                to="/?utm_source=seo&utm_medium=organic&utm_campaign=hook-generator"
                className="inline-flex items-center gap-2 px-8 py-4 bg-[#2DD4BF] text-black font-semibold rounded-xl hover:shadow-[0_0_30px_rgba(45,212,191,0.5)] hover:bg-[#2DD4BF]/90 transition-all text-base"
              >
                Try Hook Generator Free
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        </div>
      </section>
    </SEOPageLayout>
  );
};

export default LinkedInHookGeneratorPage;
