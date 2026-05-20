import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';
import { ChevronDown, ChevronUp, Sparkles, AlertTriangle, ArrowRight, Check, Send, Mail, RefreshCw, BarChart2 } from 'lucide-react';
import { SEOPageLayout } from '../components/seo/SEOPageLayout';
import { SEO } from '../components/SEO';

interface FAQItem {
  question: string;
  answer: string;
}

const faqData: FAQItem[] = [
  {
    question: "Does Somyra automate sending LinkedIn DMs?",
    answer: "No. Somyra generates the message — you send it manually. Automation violates LinkedIn's terms of service and gets accounts restricted."
  },
  {
    question: "How is this different from a templates library?",
    answer: "Templates are static. Somyra generates a new message based on specific details you provide about the recipient — their role, content, or context. Every message is different."
  },
  {
    question: "Can I use this for sales outreach?",
    answer: "Yes. Many Somyra users are founders and sales professionals using Smart Outreach to start conversations with prospects, not just connections."
  },
  {
    question: "What's the follow-up sequence feature?",
    answer: "After you send the first message, Somyra generates 2–3 follow-up messages timed and toned appropriately — so you don't have to think about what to say if they don't reply."
  }
];

const schemaData = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "WebApplication",
      "@id": "https://somyra.online/linkedin-dm-generator#webapp",
      "name": "Somyra LinkedIn DM Generator",
      "url": "https://somyra.online/linkedin-dm-generator",
      "description": "AI-powered LinkedIn outreach and direct message generator that creates hyper-personalized DMs that get replies.",
      "applicationCategory": "BusinessApplication",
      "featureList": ["Relevance-first hook creation", "Goal-oriented DM generator", "Multi-stage follow-up builder", "ICP profile manager", "DM scoring grading"],
      "offers": {
        "@type": "Offer",
        "price": "0",
        "priceCurrency": "USD"
      }
    },
    {
      "@type": "FAQPage",
      "@id": "https://somyra.online/linkedin-dm-generator#faq",
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

const LinkedInDMGeneratorPage: React.FC = () => {
  const [activeFAQ, setActiveFAQ] = useState<number | null>(null);

  const toggleFAQ = (index: number) => {
    setActiveFAQ(activeFAQ === index ? null : index);
  };

  return (
    <SEOPageLayout>
      <SEO
        title="AI LinkedIn DM Generator — Outreach That Gets Replies | Somyra"
        description="Write LinkedIn DMs that actually get replies. Somyra generates personalized outreach messages based on the recipient's profile — not copy-paste templates."
        canonical="https://somyra.online/linkedin-dm-generator"
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
              <Send className="w-3.5 h-3.5" />
              AI Outreach Assistant
            </div>

            <h1 className="text-4xl sm:text-6xl font-extrabold tracking-tight text-white mb-6 leading-tight">
              LinkedIn DMs That <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#2DD4BF] to-teal-400">
                Don't Get Ignored
              </span>
            </h1>

            <p className="text-lg sm:text-xl text-[#888888] max-w-2xl mx-auto mb-10 leading-relaxed font-medium">
              Generic outreach is dead. Somyra generates messages that reference the actual person — their work, their content, their goals. That's why they reply.
            </p>

            <div className="mb-12">
              <Link
                to="/?utm_source=seo&utm_medium=organic&utm_campaign=dm-generator"
                className="inline-flex items-center gap-2 px-8 py-4 bg-[#2DD4BF] text-black font-extrabold rounded-xl hover:shadow-[0_0_30px_rgba(45,212,191,0.5)] hover:bg-[#2DD4BF]/90 transition-all text-base"
              >
                Try Smart Outreach Free
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>

            <p className="text-xs sm:text-sm text-[#555555] font-bold uppercase tracking-widest">
              Stop blasting copy-paste templates and start starting conversations
            </p>
          </motion.div>
        </div>
      </section>

      {/* SECTION 2 — The Problem */}
      <section className="py-20 bg-[#0D0D0D] border-t border-white/5">
        <div className="max-w-6xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-extrabold text-white mb-4">
              Why Most LinkedIn Outreach Fails
            </h2>
            <p className="text-slate-400 max-w-xl mx-auto text-base">
              The modern professional's inbox is crowded with automated pitches. If you look like automation, you get archived.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-[#141414] p-8 rounded-2xl border-t-[3px] border-t-red-500 border-x border-b border-white/5 flex flex-col justify-between h-full">
              <div>
                <div className="w-12 h-12 rounded-xl bg-red-500/10 flex items-center justify-center mb-6 text-red-400">
                  <AlertTriangle className="w-6 h-6" />
                </div>
                <h3 className="text-xl font-bold text-white mb-3">It's Obviously a Template</h3>
                <p className="text-sm text-[#888888] leading-relaxed">
                  People spot copy-paste outreach in milliseconds. When they see a generic greeting followed by a pitch wall, response rates plummet to zero.
                </p>
              </div>
            </div>

            <div className="bg-[#141414] p-8 rounded-2xl border-t-[3px] border-t-red-500 border-x border-b border-white/5 flex flex-col justify-between h-full">
              <div>
                <div className="w-12 h-12 rounded-xl bg-red-500/10 flex items-center justify-center mb-6 text-red-400">
                  <AlertTriangle className="w-6 h-6" />
                </div>
                <h3 className="text-xl font-bold text-white mb-3">No Relevance Signal</h3>
                <p className="text-sm text-[#888888] leading-relaxed">
                  The message says nothing personal or specific about their business, role, or recent actions. It offers zero compelling reasons for them to care.
                </p>
              </div>
            </div>

            <div className="bg-[#141414] p-8 rounded-2xl border-t-[3px] border-t-red-500 border-x border-b border-white/5 flex flex-col justify-between h-full">
              <div>
                <div className="w-12 h-12 rounded-xl bg-red-500/10 flex items-center justify-center mb-6 text-red-400">
                  <AlertTriangle className="w-6 h-6" />
                </div>
                <h3 className="text-xl font-bold text-white mb-3">Wrong Goal</h3>
                <p className="text-sm text-[#888888] leading-relaxed">
                  Leading directly with a heavy ask (like booking a 30-minute demo) before establishing credibility, rapport, or mutual professional value.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* SECTION 3 — How Somyra's Outreach Works */}
      <section className="py-20 bg-[#080808]">
        <div className="max-w-6xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-extrabold text-white mb-4">
              Relevance-First Outreach
            </h2>
            <p className="text-slate-400 max-w-xl mx-auto text-base">
              A modern, intelligent workflow designed to spark professional interest organically.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="relative p-6">
              <div className="text-5xl font-black text-[#2DD4BF]/20 mb-4">01</div>
              <h3 className="text-xl font-bold text-white mb-3">Enter Recipient Context</h3>
              <p className="text-sm text-[#888888] leading-relaxed">
                Add their role, company, target industry, or a snippet of a recent post or achievement that caught your attention.
              </p>
            </div>

            <div className="relative p-6">
              <div className="text-5xl font-black text-[#2DD4BF]/20 mb-4">02</div>
              <h3 className="text-xl font-bold text-white mb-3">Set Your Outreach Goal</h3>
              <p className="text-sm text-[#888888] leading-relaxed">
                Define the outcome you want: sending a connection note, starting a friendly industry discussion, proposing mutual collaborations, or booking sales meetings.
              </p>
            </div>

            <div className="relative p-6">
              <div className="text-5xl font-black text-[#2DD4BF]/20 mb-4">03</div>
              <h3 className="text-xl font-bold text-white mb-3">Get Custom DMs</h3>
              <p className="text-sm text-[#888888] leading-relaxed">
                Receive personalized message suggestions starting with a powerful relevance hook, clear low-friction ask, and follow-up templates.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* SECTION 4 — Features List */}
      <section className="py-20 bg-[#0D0D0D] border-t border-b border-white/5">
        <div className="max-w-5xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-extrabold text-white mb-4">
              What Smart Outreach Includes
            </h2>
            <p className="text-slate-400 max-w-xl mx-auto text-base">
              A full suite of strategic tools to optimize every step of your professional messaging cycle.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="space-y-6">
              <div className="flex items-start gap-4">
                <div className="w-6 h-6 rounded-full bg-[#2DD4BF]/10 flex items-center justify-center text-[#2DD4BF] shrink-0 mt-1">
                  <Check className="w-3.5 h-3.5" />
                </div>
                <div>
                  <h3 className="font-bold text-white text-base mb-1">Relevance-first message generation</h3>
                  <p className="text-xs text-[#888888] leading-relaxed">Generates highly customized opener hooks citing recipients' unique strategic signals.</p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="w-6 h-6 rounded-full bg-[#2DD4BF]/10 flex items-center justify-center text-[#2DD4BF] shrink-0 mt-1">
                  <Check className="w-3.5 h-3.5" />
                </div>
                <div>
                  <h3 className="font-bold text-white text-base mb-1">ICP (Ideal Customer Profile) builder</h3>
                  <p className="text-xs text-[#888888] leading-relaxed">Store your customer definitions so the AI creates perfectly positioned arguments for their pain points.</p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="w-6 h-6 rounded-full bg-[#2DD4BF]/10 flex items-center justify-center text-[#2DD4BF] shrink-0 mt-1">
                  <Check className="w-3.5 h-3.5" />
                </div>
                <div>
                  <h3 className="font-bold text-white text-base mb-1">Follow-up sequence generator</h3>
                  <p className="text-xs text-[#888888] leading-relaxed">Automatically generate 2–3 follow-up templates matching the exact tone of your original connection.</p>
                </div>
              </div>
            </div>

            <div className="space-y-6">
              <div className="flex items-start gap-4">
                <div className="w-6 h-6 rounded-full bg-[#2DD4BF]/10 flex items-center justify-center text-[#2DD4BF] shrink-0 mt-1">
                  <Check className="w-3.5 h-3.5" />
                </div>
                <div>
                  <h3 className="font-bold text-white text-base mb-1">CRM tracker for your outreach pipeline</h3>
                  <p className="text-xs text-[#888888] leading-relaxed">Organize, status-track, and manage prospects as they move through your relationship funnel.</p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="w-6 h-6 rounded-full bg-[#2DD4BF]/10 flex items-center justify-center text-[#2DD4BF] shrink-0 mt-1">
                  <Check className="w-3.5 h-3.5" />
                </div>
                <div>
                  <h3 className="font-bold text-white text-base mb-1">Message scoring and grader</h3>
                  <p className="text-xs text-[#888888] leading-relaxed">Evaluates readability, personalization, clarity, and reply odds prior to sending.</p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="w-6 h-6 rounded-full bg-[#2DD4BF]/10 flex items-center justify-center text-[#2DD4BF] shrink-0 mt-1">
                  <Check className="w-3.5 h-3.5" />
                </div>
                <div>
                  <h3 className="font-bold text-white text-base mb-1">Outreach templates library</h3>
                  <p className="text-xs text-[#888888] leading-relaxed">Instant access to validated, high-reply templates used by peak-performing professionals.</p>
                </div>
              </div>
            </div>
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
              Everything you need to know about our LinkedIn direct message generator.
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
              <h2 className="text-3xl sm:text-5xl font-extrabold text-white mb-4">
                Stop Sending DMs That Get Ignored
              </h2>
              <p className="text-slate-400 text-sm sm:text-base max-w-xl mx-auto mb-8 font-medium">
                Draft hyper-personalized, context-rich professional notes in under 30 seconds.
              </p>
              
              <Link
                to="/?utm_source=seo&utm_medium=organic&utm_campaign=dm-generator"
                className="inline-flex items-center gap-2 px-8 py-4 bg-[#2DD4BF] text-black font-extrabold rounded-xl hover:shadow-[0_0_30px_rgba(45,212,191,0.5)] hover:bg-[#2DD4BF]/90 transition-all text-base"
              >
                Start Sending Smarter Outreach
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        </div>
      </section>
    </SEOPageLayout>
  );
};

export default LinkedInDMGeneratorPage;
