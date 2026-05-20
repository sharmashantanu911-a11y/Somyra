import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'motion/react';
import { ArrowRight, BookOpen, Mail, Send, Sparkles, CheckCircle } from 'lucide-react';
import { SEOPageLayout } from '../components/seo/SEOPageLayout';
import { SEO } from '../components/SEO';

const schemaData = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "WebPage",
      "@id": "https://somyra.online/blog#webpage",
      "name": "Somyra LinkedIn Growth Blog",
      "url": "https://somyra.online/blog",
      "description": "Practical LinkedIn growth strategy, writing tips, profile auditing guides, and outreach ideas for professionals."
    }
  ]
};

const BlogPage: React.FC = () => {
  const [email, setEmail] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (email.trim()) {
      setIsSubmitted(true);
      setEmail('');
    }
  };

  return (
    <SEOPageLayout>
      <SEO
        title="LinkedIn Growth Blog — Strategy, Tips & Insights | Somyra"
        description="Practical LinkedIn growth strategy for founders and professionals. No generic tips — real tactics for building an audience, writing better content, and running smarter outreach."
        canonical="https://somyra.online/blog"
        schema={schemaData}
      />

      {/* SECTION 1 — Header */}
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
              <BookOpen className="w-3.5 h-3.5" />
              Somyra Blog
            </div>

            <h1 className="text-4xl sm:text-6xl font-extrabold tracking-tight text-white mb-6 leading-tight">
              LinkedIn Growth, <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#2DD4BF] to-teal-400">
                Straight Talk
              </span>
            </h1>

            <p className="text-lg sm:text-xl text-[#888888] max-w-2xl mx-auto mb-10 leading-relaxed font-medium">
              No generic "10 tips to grow on LinkedIn" content. Just what actually works for founders and professionals building a real audience.
            </p>
          </motion.div>
        </div>
      </section>

      {/* SECTION 2 — Coming Soon State */}
      <section className="py-20 bg-[#0D0D0D] border-t border-white/5">
        <div className="max-w-6xl mx-auto px-6">
          <div className="text-center mb-16">
            <div className="inline-block px-4 py-2 rounded-xl bg-[#141414] border border-white/5 text-sm font-bold text-[#2DD4BF] uppercase tracking-wider mb-4">
              First posts dropping soon
            </div>
            <h2 className="text-3xl font-extrabold text-white">Upcoming Articles Preview</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Card 1 */}
            <div className="bg-[#141414] border border-white/5 rounded-3xl p-8 flex flex-col justify-between h-full hover:border-[#2DD4BF]/20 transition-all group">
              <div>
                <div className="flex items-center justify-between mb-6">
                  <span className="text-xs font-extrabold text-[#2DD4BF] uppercase tracking-widest bg-[#2DD4BF]/5 px-2.5 py-1 rounded-md">
                    Writing
                  </span>
                  <span className="text-[10px] font-bold text-[#555555] uppercase tracking-widest bg-[#080808] px-2 py-0.5 rounded-full border border-white/5">
                    Coming Soon
                  </span>
                </div>
                
                <h3 className="text-xl font-bold text-white mb-4 leading-snug group-hover:text-[#2DD4BF] transition-colors">
                  Why Your LinkedIn Posts Sound Robotic (And How to Fix It)
                </h3>
                
                <p className="text-xs text-[#888888] leading-relaxed">
                  How generic AI content models dilute personal brands, and how to train models using your personal writing DNA to achieve authenticity at scale.
                </p>
              </div>
            </div>

            {/* Card 2 */}
            <div className="bg-[#141414] border border-white/5 rounded-3xl p-8 flex flex-col justify-between h-full hover:border-[#2DD4BF]/20 transition-all group">
              <div>
                <div className="flex items-center justify-between mb-6">
                  <span className="text-xs font-extrabold text-[#2DD4BF] uppercase tracking-widest bg-[#2DD4BF]/5 px-2.5 py-1 rounded-md">
                    Outreach
                  </span>
                  <span className="text-[10px] font-bold text-[#555555] uppercase tracking-widest bg-[#080808] px-2 py-0.5 rounded-full border border-white/5">
                    Coming Soon
                  </span>
                </div>
                
                <h3 className="text-xl font-bold text-white mb-4 leading-snug group-hover:text-[#2DD4BF] transition-colors">
                  The Only LinkedIn Outreach Strategy That Doesn't Make People Cringe
                </h3>
                
                <p className="text-xs text-[#888888] leading-relaxed">
                  Why pitch-slapping conectees on connection request triggers instant archives, and how to write contextual relevance hooks that convert into meetings.
                </p>
              </div>
            </div>

            {/* Card 3 */}
            <div className="bg-[#141414] border border-white/5 rounded-3xl p-8 flex flex-col justify-between h-full hover:border-[#2DD4BF]/20 transition-all group">
              <div>
                <div className="flex items-center justify-between mb-6">
                  <span className="text-xs font-extrabold text-[#2DD4BF] uppercase tracking-widest bg-[#2DD4BF]/5 px-2.5 py-1 rounded-md">
                    Profile
                  </span>
                  <span className="text-[10px] font-bold text-[#555555] uppercase tracking-widest bg-[#080808] px-2 py-0.5 rounded-full border border-white/5">
                    Coming Soon
                  </span>
                </div>
                
                <h3 className="text-xl font-bold text-white mb-4 leading-snug group-hover:text-[#2DD4BF] transition-colors">
                  How to Write a LinkedIn About Section That Converts
                </h3>
                
                <p className="text-xs text-[#888888] leading-relaxed">
                  Transforming a dry, bulleted work history into a compelling positioning narrative designed to convert profile viewers into warm outbound inquiries.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* SECTION 3 — Email Capture */}
      <section className="py-20 bg-[#080808] border-t border-white/5">
        <div className="max-w-4xl mx-auto px-6">
          <div className="bg-[#0D0D0D] border border-white/5 rounded-3xl p-8 sm:p-16 text-center shadow-2xl relative overflow-hidden">
            {/* Subtle glow */}
            <div className="absolute inset-0 bg-radial-at-t from-[#2DD4BF]/5 via-transparent to-transparent pointer-events-none" />

            <div className="max-w-xl mx-auto relative z-10">
              <h2 className="text-3xl font-extrabold text-white mb-4">
                Get notified when we publish
              </h2>
              <p className="text-[#888888] text-sm sm:text-base mb-8 font-medium">
                Subscribe to get organic growth guides and strategic LinkedIn writing breakdowns delivered straight to your inbox.
              </p>

              {!isSubmitted ? (
                <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
                  <input
                    type="email"
                    required
                    placeholder="Enter your email address"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="flex-1 bg-[#141414] border border-white/10 rounded-xl px-4 py-3.5 text-sm text-white focus:outline-none focus:border-[#2DD4BF] transition-colors placeholder-[#555555]"
                  />
                  <button
                    type="submit"
                    className="bg-[#2DD4BF] hover:bg-[#2DD4BF]/90 text-black font-extrabold text-sm px-6 py-3.5 rounded-xl transition-colors shrink-0 flex items-center justify-center gap-2"
                  >
                    Notify Me
                    <ArrowRight className="w-4.5 h-4.5" />
                  </button>
                </form>
              ) : (
                <div className="inline-flex items-center gap-2.5 px-6 py-4 rounded-2xl bg-[#2DD4BF]/10 border border-[#2DD4BF]/20 text-[#2DD4BF] font-bold text-sm max-w-sm mx-auto">
                  <CheckCircle className="w-5 h-5 shrink-0" />
                  You're on the list!
                </div>
              )}
            </div>
          </div>
        </div>
      </section>
    </SEOPageLayout>
  );
};

export default BlogPage;
