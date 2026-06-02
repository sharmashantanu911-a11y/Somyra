import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';
import { ChevronDown, ChevronUp, Sparkles, AlertTriangle, ArrowRight, Check } from 'lucide-react';
import { SEOPageLayout } from '../components/seo/SEOPageLayout';
import { SEO } from '../components/SEO';

interface FAQItem {
  question: string;
  answer: string;
}

const faqData: FAQItem[] = [
  {
    question: "Is Somyra's LinkedIn post generator free?",
    answer: "Yes. Somyra has a free plan that includes 10 post generations per month. No credit card required."
  },
  {
    question: "Does Somyra's output sound like AI?",
    answer: "Only if you skip the Voice Profile setup. When you train Somyra on your real posts, it learns your tone, sentence structure, and writing patterns — so output sounds like you wrote it."
  },
  {
    question: "How is Somyra different from ChatGPT for LinkedIn posts?",
    answer: "ChatGPT generates generic content based on your prompt. Somyra is purpose-built for LinkedIn — it has a Voice Profile system that learns your writing style, LinkedIn-specific formatting logic, and a Deep Mode that runs a 3-step generation process for higher quality output."
  },
  {
    question: "Can I use Somyra if I've never posted on LinkedIn before?",
    answer: "Yes. You can describe your communication style in text and Somyra will work from that. A Voice Profile isn't required to get started."
  },
  {
    question: "What types of LinkedIn posts can Somyra generate?",
    answer: "Story posts, observation posts, hot takes, listicles, build-in-public updates, thought leadership pieces, and more."
  }
];

const schemaData = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "WebApplication",
      "@id": "https://somyra.online/linkedin-post-generator#webapp",
      "name": "Somyra LinkedIn Post Generator",
      "url": "https://somyra.online/linkedin-post-generator",
      "description": "AI-powered LinkedIn post generator that learns your writing voice and creates authentic posts.",
      "applicationCategory": "BusinessApplication",
      "featureList": ["Voice Profile learning", "Deep Mode 3-step generation", "Multiple post variants", "LinkedIn formatting"],
      "offers": {
        "@type": "Offer",
        "price": "0",
        "priceCurrency": "USD"
      }
    },
    {
      "@type": "FAQPage",
      "@id": "https://somyra.online/linkedin-post-generator#faq",
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

const LinkedInPostGeneratorPage: React.FC = () => {
  const [activeFAQ, setActiveFAQ] = useState<number | null>(null);

  const toggleFAQ = (index: number) => {
    setActiveFAQ(activeFAQ === index ? null : index);
  };

  const scrollToHowItWorks = (e: React.MouseEvent) => {
    e.preventDefault();
    const element = document.getElementById('how-it-works');
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <SEOPageLayout>
      <SEO
        title="AI LinkedIn Post Generator That Sounds Like You | Somyra"
        description="Generate LinkedIn posts in your own voice — not robotic AI output. Somyra learns your writing style and creates posts that get real engagement. Free to try."
        canonical="https://somyra.online/linkedin-post-generator"
        schema={schemaData}
      />

      {/* SECTION 1 — Hero */}
      <section className="relative overflow-hidden py-24 sm:py-32 bg-[#080808]">
        {/* Glow Effects */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-[#2DD4BF]/5 rounded-full blur-[120px] pointer-events-none" />
        
        <div className="max-w-4xl mx-auto px-6 text-center relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#2DD4BF]/10 border border-[#2DD4BF]/20 text-[#2DD4BF] text-xs font-semibold tracking-wider uppercase mb-6">
              <Sparkles className="w-3.5 h-3.5" />
              Next-Gen AI LinkedIn Copilot
            </div>
            
            <h1 className="text-4xl sm:text-6xl font-extrabold tracking-tight text-white mb-6 leading-tight">
              Stop Writing LinkedIn Posts <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#2DD4BF] to-teal-400">
                From Scratch
              </span>
            </h1>
            
            <p className="text-lg sm:text-xl text-[#888888] max-w-2xl mx-auto mb-10 leading-relaxed font-medium">
              Somyra learns how you write. Then generates posts that actually sound like you — not like every other AI tool.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-12">
              <Link
                to="/?utm_source=seo&utm_medium=organic&utm_campaign=post-generator"
                className="w-full sm:w-auto px-8 py-4 bg-[#2DD4BF] text-black font-bold rounded-xl hover:shadow-[0_0_30px_rgba(45,212,191,0.5)] hover:bg-[#2DD4BF]/90 transition-all text-base shrink-0"
              >
                Try It Free
              </Link>
              <a
                href="#how-it-works"
                onClick={scrollToHowItWorks}
                className="w-full sm:w-auto px-8 py-4 bg-[#141414] hover:bg-[#1f1f1f] text-white font-bold rounded-xl border border-white/5 hover:border-white/15 transition-all text-base"
              >
                See How It Works
              </a>
            </div>

            <p className="text-xs sm:text-sm text-[#888888] font-semibold tracking-wide uppercase">
              Used by founders and professionals building real audiences on LinkedIn
            </p>
          </motion.div>
        </div>
      </section>

      {/* SECTION 2 — Problem */}
      <section id="problem" className="py-20 border-t border-white/5 bg-[#0D0D0D]">
        <div className="max-w-6xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-extrabold text-white mb-4">
              Why Most AI LinkedIn Content Falls Flat
            </h2>
            <p className="text-slate-400 max-w-2xl mx-auto text-base">
              The platform is flooded with automated noise. To stand out, you can't sound like everyone else.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="bg-[#141414] p-8 rounded-2xl border-t-[3px] border-t-red-500 border-x border-b border-white/5 flex flex-col justify-between h-full"
            >
              <div>
                <div className="w-12 h-12 rounded-xl bg-red-500/10 flex items-center justify-center mb-6 text-red-400">
                  <AlertTriangle className="w-6 h-6" />
                </div>
                <h3 className="text-xl font-bold text-white mb-3">Sounds Robotic</h3>
                <p className="text-sm text-[#888888] leading-relaxed">
                  AI posts have a pattern everyone recognizes now. Generic hooks, hollow insights, performative vulnerability, and excessive emojis.
                </p>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
              className="bg-[#141414] p-8 rounded-2xl border-t-[3px] border-t-red-500 border-x border-b border-white/5 flex flex-col justify-between h-full"
            >
              <div>
                <div className="w-12 h-12 rounded-xl bg-red-500/10 flex items-center justify-center mb-6 text-red-400">
                  <AlertTriangle className="w-6 h-6" />
                </div>
                <h3 className="text-xl font-bold text-white mb-3">No Voice</h3>
                <p className="text-sm text-[#888888] leading-relaxed">
                  It sounds like the tool wrote it, not you. Your unique experiences, perspectives, and natural vocabulary get erased by generic models.
                </p>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2 }}
              className="bg-[#141414] p-8 rounded-2xl border-t-[3px] border-t-red-500 border-x border-b border-white/5 flex flex-col justify-between h-full"
            >
              <div>
                <div className="w-12 h-12 rounded-xl bg-red-500/10 flex items-center justify-center mb-6 text-red-400">
                  <AlertTriangle className="w-6 h-6" />
                </div>
                <h3 className="text-xl font-bold text-white mb-3">Low Engagement</h3>
                <p className="text-sm text-[#888888] leading-relaxed">
                  Posts that don't feel authentic don't get saved, shared, or commented on. The algorithm ignores robotic templates, hurting your reach.
                </p>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* SECTION 3 — How It Works */}
      <section id="how-it-works" className="py-20 bg-[#080808]">
        <div className="max-w-6xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-extrabold text-white mb-4">
              How Somyra Is Different
            </h2>
            <p className="text-slate-400 max-w-2xl mx-auto text-base">
              A bespoke, content-native workspace engineered to clone your writing identity accurately.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="relative p-6">
              <div className="text-5xl font-black text-[#2DD4BF]/20 mb-4">01</div>
              <h3 className="text-xl font-bold text-white mb-3">Build Your Voice Profile</h3>
              <p className="text-sm text-[#888888] leading-relaxed">
                Paste 3–5 of your real LinkedIn posts. Somyra parses and analyzes your tone, line spacing, dynamic rhythms, and sentence style.
              </p>
            </div>

            <div className="relative p-6">
              <div className="text-5xl font-black text-[#2DD4BF]/20 mb-4">02</div>
              <h3 className="text-xl font-bold text-white mb-3">Pick a Topic or Hook</h3>
              <p className="text-sm text-[#888888] leading-relaxed">
                Choose from highly tailored, AI-generated topics tailored to your industry, or write down your own draft thoughts and rough bullet points.
              </p>
            </div>

            <div className="relative p-6">
              <div className="text-5xl font-black text-[#2DD4BF]/20 mb-4">03</div>
              <h3 className="text-xl font-bold text-white mb-3">Generate & Refine</h3>
              <p className="text-sm text-[#888888] leading-relaxed">
                Get multiple creative post variants matching your voice profile perfectly. Edit seamlessly, review previews, and format instantly.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* SECTION 4 — Example Output */}
      <section className="py-20 bg-[#0D0D0D] border-t border-b border-white/5">
        <div className="max-w-5xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-extrabold text-white mb-4">
              What Somyra-Generated Posts Look Like
            </h2>
            <p className="text-slate-400 max-w-2xl mx-auto text-base">
              Compare the generic output of standardized AI models with Somyra's fine-tuned organic style.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
            {/* Generic Output */}
            <div className="bg-[#141414]/50 border border-white/5 rounded-2xl p-8 flex flex-col justify-between relative">
              <div className="absolute top-4 right-4 px-3 py-1 rounded-full bg-red-500/10 border border-red-500/20 text-red-400 text-[11px] font-bold uppercase tracking-wider">
                Generic AI Output
              </div>
              <div className="mt-4">
                <p className="text-slate-400 text-sm italic leading-relaxed">
                  "LinkedIn is a powerful platform for professional growth. By consistently posting valuable content, you can establish yourself as a thought leader in your industry. Here are 5 tips to grow your LinkedIn presence..."
                </p>
              </div>
            </div>

            {/* Somyra Output */}
            <div className="bg-[#141414] border border-[#2DD4BF]/20 rounded-2xl p-8 flex flex-col justify-between relative shadow-[0_0_30px_rgba(45,212,191,0.05)]">
              <div className="absolute top-4 right-4 px-3 py-1 rounded-full bg-[#2DD4BF]/10 border border-[#2DD4BF]/20 text-[#2DD4BF] text-[11px] font-bold uppercase tracking-wider">
                Somyra Output
              </div>
              <div className="mt-4">
                <p className="text-slate-200 text-sm leading-relaxed whitespace-pre-line">
                  I spent 3 months posting on LinkedIn every day and got zero traction.
                  {"\n\n"}
                  Then I stopped trying to sound like an 'expert' and started writing like I actually talk.
                  {"\n\n"}
                  The difference wasn't the topic. It was the voice.
                  {"\n\n"}
                  Here's what changed everything for me:
                </p>
              </div>
            </div>
          </div>

          <div className="text-center">
            <p className="text-xs sm:text-sm text-[#888888] font-bold uppercase tracking-wider">
              Somyra generates posts in YOUR voice, not a template.
            </p>
          </div>
        </div>
      </section>

      {/* SECTION 5 — FAQ */}
      <section className="py-20 bg-[#080808]">
        <div className="max-w-3xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-extrabold text-white mb-4">
              Frequently Asked Questions
            </h2>
            <p className="text-slate-400 max-w-xl mx-auto text-base">
              Everything you need to know about our AI-powered post generator.
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

      {/* SECTION 6 — CTA Banner */}
      <section className="py-16 sm:py-24 bg-[#080808] border-t border-white/5">
        <div className="max-w-5xl mx-auto px-6">
          <div className="relative rounded-3xl overflow-hidden p-8 sm:p-16 bg-gradient-to-b from-[#141414] to-[#0D0D0D] border border-white/5 text-center">
            {/* Ambient Background Gradient */}
            <div className="absolute inset-0 bg-radial-at-t from-[#2DD4BF]/5 via-transparent to-transparent pointer-events-none" />
            
            <div className="relative z-10">
              <h2 className="text-3xl sm:text-5xl font-extrabold text-white mb-4">
                Your LinkedIn Voice, Amplified
              </h2>
              <p className="text-slate-400 text-sm sm:text-base max-w-xl mx-auto mb-8 font-medium">
                Join founders and professionals who've stopped wrestling with blank pages.
              </p>
              
              <Link
                to="/?utm_source=seo&utm_medium=organic&utm_campaign=post-generator"
                className="inline-flex items-center gap-2 px-8 py-4 bg-[#2DD4BF] text-black font-extrabold rounded-xl hover:shadow-[0_0_30px_rgba(45,212,191,0.5)] hover:bg-[#2DD4BF]/90 transition-all text-base"
              >
                Start Free — No Card Needed
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        </div>
      </section>
    </SEOPageLayout>
  );
};

export default LinkedInPostGeneratorPage;
