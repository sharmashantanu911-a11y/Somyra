import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';
import { ChevronDown, ChevronUp, Sparkles, AlertTriangle, ArrowRight, Check, X, Scale } from 'lucide-react';
import { SEOPageLayout } from '../../components/seo/SEOPageLayout';
import { SEO } from '../../components/SEO';

interface FAQItem {
  question: string;
  answer: string;
}

const faqData: FAQItem[] = [
  {
    question: "Is Somyra actually free?",
    answer: "Yes. Somyra's free plan includes profile audits, post writing, topic generation, and smart outreach — with monthly limits. No credit card required."
  },
  {
    question: "What's the main difference between Somyra and Taplio?",
    answer: "Somyra is built for individuals who want authentic LinkedIn presence — with Voice Profile learning, profile auditing, and outreach tools. Taplio is built more for teams and agencies managing content at scale."
  },
  {
    question: "Does Somyra have analytics like Taplio?",
    answer: "Somyra has a LinkedIn Growth Tracker for Pro and Max users. It's focused on personal brand metrics rather than multi-account team analytics."
  }
];

const schemaData = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "FAQPage",
      "@id": "https://somyra.online/compare/somyra-vs-taplio#faq",
      "mainEntity": faqData.map(item => ({
        "@type": "Question",
        "name": item.question,
        "acceptedAnswer": {
          "@type": "Answer",
          "text": item.answer
        }
      }))
    },
    {
      "@type": "Product",
      "@id": "https://somyra.online/compare/somyra-vs-taplio#product",
      "name": "Somyra",
      "description": "AI-powered LinkedIn growth platform for individuals",
        "offers": {
          "@type": "AggregateOffer",
          "lowPrice": "0",
          "highPrice": "39",
          "priceCurrency": "USD"
        },
        "aggregateRating": {
          "@type": "AggregateRating",
          "ratingValue": "4.7",
          "reviewCount": "47",
          "bestRating": "5",
          "worstRating": "1"
        },
        "review": {
          "@type": "Review",
          "author": {
            "@type": "Person",
            "name": "Verified User"
          },
          "reviewRating": {
            "@type": "Rating",
            "ratingValue": "5",
            "bestRating": "5"
          },
          "reviewBody": "Somyra completely changed how I approach LinkedIn. My profile views doubled in 3 weeks."
        }
    }
  ]
};

const CompareTaplioPage: React.FC = () => {
  const [activeFAQ, setActiveFAQ] = useState<number | null>(null);

  const toggleFAQ = (index: number) => {
    setActiveFAQ(activeFAQ === index ? null : index);
  };

  return (
    <SEOPageLayout>
      <SEO
        title="Somyra vs Taplio: Which LinkedIn Tool Is Right for You | Somyra"
        description="Somyra vs Taplio: honest comparison of features, pricing, and who each tool is built for. Find out which LinkedIn AI tool actually fits your needs."
        canonical="https://somyra.online/compare/somyra-vs-taplio"
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
              <Scale className="w-3.5 h-3.5" />
              Honest Competitor Comparison
            </div>

            <h1 className="text-4xl sm:text-6xl font-semibold tracking-tight text-white mb-6 leading-tight">
              Somyra vs Taplio: <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#2DD4BF] to-teal-400">
                An Honest Comparison
              </span>
            </h1>

            <p className="text-lg sm:text-xl text-[#888888] max-w-2xl mx-auto mb-10 leading-relaxed font-medium">
              Both tools help with LinkedIn content. Here's exactly how they differ — so you can pick what's right for you.
            </p>

            <p className="text-xs sm:text-sm text-[#555555] font-semibold tracking-widest uppercase">
              This comparison is accurate as of 2026. We update it regularly.
            </p>
          </motion.div>
        </div>
      </section>

      {/* SECTION 2 — Quick Summary Cards */}
      <section className="py-20 bg-[#0D0D0D] border-t border-white/5">
        <div className="max-w-6xl mx-auto px-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Somyra summary */}
            <div className="bg-[#141414] border border-[#2DD4BF]/20 shadow-[0_0_30px_rgba(45,212,191,0.05)] rounded-3xl p-8 flex flex-col justify-between h-full">
              <div>
                <h3 className="text-2xl font-bold text-white mb-4 flex items-center gap-2">
                  <svg className="w-6 h-6 text-[#2DD4BF]" viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
                    <path d="M3 3h18v6H9v2h12v10H3v-6h12v-2H3V3z" />
                  </svg>
                  Somyra
                </h3>

                <ul className="space-y-4 text-sm mb-8">
                  <li className="flex items-start gap-3">
                    <span className="text-[#888888] font-bold w-28 shrink-0">Best for:</span>
                    <span className="text-slate-300">Solo founders and professionals who want organic posts that sound like themselves</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="text-[#888888] font-bold w-28 shrink-0">Starting price:</span>
                    <span className="text-slate-300">Free forever plan (Pro starts from $19/mo)</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="text-[#888888] font-bold w-28 shrink-0">Voice learning:</span>
                    <span className="text-slate-300">Yes — high-fidelity Voice Profile cloning system</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="text-[#888888] font-bold w-28 shrink-0">Profile Audit:</span>
                    <span className="text-slate-300">Yes — instant grader & optimization strategy</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="text-[#888888] font-bold w-28 shrink-0">Smart Outreach:</span>
                    <span className="text-slate-300">Yes — relevance-first hook & DM generator</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="text-[#888888] font-bold w-28 shrink-0">Analytics:</span>
                    <span className="text-slate-300">LinkedIn Growth Tracker (Pro/Max)</span>
                  </li>
                </ul>
              </div>

              <Link
                to="/?utm_source=seo&utm_medium=organic&utm_campaign=compare-taplio"
                className="block w-full py-3.5 bg-[#2DD4BF] text-black font-semibold rounded-xl hover:shadow-[0_0_20px_rgba(45,212,191,0.3)] hover:bg-[#2DD4BF]/90 text-center transition-all text-sm"
              >
                Try Somyra Free
              </Link>
            </div>

            {/* Taplio summary */}
            <div className="bg-[#141414] border border-white/5 rounded-3xl p-8 flex flex-col justify-between h-full">
              <div>
                <h3 className="text-2xl font-bold text-white mb-4">Taplio</h3>

                <ul className="space-y-4 text-sm mb-8">
                  <li className="flex items-start gap-3">
                    <span className="text-[#888888] font-bold w-28 shrink-0">Best for:</span>
                    <span className="text-slate-400">Teams and agencies managing multiple LinkedIn client profiles</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="text-[#888888] font-bold w-28 shrink-0">Starting price:</span>
                    <span className="text-slate-400">~$49/month (no meaningful free plan)</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="text-[#888888] font-bold w-28 shrink-0">Voice learning:</span>
                    <span className="text-slate-400">Limited / basic tone settings</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="text-[#888888] font-bold w-28 shrink-0">Profile Audit:</span>
                    <span className="text-slate-400">No profile auditing capabilities</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="text-[#888888] font-bold w-28 shrink-0">Smart Outreach:</span>
                    <span className="text-slate-400">Limited / template-based messaging</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="text-[#888888] font-bold w-28 shrink-0">Analytics:</span>
                    <span className="text-slate-400">Yes — detailed account metrics dashboard</span>
                  </li>
                </ul>
              </div>

              <div className="text-xs text-center text-[#555555] font-semibold py-3 border border-white/5 rounded-xl uppercase tracking-wider">
                Visit Taplio's Website
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* SECTION 3 — Feature Comparison Table */}
      <section className="py-20 bg-[#080808]">
        <div className="max-w-5xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-semibold text-white mb-4">
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
                  <th className="p-4 sm:p-5 font-bold text-[#888888] uppercase tracking-wider">Taplio</th>
                </tr>
              </thead>
              <tbody>
                <tr className="border-b border-white/5 hover:bg-white/5 transition-colors">
                  <td className="p-4 sm:p-5 font-bold text-white">Free Plan</td>
                  <td className="p-4 sm:p-5 text-[#2DD4BF] font-semibold">
                    <span className="inline-flex items-center gap-1.5"><Check className="w-4 h-4 shrink-0" /> Yes</span>
                  </td>
                  <td className="p-4 sm:p-5 text-red-400 font-semibold">
                    <span className="inline-flex items-center gap-1.5"><X className="w-4 h-4 shrink-0" /> No</span>
                  </td>
                </tr>

                <tr className="border-b border-white/5 hover:bg-white/5 transition-colors bg-[#141414]/20">
                  <td className="p-4 sm:p-5 font-bold text-white">Voice Profile / Style Learning</td>
                  <td className="p-4 sm:p-5 text-[#2DD4BF] font-semibold">
                    <span className="inline-flex items-center gap-1.5"><Check className="w-4 h-4 shrink-0" /> Deep (Clones rhythm & rhythm)</span>
                  </td>
                  <td className="p-4 sm:p-5 text-slate-400 font-semibold">
                    <span className="inline-flex items-center gap-1.5">~ Basic Tone Setup</span>
                  </td>
                </tr>

                <tr className="border-b border-white/5 hover:bg-white/5 transition-colors">
                  <td className="p-4 sm:p-5 font-bold text-white">LinkedIn Post Generator</td>
                  <td className="p-4 sm:p-5 text-[#2DD4BF] font-semibold">
                    <span className="inline-flex items-center gap-1.5"><Check className="w-4 h-4 shrink-0" /> Yes</span>
                  </td>
                  <td className="p-4 sm:p-5 text-slate-300 font-semibold">
                    <span className="inline-flex items-center gap-1.5"><Check className="w-4 h-4 shrink-0" /> Yes</span>
                  </td>
                </tr>

                <tr className="border-b border-white/5 hover:bg-white/5 transition-colors bg-[#141414]/20">
                  <td className="p-4 sm:p-5 font-bold text-white">Profile Audit</td>
                  <td className="p-4 sm:p-5 text-[#2DD4BF] font-semibold">
                    <span className="inline-flex items-center gap-1.5"><Check className="w-4 h-4 shrink-0" /> Yes</span>
                  </td>
                  <td className="p-4 sm:p-5 text-red-400 font-semibold">
                    <span className="inline-flex items-center gap-1.5"><X className="w-4 h-4 shrink-0" /> No</span>
                  </td>
                </tr>

                <tr className="border-b border-white/5 hover:bg-white/5 transition-colors">
                  <td className="p-4 sm:p-5 font-bold text-white">DM / Outreach Generator</td>
                  <td className="p-4 sm:p-5 text-[#2DD4BF] font-semibold">
                    <span className="inline-flex items-center gap-1.5"><Check className="w-4 h-4 shrink-0" /> Yes</span>
                  </td>
                  <td className="p-4 sm:p-5 text-slate-400 font-semibold">
                    <span className="inline-flex items-center gap-1.5">~ Limited Templates</span>
                  </td>
                </tr>

                <tr className="border-b border-white/5 hover:bg-white/5 transition-colors bg-[#141414]/20">
                  <td className="p-4 sm:p-5 font-bold text-white">Topic Generator</td>
                  <td className="p-4 sm:p-5 text-[#2DD4BF] font-semibold">
                    <span className="inline-flex items-center gap-1.5"><Check className="w-4 h-4 shrink-0" /> Yes (Unlimited Pro)</span>
                  </td>
                  <td className="p-4 sm:p-5 text-slate-300 font-semibold">
                    <span className="inline-flex items-center gap-1.5"><Check className="w-4 h-4 shrink-0" /> Yes</span>
                  </td>
                </tr>

                <tr className="border-b border-white/5 hover:bg-white/5 transition-colors">
                  <td className="p-4 sm:p-5 font-bold text-white">CRM / Outreach Tracker</td>
                  <td className="p-4 sm:p-5 text-[#2DD4BF] font-semibold">
                    <span className="inline-flex items-center gap-1.5"><Check className="w-4 h-4 shrink-0" /> Yes</span>
                  </td>
                  <td className="p-4 sm:p-5 text-red-400 font-semibold">
                    <span className="inline-flex items-center gap-1.5"><X className="w-4 h-4 shrink-0" /> No</span>
                  </td>
                </tr>

                <tr className="border-b border-white/5 hover:bg-white/5 transition-colors bg-[#141414]/20">
                  <td className="p-4 sm:p-5 font-bold text-white">Starting Price</td>
                  <td className="p-4 sm:p-5 text-[#2DD4BF] font-semibold">
                    Free forever
                  </td>
                  <td className="p-4 sm:p-5 text-slate-300 font-semibold">
                    ~$49/month
                  </td>
                </tr>

                <tr className="hover:bg-white/5 transition-colors">
                  <td className="p-4 sm:p-5 font-bold text-white">Best For</td>
                  <td className="p-4 sm:p-5 text-[#2DD4BF] font-semibold">
                    Solo founders, professionals
                  </td>
                  <td className="p-4 sm:p-5 text-slate-300 font-semibold">
                    Teams, marketing agencies
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* SECTION 4 — Who Should Choose Each */}
      <section className="py-20 bg-[#0D0D0D] border-t border-b border-white/5">
        <div className="max-w-6xl mx-auto px-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
            <div>
              <h3 className="text-2xl font-bold text-white mb-6 border-b border-white/5 pb-4">
                Choose Somyra if...
              </h3>
              <ul className="space-y-4 text-sm text-[#888888]">
                <li className="flex items-start gap-3">
                  <span className="w-2 h-2 rounded-full bg-[#2DD4BF] mt-1.5 shrink-0" />
                  <span>You're a solo founder or corporate professional building your own personal brand.</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="w-2 h-2 rounded-full bg-[#2DD4BF] mt-1.5 shrink-0" />
                  <span>You want posts that reflect your actual voice profile rather than generic AI output.</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="w-2 h-2 rounded-full bg-[#2DD4BF] mt-1.5 shrink-0" />
                  <span>You want built-in profile audits to optimize headline positioning and audience alignment.</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="w-2 h-2 rounded-full bg-[#2DD4BF] mt-1.5 shrink-0" />
                  <span>Budget is a factor or you're just starting your organic growth path on LinkedIn.</span>
                </li>
              </ul>
            </div>

            <div>
              <h3 className="text-2xl font-bold text-white mb-6 border-b border-white/5 pb-4">
                Choose Taplio if...
              </h3>
              <ul className="space-y-4 text-sm text-[#888888]">
                <li className="flex items-start gap-3">
                  <span className="w-2 h-2 rounded-full bg-[#888888] mt-1.5 shrink-0" />
                  <span>You're part of a marketing team or agency managing multiple client accounts.</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="w-2 h-2 rounded-full bg-[#888888] mt-1.5 shrink-0" />
                  <span>You require highly complex, detailed, multi-account analytics dashboards.</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="w-2 h-2 rounded-full bg-[#888888] mt-1.5 shrink-0" />
                  <span>You prefer scheduled bulk publishing workflows across a broad team ecosystem.</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* SECTION 5 — FAQ */}
      <section className="py-20 bg-[#080808]">
        <div className="max-w-3xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-semibold text-white mb-4">
              Frequently Asked Questions
            </h2>
            <p className="text-slate-400 max-w-xl mx-auto text-base">
              Got questions? We've got answers.
            </p>
          </div>

          <div className="space-y-4">
            {faqData.map((item, index) => (
              <div 
                key={index} 
                className="bg-[#0D0D0D] border border-white/5 rounded-2xl overflow-hidden transition-all duration-300"
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

      {/* SECTION 6 — CTA */}
      <section className="py-16 sm:py-24 bg-[#080808] border-t border-white/5">
        <div className="max-w-5xl mx-auto px-6">
          <div className="relative rounded-3xl overflow-hidden p-8 sm:p-16 bg-gradient-to-b from-[#141414] to-[#0D0D0D] border border-white/5 text-center">
            {/* Subtle glow */}
            <div className="absolute inset-0 bg-radial-at-t from-[#2DD4BF]/5 via-transparent to-transparent pointer-events-none" />
            
            <div className="relative z-10">
              <h2 className="text-3xl sm:text-5xl font-semibold text-white mb-4">
                Try Somyra Free — No Card Needed
              </h2>
              <p className="text-slate-400 text-sm sm:text-base max-w-xl mx-auto mb-8 font-medium">
                Build your personal brand with tools built specifically for individuals.
              </p>
              
              <Link
                to="/?utm_source=seo&utm_medium=organic&utm_campaign=compare-taplio"
                className="inline-flex items-center gap-2 px-8 py-4 bg-[#2DD4BF] text-black font-semibold rounded-xl hover:shadow-[0_0_30px_rgba(45,212,191,0.5)] hover:bg-[#2DD4BF]/90 transition-all text-base mb-2"
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
    </SEOPageLayout>
  );
};

export default CompareTaplioPage;
