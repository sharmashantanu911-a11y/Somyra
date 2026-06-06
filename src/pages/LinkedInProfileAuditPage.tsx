import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';
import { ChevronDown, ChevronUp, Sparkles, Target, Award, Users, Search, TrendingUp, HelpCircle, Briefcase, Zap, ArrowRight, ShieldCheck } from 'lucide-react';
import { SEOPageLayout } from '../components/seo/SEOPageLayout';
import { SEO } from '../components/SEO';

interface FAQItem {
  question: string;
  answer: string;
}

const faqData: FAQItem[] = [
  {
    question: "Is the LinkedIn profile audit really free?",
    answer: "Yes. The Quick Audit is completely free with no credit card required. Deep Strategy mode is available on the Pro plan."
  },
  {
    question: "What does Somyra's profile audit actually check?",
    answer: "Somyra analyzes your headline, About section, experience descriptions, featured section, keyword usage, and overall positioning alignment. Deep Strategy mode also generates rewrite suggestions for your headline and About section."
  },
  {
    question: "How long does the audit take?",
    answer: "The Quick Audit takes 2–3 minutes. Deep Strategy mode takes 4–6 minutes and produces a detailed written report with specific rewrites."
  },
  {
    question: "Will Somyra rewrite my profile for me?",
    answer: "Deep Strategy mode generates new headline and About section variants you can use directly. It's not just a score — it gives you the actual improved copy."
  },
  {
    question: "Do I need to give Somyra access to my LinkedIn account?",
    answer: "No. You paste your profile content manually. Somyra does not connect to your LinkedIn account."
  }
];

const schemaData = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "WebApplication",
      "@id": "https://somyra.online/linkedin-profile-audit#webapp",
      "name": "Somyra LinkedIn Profile Audit",
      "url": "https://somyra.online/linkedin-profile-audit",
      "description": "AI-powered LinkedIn profile audit tool that grades your positioning, headline, and About section with instant suggestions.",
      "applicationCategory": "BusinessApplication",
      "featureList": ["Quick Audit profile grader", "Deep Strategy 8-dimension audit", "Headline rewriting", "About section rewriting", "Audience positioning check"],
      "offers": {
        "@type": "Offer",
        "price": "0",
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
    },
    {
      "@type": "FAQPage",
      "@id": "https://somyra.online/linkedin-profile-audit#faq",
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

const LinkedInProfileAuditPage: React.FC = () => {
  const [activeFAQ, setActiveFAQ] = useState<number | null>(null);

  const toggleFAQ = (index: number) => {
    setActiveFAQ(activeFAQ === index ? null : index);
  };

  return (
    <SEOPageLayout>
      <SEO
        title="Free LinkedIn Profile Audit Tool: Get a Real Score | Somyra"
        description="Find out exactly what is wrong with your LinkedIn profile. Somyra audits your headline, About section, experience, and positioning, then shows you how to fix it."
        canonical="https://somyra.online/linkedin-profile-audit"
        schema={schemaData}
      />

      {/* SECTION 1 — Hero */}
      <section className="relative overflow-hidden py-24 sm:py-32 bg-[#080808]">
        {/* Ambient background glow */}
        <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[550px] h-[550px] bg-[#2DD4BF]/5 rounded-full blur-[140px] pointer-events-none" />
        
        <div className="max-w-4xl mx-auto px-6 text-center relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#2DD4BF]/10 border border-[#2DD4BF]/20 text-[#2DD4BF] text-xs font-semibold tracking-wider uppercase mb-6">
              <ShieldCheck className="w-3.5 h-3.5" />
              100% Free Profile Grader
            </div>

            <h1 className="text-4xl sm:text-6xl font-semibold tracking-tight text-white mb-6 leading-tight">
              Your LinkedIn Profile Is <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-red-400 to-[#2DD4BF]">
                Losing You Opportunities
              </span>
            </h1>

            <p className="text-lg sm:text-xl text-[#888888] max-w-2xl mx-auto mb-10 leading-relaxed font-medium">
              Most profiles are passive. They wait for someone to care. Somyra's Profile Audit shows you exactly what's broken — and how to fix it.
            </p>

            <div className="mb-12">
              <Link
                to="/?utm_source=seo&utm_medium=organic&utm_campaign=profile-audit"
                className="inline-flex items-center gap-2 px-8 py-4 bg-[#2DD4BF] text-black font-semibold rounded-xl hover:shadow-[0_0_30px_rgba(45,212,191,0.5)] hover:bg-[#2DD4BF]/90 transition-all text-base"
              >
                Audit My Profile Free
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>

            <p className="text-xs sm:text-sm text-[#888888] font-bold uppercase tracking-widest">
              Deep Strategy mode analyzes 8+ profile dimensions with actionable rewrites
            </p>
          </motion.div>
        </div>
      </section>

      {/* SECTION 2 — What Gets Audited */}
      <section className="py-20 bg-[#0D0D0D] border-t border-white/5">
        <div className="max-w-6xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-semibold text-white mb-4">
              What Somyra Actually Analyzes
            </h2>
            <p className="text-slate-400 max-w-xl mx-auto text-base">
              We go far beyond surface checklist points. Somyra scores the emotional weight and strategic positioning of your copy.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="bg-[#141414] p-6 rounded-2xl border border-white/5">
              <div className="w-10 h-10 rounded-lg bg-[#2DD4BF]/10 flex items-center justify-center mb-4 text-[#2DD4BF]">
                <Award className="w-5 h-5" />
              </div>
              <h3 className="font-bold text-white text-lg mb-2">Headline</h3>
              <p className="text-xs text-[#888888] leading-relaxed">
                Is it positioning you as a clear authority or just describing your corporate job title?
              </p>
            </div>

            <div className="bg-[#141414] p-6 rounded-2xl border border-white/5">
              <div className="w-10 h-10 rounded-lg bg-[#2DD4BF]/10 flex items-center justify-center mb-4 text-[#2DD4BF]">
                <Users className="w-5 h-5" />
              </div>
              <h3 className="font-bold text-white text-lg mb-2">About Section</h3>
              <p className="text-xs text-[#888888] leading-relaxed">
                Does it speak directly to your target audience or just recount your work history?
              </p>
            </div>

            <div className="bg-[#141414] p-6 rounded-2xl border border-white/5">
              <div className="w-10 h-10 rounded-lg bg-[#2DD4BF]/10 flex items-center justify-center mb-4 text-[#2DD4BF]">
                <Zap className="w-5 h-5" />
              </div>
              <h3 className="font-bold text-white text-lg mb-2">Profile Strength</h3>
              <p className="text-xs text-[#888888] leading-relaxed">
                Flags any missing strategic sections that are directly costing you algorithmic visibility.
              </p>
            </div>

            <div className="bg-[#141414] p-6 rounded-2xl border border-white/5">
              <div className="w-10 h-10 rounded-lg bg-[#2DD4BF]/10 flex items-center justify-center mb-4 text-[#2DD4BF]">
                <Target className="w-5 h-5" />
              </div>
              <h3 className="font-bold text-white text-lg mb-2">Audience Alignment</h3>
              <p className="text-xs text-[#888888] leading-relaxed">
                A thorough evaluation of who you're currently attracting vs who you actually want.
              </p>
            </div>

            <div className="bg-[#141414] p-6 rounded-2xl border border-white/5">
              <div className="w-10 h-10 rounded-lg bg-[#2DD4BF]/10 flex items-center justify-center mb-4 text-[#2DD4BF]">
                <Briefcase className="w-5 h-5" />
              </div>
              <h3 className="font-bold text-white text-lg mb-2">Content Strategy</h3>
              <p className="text-xs text-[#888888] leading-relaxed">
                Determines whether your latest posts are structurally consistent with your active positioning.
              </p>
            </div>

            <div className="bg-[#141414] p-6 rounded-2xl border border-white/5">
              <div className="w-10 h-10 rounded-lg bg-[#2DD4BF]/10 flex items-center justify-center mb-4 text-[#2DD4BF]">
                <Search className="w-5 h-5" />
              </div>
              <h3 className="font-bold text-white text-lg mb-2">Keyword Optimization</h3>
              <p className="text-xs text-[#888888] leading-relaxed">
                Analyzes indexable search keywords so recruiters and prospects can discover you organically.
              </p>
            </div>

            <div className="bg-[#141414] p-6 rounded-2xl border border-white/5">
              <div className="w-10 h-10 rounded-lg bg-[#2DD4BF]/10 flex items-center justify-center mb-4 text-[#2DD4BF]">
                <TrendingUp className="w-5 h-5" />
              </div>
              <h3 className="font-bold text-white text-lg mb-2">Social Proof</h3>
              <p className="text-xs text-[#888888] leading-relaxed">
                Grades your featured sections, client recommendations, and direct audience engagement signals.
              </p>
            </div>

            <div className="bg-[#141414] p-6 rounded-2xl border border-white/5">
              <div className="w-10 h-10 rounded-lg bg-[#2DD4BF]/10 flex items-center justify-center mb-4 text-[#2DD4BF]">
                <HelpCircle className="w-5 h-5" />
              </div>
              <h3 className="font-bold text-white text-lg mb-2">Overall Positioning</h3>
              <p className="text-xs text-[#888888] leading-relaxed">
                Pinpoints the core message your profile communicates — and ensures it is highly compelling.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* SECTION 3 — Two Modes */}
      <section className="py-20 bg-[#080808]">
        <div className="max-w-5xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-semibold text-white mb-4">
              Quick Audit vs Deep Strategy
            </h2>
            <p className="text-slate-400 max-w-xl mx-auto text-base">
              Choose the depth of profile evaluation that matches your current personal branding goals.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Quick Audit */}
            <div className="bg-[#0D0D0D] border border-white/5 rounded-3xl p-8 flex flex-col justify-between h-full">
              <div>
                <h3 className="text-xl font-bold text-white mb-2">Quick Audit</h3>
                <div className="text-xs font-semibold text-[#888888] uppercase tracking-wider mb-6">Free Tier</div>
                
                <ul className="space-y-4 text-sm text-[#888888]">
                  <li className="flex items-center gap-3">
                    <span className="w-1.5 h-1.5 rounded-full bg-teal-400 shrink-0" />
                    Fast profile health check
                  </li>
                  <li className="flex items-center gap-3">
                    <span className="w-1.5 h-1.5 rounded-full bg-teal-400 shrink-0" />
                    Headline and About section scores
                  </li>
                  <li className="flex items-center gap-3">
                    <span className="w-1.5 h-1.5 rounded-full bg-teal-400 shrink-0" />
                    Top 3 immediate fixes highlighted
                  </li>
                  <li className="flex items-center gap-3">
                    <span className="w-1.5 h-1.5 rounded-full bg-teal-400 shrink-0" />
                    2–3 minute rapid AI analysis
                  </li>
                </ul>
              </div>

              <div className="mt-8">
                <Link
                  to="/"
                  className="block w-full py-3 bg-[#141414] hover:bg-[#1f1f1f] border border-white/5 text-center text-white font-bold rounded-xl transition-colors text-sm"
                >
                  Start Quick Audit
                </Link>
              </div>
            </div>

            {/* Deep Strategy */}
            <div className="bg-[#0D0D0D] border border-[#2DD4BF]/20 shadow-[0_0_30px_rgba(45,212,191,0.05)] rounded-3xl p-8 flex flex-col justify-between h-full relative overflow-hidden">
              <div className="absolute top-0 right-0 bg-[#2DD4BF] text-black font-bold type-overline px-4 py-1.5 rounded-bl-xl">
                Pro Feature
              </div>

              <div>
                <h3 className="text-xl font-bold text-white mb-2">Deep Strategy</h3>
                <div className="text-xs font-semibold text-[#2DD4BF] uppercase tracking-wider mb-6">Highly Recommended</div>
                
                <ul className="space-y-4 text-sm text-slate-300">
                  <li className="flex items-center gap-3">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#2DD4BF] shrink-0" />
                    Comprehensive 8-dimension analysis
                  </li>
                  <li className="flex items-center gap-3">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#2DD4BF] shrink-0" />
                    AI-powered profile rewrite suggestions
                  </li>
                  <li className="flex items-center gap-3">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#2DD4BF] shrink-0" />
                    Target audience profile mapping
                  </li>
                  <li className="flex items-center gap-3">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#2DD4BF] shrink-0" />
                    Bespoke headline & About section variants
                  </li>
                  <li className="flex items-center gap-3">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#2DD4BF] shrink-0" />
                    Competitive positioning and authority review
                  </li>
                </ul>
              </div>

              <div className="mt-8">
                <Link
                  to="/"
                  className="block w-full py-3 bg-[#2DD4BF] hover:bg-[#2DD4BF]/90 text-center text-black font-semibold rounded-xl hover:shadow-[0_0_20px_rgba(45,212,191,0.3)] transition-all text-sm"
                >
                  Unlock Deep Strategy
                </Link>
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
              Answers to your questions about our LinkedIn profile review tool.
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

      {/* SECTION 5 — CTA Banner */}
      <section className="py-16 sm:py-24 bg-[#080808]">
        <div className="max-w-5xl mx-auto px-6">
          <div className="relative rounded-3xl overflow-hidden p-8 sm:p-16 bg-gradient-to-b from-[#141414] to-[#0D0D0D] border border-white/5 text-center">
            {/* Subtle glow */}
            <div className="absolute inset-0 bg-radial-at-t from-[#2DD4BF]/5 via-transparent to-transparent pointer-events-none" />
            
            <div className="relative z-10">
              <h2 className="text-3xl sm:text-5xl font-semibold text-white mb-4">
                Know Exactly What Your Profile Is Missing
              </h2>
              <p className="text-slate-400 text-sm sm:text-base max-w-xl mx-auto mb-8 font-medium">
                Somyra uncovers hidden positioning gaps and provides direct copy updates in minutes.
              </p>
              
              <Link
                to="/?utm_source=seo&utm_medium=organic&utm_campaign=profile-audit"
                className="inline-flex items-center gap-2 px-8 py-4 bg-[#2DD4BF] text-black font-semibold rounded-xl hover:shadow-[0_0_30px_rgba(45,212,191,0.5)] hover:bg-[#2DD4BF]/90 transition-all text-base"
              >
                Get My Free Audit
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        </div>
      </section>
    </SEOPageLayout>
  );
};

export default LinkedInProfileAuditPage;
