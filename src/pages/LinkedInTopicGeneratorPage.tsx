import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';
import { ChevronDown, ChevronUp, Sparkles, AlertTriangle, ArrowRight, Check, Compass, Eye, Layers, Lightbulb } from 'lucide-react';
import { SEOPageLayout } from '../components/seo/SEOPageLayout';
import { SEO } from '../components/SEO';

interface FAQItem {
  question: string;
  answer: string;
}

const faqData: FAQItem[] = [
  {
    question: "How does Somyra know what topics to suggest?",
    answer: "Somyra uses your Voice Profile, niche, and target audience to generate relevant topics. The more context you give it, the more targeted the ideas."
  },
  {
    question: "Are the topics unique?",
    answer: "Each generation produces a fresh set. You won't get the same list twice."
  },
  {
    question: "Can I save topics I like for later?",
    answer: "Yes. Somyra has a Saved Library where you can save any generated topics, posts, or outreach messages for later use."
  },
  {
    question: "Is the topic generator free?",
    answer: "Yes. Free plan users get 30 topic generations per month. Pro and Max plans get unlimited topics."
  }
];

const schemaData = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "WebApplication",
      "@id": "https://somyra.online/linkedin-topic-generator#webapp",
      "name": "Somyra LinkedIn Topic Generator",
      "url": "https://somyra.online/linkedin-topic-generator",
      "description": "AI-powered LinkedIn topic generator that creates unlimited content ideas, observations, listicles, and hooks tailored to your niche.",
      "applicationCategory": "BusinessApplication",
      "featureList": ["Topic & specific angles", "Post style formatting matching", "Opening hook direction", "Saved ideas library"],
      "offers": {
        "@type": "Offer",
        "price": "0",
        "priceCurrency": "USD"
      }
    },
    {
      "@type": "FAQPage",
      "@id": "https://somyra.online/linkedin-topic-generator#faq",
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

const LinkedInTopicGeneratorPage: React.FC = () => {
  const [activeFAQ, setActiveFAQ] = useState<number | null>(null);

  const toggleFAQ = (index: number) => {
    setActiveFAQ(activeFAQ === index ? null : index);
  };

  return (
    <SEOPageLayout>
      <SEO
        title="LinkedIn Topic Generator: Never Run Out of Content Ideas | Somyra"
        description="Get unlimited LinkedIn content ideas tailored to your niche and audience. Somyra generates topics, angles, and hooks so you always know what to post next."
        canonical="https://somyra.online/linkedin-topic-generator"
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
              <Lightbulb className="w-3.5 h-3.5" />
              AI Topic & Idea Generator
            </div>

            <h1 className="text-4xl sm:text-6xl font-semibold tracking-tight text-white mb-6 leading-tight">
              Never Stare at a Blank <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#2DD4BF] to-teal-400">
                Screen Again
              </span>
            </h1>

            <p className="text-lg sm:text-xl text-[#888888] max-w-2xl mx-auto mb-10 leading-relaxed font-medium">
              Somyra generates LinkedIn content ideas matched to your niche, expertise, and goals — with angles and hooks ready to write.
            </p>

            <div className="mb-12">
              <Link
                to="/?utm_source=seo&utm_medium=organic&utm_campaign=topic-generator"
                className="inline-flex items-center gap-2 px-8 py-4 bg-[#2DD4BF] text-black font-semibold rounded-xl hover:shadow-[0_0_30px_rgba(45,212,191,0.5)] hover:bg-[#2DD4BF]/90 transition-all text-base"
              >
                Generate Topics Free
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>

            <p className="text-xs sm:text-sm text-[#888888] font-bold uppercase tracking-widest">
              Unleash consistent, engaging, and highly professional positioning angles
            </p>
          </motion.div>
        </div>
      </section>

      {/* SECTION 2 — The Real Problem */}
      <section className="py-20 bg-[#0D0D0D] border-t border-white/5">
        <div className="max-w-4xl mx-auto px-6">
          <div className="bg-[#141414] border border-white/5 rounded-3xl p-8 sm:p-12 text-center shadow-2xl relative overflow-hidden">
            {/* Soft backdrop accent */}
            <div className="absolute -top-10 -right-10 w-40 h-40 bg-[#2DD4BF]/5 rounded-full blur-3xl pointer-events-none" />

            <div className="max-w-2xl mx-auto">
              <h2 className="text-3xl font-semibold text-white mb-6">
                The LinkedIn Consistency Problem Isn't Discipline
              </h2>
              <p className="text-slate-400 text-base leading-relaxed mb-4">
                Most people think they're inconsistent because they lack discipline. That's not it. The real reason is running out of ideas.
              </p>
              <p className="text-slate-400 text-base leading-relaxed">
                When you don't know what to write, you don't write. Somyra solves the upstream problem — so you always have something worth saying.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* SECTION 3 — What Somyra Generates */}
      <section className="py-20 bg-[#080808]">
        <div className="max-w-6xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-semibold text-white mb-4">
              What Somyra Actually Generates
            </h2>
            <p className="text-slate-400 max-w-xl mx-auto text-base">
              We don't give you dry, one-word suggestions. Every topic is generated with ready-to-write professional hooks and context.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-[#0D0D0D] border border-white/5 p-8 rounded-3xl relative overflow-hidden">
              <div className="w-12 h-12 rounded-xl bg-[#2DD4BF]/10 flex items-center justify-center mb-6 text-[#2DD4BF]">
                <Compass className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold text-white mb-3">Topic + Angle</h3>
              <p className="text-sm text-[#888888] leading-relaxed">
                Not just "write about leadership" but "write about the one leadership mistake founders make when they hire their first team member." Deep, specific angles that establish immediate credibility.
              </p>
            </div>

            <div className="bg-[#0D0D0D] border border-white/5 p-8 rounded-3xl relative overflow-hidden">
              <div className="w-12 h-12 rounded-xl bg-[#2DD4BF]/10 flex items-center justify-center mb-6 text-[#2DD4BF]">
                <Layers className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold text-white mb-3">Content Type</h3>
              <p className="text-sm text-[#888888] leading-relaxed">
                Story post, observation, hot take, listicle, build-in-public — matched dynamically to the topic context. You get structural direction that makes writing quick and organized.
              </p>
            </div>

            <div className="bg-[#0D0D0D] border border-white/5 p-8 rounded-3xl relative overflow-hidden">
              <div className="w-12 h-12 rounded-xl bg-[#2DD4BF]/10 flex items-center justify-center mb-6 text-[#2DD4BF]">
                <Eye className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold text-white mb-3">Hook Direction</h3>
              <p className="text-sm text-[#888888] leading-relaxed">
                The opening hook direction that makes the topic immediately compelling for your specific target audience. Designed to capture click attention right at the top of the post.
              </p>
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
              Everything you need to know about our LinkedIn topic and idea generator.
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
            {/* Ambient backdrop */}
            <div className="absolute inset-0 bg-radial-at-t from-[#2DD4BF]/5 via-transparent to-transparent pointer-events-none" />
            
            <div className="relative z-10">
              <h2 className="text-3xl sm:text-5xl font-semibold text-white mb-4">
                Always Know What to Post Next
              </h2>
              <p className="text-slate-400 text-sm sm:text-base max-w-xl mx-auto mb-8 font-medium">
                Unlock bespoke creative topic ideations customized directly to your professional niche.
              </p>
              
              <Link
                to="/?utm_source=seo&utm_medium=organic&utm_campaign=topic-generator"
                className="inline-flex items-center gap-2 px-8 py-4 bg-[#2DD4BF] text-black font-semibold rounded-xl hover:shadow-[0_0_30px_rgba(45,212,191,0.5)] hover:bg-[#2DD4BF]/90 transition-all text-base"
              >
                Get My Content Ideas
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        </div>
      </section>
    </SEOPageLayout>
  );
};

export default LinkedInTopicGeneratorPage;
