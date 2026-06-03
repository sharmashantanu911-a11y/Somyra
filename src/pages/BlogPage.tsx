import React, { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'motion/react';
import { ArrowRight, BookOpen, Mail, CheckCircle, Search, Clock, ChevronRight } from 'lucide-react';
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
    title: "How to Write LinkedIn Posts That Actually Get Engagement",
    excerpt: "Stop posting generic advice that gets ignored. Here is the framework for writing LinkedIn content that your target audience actually wants to read and engage with.",
    category: "Content Writing",
    slug: "how-to-write-linkedin-posts-that-get-engagement",
    publishedDate: "May 23, 2026",
    wordCount: 2000
  },
  {
    title: "The LinkedIn Outreach Strategy That Actually Gets Replies",
    excerpt: "Most outbound on LinkedIn is terrible. This strategy breaks down exactly how to find, approach, and convert high-value prospects without sounding like a spam bot.",
    category: "Outreach",
    slug: "linkedin-outreach-strategy-that-gets-replies",
    publishedDate: "May 23, 2026",
    wordCount: 1800
  },
  {
    title: "The No-Nonsense LinkedIn Personal Branding Guide for Founders",
    excerpt: "Founders don't have time for generic personal branding advice. Here is the framework to build a LinkedIn presence that actually drives pipeline.",
    category: "Personal Brand",
    slug: "linkedin-personal-branding-guide-founders",
    publishedDate: "May 23, 2026",
    wordCount: 2200
  },
  {
    title: "LinkedIn Profile Optimization: The Complete Checklist for 2025",
    excerpt: "Most LinkedIn profiles are passive. They wait for someone to care. This checklist fixes every section so your profile works while you sleep.",
    category: "Profile",
    slug: "linkedin-profile-optimization-checklist",
    publishedDate: "May 23, 2026",
    wordCount: 1800
  },
  {
    title: "How to Write a LinkedIn About Section That Actually Converts",
    excerpt: "Most LinkedIn About sections are either blank or a resume summary. Here is the structure that makes the right people reach out.",
    category: "Profile",
    slug: "how-to-write-linkedin-about-section",
    publishedDate: "May 23, 2026",
    wordCount: 1700
  },
  {
    title: "7 LinkedIn Hook Formulas That Stop the Scroll (With Real Examples)",
    excerpt: "Your first line is the only line most people read. Here are 7 hook formulas that create genuine curiosity with real examples you can adapt today.",
    category: "Content Writing",
    slug: "linkedin-hook-formulas-that-stop-the-scroll",
    publishedDate: "May 23, 2026",
    wordCount: 1600
  },
  {
    title: "The LinkedIn DM Formula That Gets Replies (Without Being Salesy)",
    excerpt: "Most LinkedIn DMs get ignored in the first sentence. Here is the exact message structure with real examples that makes people actually want to reply.",
    category: "Outreach",
    slug: "linkedin-dm-formula-that-gets-replies",
    publishedDate: "May 23, 2026",
    wordCount: 1600
  },
  {
    title: "What to Post on LinkedIn When You Have Absolutely No Ideas",
    excerpt: "Running out of LinkedIn content ideas is not a creativity problem. It is a systems problem. Here are 8 reliable sources of content you already have.",
    category: "Content Writing",
    slug: "what-to-post-on-linkedin-when-you-have-no-ideas",
    publishedDate: "May 23, 2026",
    wordCount: 1600
  },
  {
    title: "Why Most AI LinkedIn Posts Sound Like a Cheerful Robot",
    excerpt: "If your LinkedIn content sounds like an overly enthusiastic robot wrote it, you are losing credibility. Here is why the AI defaults to that tone and how to fix it.",
    category: "Writing",
    slug: "why-linkedin-posts-sound-robotic",
    publishedDate: "May 23, 2026",
    wordCount: 1500
  },
  {
    title: "What Is the Best LinkedIn Post Generator in 2025?",
    excerpt: "An honest breakdown of the best AI LinkedIn post generators including what each does well, who each is built for, and which one actually learns your writing voice.",
    category: "Tools",
    slug: "best-linkedin-post-generator-2025",
    publishedDate: "May 23, 2026",
    wordCount: 1800
  },
  {
    title: "Does LinkedIn Penalize AI-Generated Content? The Honest Answer",
    excerpt: "LinkedIn has not announced any AI content penalty. But there is a real engagement penalty and it has nothing to do with the algorithm.",
    category: "Tools",
    slug: "does-ai-linkedin-content-get-penalized",
    publishedDate: "May 23, 2026",
    wordCount: 1600
  },
  {
    title: "How Long Should a LinkedIn Post Be? The Data-Backed Answer",
    excerpt: "LinkedIn posts have a 3,000 character limit but the optimal length for engagement is much shorter. Here is exactly how long your posts should be.",
    category: "Content Writing",
    slug: "how-long-should-linkedin-post-be",
    publishedDate: "May 23, 2026",
    wordCount: 3200
  }
];

const categories = ["All", "Content Writing", "Outreach", "Profile", "Personal Brand", "Tools", "Writing"];

const schemaData = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "WebPage",
      "@id": "https://somyra.online/blog#webpage",
      "name": "Somyra LinkedIn Growth Blog",
      "url": "https://somyra.online/blog",
      "description": "Practical LinkedIn growth strategy, writing tips, profile auditing guides, and outreach ideas for professionals."
    },
    {
      "@type": "BreadcrumbList",
      "itemListElement": [
        { "@type": "ListItem", "position": 1, "name": "Home", "item": "https://somyra.online/" },
        { "@type": "ListItem", "position": 2, "name": "Blog", "item": "https://somyra.online/blog" }
      ]
    },
    {
      "@type": "CollectionPage",
      "name": "Somyra LinkedIn Growth Blog",
      "description": "Practical LinkedIn growth strategy, writing tips, profile auditing guides, and outreach ideas for professionals."
    }
  ]
};

const BlogPage: React.FC = () => {
  const [email, setEmail] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [activeCategory, setActiveCategory] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');

  const filteredPosts = useMemo(() => {
    let posts = publishedPosts;
    if (activeCategory !== 'All') {
      posts = posts.filter(p => p.category === activeCategory);
    }
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      posts = posts.filter(p =>
        p.title.toLowerCase().includes(q) ||
        p.excerpt.toLowerCase().includes(q) ||
        p.category.toLowerCase().includes(q)
      );
    }
    return posts;
  }, [activeCategory, searchQuery]);

  const featuredPost = filteredPosts.length > 0 ? filteredPosts[0] : null;
  const restPosts = filteredPosts.length > 1 ? filteredPosts.slice(1) : [];

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
        <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-[#2DD4BF]/5 rounded-full blur-[160px] pointer-events-none" />
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-[#0D0D0D] pointer-events-none" />

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

            <h1 className="text-4xl sm:text-6xl font-semibold tracking-tight text-white mb-6 leading-tight">
              LinkedIn Growth,{' '}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#2DD4BF] to-teal-400">
                Straight Talk
              </span>
            </h1>

            <p className="text-lg sm:text-xl text-[#888888] max-w-2xl mx-auto mb-6 leading-relaxed font-medium">
              No generic "10 tips to grow on LinkedIn" content. Just what actually works for founders and professionals building a real audience.
            </p>

            {/* Search bar */}
            <div className="max-w-md mx-auto relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-[#888888]" />
              <input
                type="text"
                placeholder="Search articles..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-[#141414] border border-white/5 rounded-xl pl-11 pr-4 py-3 text-sm text-white placeholder-[#555555] focus:outline-none focus:border-[#2DD4BF]/30 focus:bg-[#1a1a1a] transition-all"
              />
            </div>
          </motion.div>
        </div>
      </section>

      {/* SECTION 2 — Category Filters */}
      <section className="bg-[#0D0D0D] border-t border-white/5 sticky top-0 z-30">
        <div className="max-w-6xl mx-auto px-6 py-4 overflow-x-auto no-scrollbar">
          <div className="flex items-center gap-2 min-w-max">
            {categories.map(cat => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`px-4 py-2 rounded-full text-xs font-bold uppercase tracking-wider transition-all whitespace-nowrap ${
                  activeCategory === cat
                    ? 'bg-[#2DD4BF] text-black'
                    : 'bg-[#141414] text-[#888888] border border-white/5 hover:border-[#2DD4BF]/20 hover:text-white'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* SECTION 3 — Blog Posts */}
      <section className="py-12 sm:py-16 bg-[#0D0D0D]">
        <div className="max-w-6xl mx-auto px-6">
          {filteredPosts.length === 0 ? (
            <div className="text-center py-20">
              <p className="text-[#888888] text-lg">No articles found matching your search.</p>
              <button
                onClick={() => { setActiveCategory('All'); setSearchQuery(''); }}
                className="mt-4 text-[#2DD4BF] font-bold text-sm hover:underline"
              >
                Clear filters
              </button>
            </div>
          ) : (
            <>
              {/* Featured Post */}
              {featuredPost && activeCategory === 'All' && !searchQuery && (
                <Link
                  to={`/blog/${featuredPost.slug}`}
                  className="block bg-gradient-to-br from-[#141414] to-[#0D0D0D] border border-white/5 rounded-3xl p-8 sm:p-10 mb-10 hover:border-[#2DD4BF]/20 transition-all group relative overflow-hidden"
                >
                  <div className="absolute top-0 right-0 w-64 h-64 bg-[#2DD4BF]/[0.03] rounded-full blur-[80px] pointer-events-none" />
                  <div className="relative z-10">
                    <div className="flex items-center gap-3 mb-4">
                      <span className="type-overline font-semibold text-[#2DD4BF] bg-[#2DD4BF]/10 px-2.5 py-1 rounded-md">
                        {featuredPost.category}
                      </span>
                      <span className="type-overline font-bold text-[#888888] flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        {Math.ceil(featuredPost.wordCount / 200)} MIN READ
                      </span>
                    </div>
                    <h2 className="text-2xl sm:text-3xl font-semibold text-white mb-4 leading-tight group-hover:text-[#2DD4BF] transition-colors">
                      {featuredPost.title}
                    </h2>
                    <p className="text-sm text-[#888888] leading-relaxed max-w-2xl mb-6">
                      {featuredPost.excerpt}
                    </p>
                    <span className="inline-flex items-center gap-2 text-sm font-bold text-[#2DD4BF] group-hover:gap-3 transition-all">
                      Read Article <ChevronRight className="w-4 h-4" />
                    </span>
                  </div>
                </Link>
              )}

              {/* Post Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {(featuredPost && activeCategory === 'All' && !searchQuery ? restPosts : filteredPosts).map((post) => (
                  <Link
                    key={post.slug}
                    to={`/blog/${post.slug}`}
                    className="bg-[#141414] border border-white/5 rounded-2xl p-6 flex flex-col justify-between h-full hover:border-[#2DD4BF]/20 hover:-translate-y-1 transition-all group"
                  >
                    <div>
                      <div className="flex items-center justify-between mb-4">
                        <span className="type-overline font-semibold text-[#2DD4BF] bg-[#2DD4BF]/5 px-2.5 py-1 rounded-md">
                          {post.category}
                        </span>
                        <span className="type-overline font-bold text-[#888888] flex items-center gap-1">
                          <Clock className="w-3 h-3" />
                          {Math.ceil(post.wordCount / 200)} MIN
                        </span>
                      </div>

                      <h3 className="text-base font-bold text-white mb-3 leading-snug group-hover:text-[#2DD4BF] transition-colors line-clamp-3">
                        {post.title}
                      </h3>

                      <p className="text-xs text-[#777777] leading-relaxed line-clamp-2">
                        {post.excerpt}
                      </p>
                    </div>

                    <div className="mt-5 pt-4 border-t border-white/5">
                      <span className="inline-flex items-center gap-1.5 text-xs font-bold text-[#888888] group-hover:text-[#2DD4BF] transition-colors">
                        Read more <ArrowRight className="w-3 h-3 transition-transform group-hover:translate-x-0.5" />
                      </span>
                    </div>
                  </Link>
                ))}
              </div>
            </>
          )}
        </div>
      </section>

      {/* SECTION 4 — Email Capture */}
      <section className="py-16 sm:py-20 bg-[#080808] border-t border-white/5">
        <div className="max-w-4xl mx-auto px-6">
          <div className="bg-gradient-to-br from-[#0D0D0D] to-[#141414] border border-white/5 rounded-3xl p-8 sm:p-14 text-center relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-t from-[#2DD4BF]/[0.03] via-transparent to-transparent pointer-events-none" />

            <div className="max-w-xl mx-auto relative z-10">
              <div className="w-14 h-14 rounded-2xl bg-[#2DD4BF]/10 border border-[#2DD4BF]/20 flex items-center justify-center mx-auto mb-6">
                <Mail className="w-6 h-6 text-[#2DD4BF]" />
              </div>

              <h2 className="text-2xl sm:text-3xl font-semibold text-white mb-3">
                Get notified when we publish
              </h2>
              <p className="text-sm sm:text-base text-[#888888] mb-8 max-w-md mx-auto leading-relaxed">
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
                    className="bg-[#2DD4BF] hover:bg-[#2DD4BF]/90 text-black font-semibold text-sm px-6 py-3.5 rounded-xl transition-all shrink-0 flex items-center justify-center gap-2 hover:shadow-[0_0_20px_rgba(45,212,191,0.3)]"
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
