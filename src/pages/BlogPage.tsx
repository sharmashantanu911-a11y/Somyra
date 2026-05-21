import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'motion/react';
import { ArrowRight, BookOpen, Mail, Clock, Calendar, CheckCircle } from 'lucide-react';
import { SEOPageLayout } from '../components/seo/SEOPageLayout';
import { SEO } from '../components/SEO';

interface BlogPost {
  title: string;
  excerpt: string;
  category: string;
  slug: string;
  publishedDate: string;
  wordCount: number;
}

const publishedPosts: BlogPost[] = [
  {
    title: "LinkedIn Profile Optimization: The Complete Checklist for 2025",
    excerpt: "Most LinkedIn profiles are passive. They wait for someone to care. This checklist fixes every section — headline, About, experience, featured — so your profile works while you sleep.",
    category: "Profile",
    slug: "linkedin-profile-optimization-checklist",
    publishedDate: "May 21, 2026",
    wordCount: 1200
  },
  {
    title: "LinkedIn Outreach Strategy That Actually Gets Replies (Without Being Annoying)",
    excerpt: "Cold LinkedIn outreach fails because it leads with the ask. Here is the exact framework — relevance first, value before ask, follow-up that does not grovel — that gets real replies.",
    category: "Outreach",
    slug: "linkedin-outreach-strategy-that-gets-replies",
    publishedDate: "May 21, 2026",
    wordCount: 1400
  },
  {
    title: "How to Write LinkedIn Posts That Get Real Engagement (Not Just Pity Likes)",
    excerpt: "Most LinkedIn posts get ignored because they follow the same tired template. Here is what actually drives comments, shares, and inbound — with examples.",
    category: "Content Writing",
    slug: "how-to-write-linkedin-posts-that-get-engagement",
    publishedDate: "May 21, 2026",
    wordCount: 1400
  },
  {
    title: "LinkedIn Personal Branding for Founders: The No-Fluff Guide (2025)",
    excerpt: "Most founder LinkedIn profiles are forgettable. Here's the exact framework to build a personal brand that attracts clients, investors, and talent — without posting cringe content.",
    category: "Personal Brand",
    slug: "linkedin-personal-branding-guide-founders",
    publishedDate: "May 21, 2026",
    wordCount: 1600
  },
  {
    title: "Why Your LinkedIn Posts Sound Robotic (And How to Fix It)",
    excerpt: "How generic AI content models dilute personal brands, and how to train models using your personal writing DNA to achieve authenticity at scale.",
    category: "Writing",
    slug: "why-linkedin-posts-sound-robotic",
    publishedDate: "May 19, 2026",
    wordCount: 820
  },
  {
    title: "The Only LinkedIn Outreach Strategy That Doesn't Make People Cringe",
    excerpt: "Why pitch-slapping connectees on connection request triggers instant archives, and how to write contextual relevance hooks that convert into meetings.",
    category: "Outreach",
    slug: "linkedin-outreach-strategy-cringe",
    publishedDate: "May 18, 2026",
    wordCount: 910
  },
  {
    title: "How to Write a LinkedIn About Section That Converts",
    excerpt: "Transforming a dry, bulleted work history into a compelling positioning narrative designed to convert profile viewers into warm outbound inquiries.",
    category: "Profile",
    slug: "linkedin-about-section-converts",
    publishedDate: "May 17, 2026",
    wordCount: 760
  }
];

const schemaData = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "Blog",
      "@id": "https://somyra.online/blog#blog",
      "name": "Somyra LinkedIn Growth Blog",
      "url": "https://somyra.online/blog",
      "description": "Practical LinkedIn growth strategy, writing tips, profile auditing guides, and outreach ideas for professionals.",
      "publisher": {
        "@type": "Organization",
        "name": "Somyra"
      },
      "blogPost": publishedPosts.map(post => ({
        "@type": "BlogPosting",
        "headline": post.title,
        "description": post.excerpt,
        "datePublished": post.publishedDate,
        "url": `https://somyra.online/blog/${post.slug}`
      }))
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

      {/* SECTION 2 — Published Posts */}
      <section className="py-20 bg-[#0D0D0D] border-t border-white/5">
        <div className="max-w-6xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-extrabold text-white">Latest Articles</h2>
            <p className="text-[#888888] mt-2 text-sm">Deep-dive strategies and tactics for LinkedIn personal branding.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {publishedPosts.map((post, index) => {
              const readingTime = Math.max(1, Math.ceil(post.wordCount / 200));
              return (
                <div 
                  key={index}
                  className="bg-[#141414] border border-white/5 rounded-3xl p-8 flex flex-col justify-between h-full hover:border-[#2DD4BF]/20 hover:shadow-[0_0_30px_rgba(45,212,191,0.05)] transition-all group"
                >
                  <div>
                    <div className="flex items-center justify-between mb-6">
                      <span className="text-xs font-extrabold text-[#2DD4BF] uppercase tracking-widest bg-[#2DD4BF]/10 px-2.5 py-1 rounded-md">
                        {post.category}
                      </span>
                      <div className="flex items-center gap-1.5 text-[11px] text-[#555555] font-bold uppercase tracking-wider">
                        <Clock className="w-3.5 h-3.5" />
                        <span>{readingTime} Min Read</span>
                      </div>
                    </div>
                    
                    <Link to={`/blog/${post.slug}`}>
                      <h3 className="text-xl font-bold text-white mb-4 leading-snug group-hover:text-[#2DD4BF] transition-colors line-clamp-2">
                        {post.title}
                      </h3>
                    </Link>
                    
                    <p className="text-sm text-[#888888] leading-relaxed mb-6 line-clamp-3">
                      {post.excerpt}
                    </p>
                  </div>

                  <div className="border-t border-white/5 pt-6 flex items-center justify-between mt-auto">
                    <span className="text-[11px] font-bold text-[#555555] uppercase tracking-wider">{post.publishedDate}</span>
                    <Link 
                      to={`/blog/${post.slug}`}
                      className="flex items-center gap-1 text-[11px] font-bold text-[#2DD4BF] uppercase tracking-wider hover:text-white transition-colors"
                    >
                      Read Post
                      <ArrowRight className="w-3 h-3 transition-transform group-hover:translate-x-1" />
                    </Link>
                  </div>
                </div>
              );
            })}
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
                    Subscribe
                    <ArrowRight className="w-4 h-4" />
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
