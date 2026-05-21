import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { SEO } from '../SEO';
import { Clock, Calendar, User, ArrowRight, CheckCircle, Mail, Sparkles, MessageSquare, Target, Lightbulb, PenTool, Send } from 'lucide-react';

interface BlogPostLayoutProps {
  children: React.ReactNode;
  category: string;
  title: string;
  wordCount: number;
  publishedDate: string;
  description: string;
  slug: string;
}

export const BlogPostLayout: React.FC<BlogPostLayoutProps> = ({
  children,
  category,
  title,
  wordCount,
  publishedDate,
  description,
  slug,
}) => {
  const [email, setEmail] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(false);

  const readingTime = Math.max(1, Math.ceil(wordCount / 200));
  const canonicalUrl = `https://somyra.online/blog/${slug}`;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (email.trim()) {
      setIsSubmitted(true);
      setEmail('');
    }
  };

  const relatedTools = [
    {
      name: 'LinkedIn Post Generator',
      description: 'Generate LinkedIn posts in your own voice — not robotic AI output.',
      link: '/linkedin-post-generator?utm_source=seo&utm_medium=organic&utm_campaign=blog-related-post-gen',
      icon: PenTool,
    },
    {
      name: 'LinkedIn Profile Audit',
      description: "Find out exactly what's wrong with your LinkedIn profile headline & sections.",
      link: '/linkedin-profile-audit?utm_source=seo&utm_medium=organic&utm_campaign=blog-related-profile-audit',
      icon: User,
    },
    {
      name: 'LinkedIn DM Generator',
      description: 'Write personalized outreach messages based on the recipient\'s profile.',
      link: '/linkedin-dm-generator?utm_source=seo&utm_medium=organic&utm_campaign=blog-related-dm-gen',
      icon: Send,
    },
    {
      name: 'LinkedIn Hook Generator',
      description: 'Generate scroll-stopping hooks matched to your voice and topic.',
      link: '/linkedin-hook-generator?utm_source=seo&utm_medium=organic&utm_campaign=blog-related-hook-gen',
      icon: Target,
    },
    {
      name: 'LinkedIn Topic Generator',
      description: 'Get unlimited LinkedIn content ideas tailored to your niche and audience.',
      link: '/linkedin-topic-generator?utm_source=seo&utm_medium=organic&utm_campaign=blog-related-topic-gen',
      icon: Lightbulb,
    },
  ];

  const schemaData = {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    "mainEntityOfPage": {
      "@type": "WebPage",
      "@id": canonicalUrl
    },
    "headline": title,
    "description": description,
    "datePublished": publishedDate,
    "author": {
      "@type": "Person",
      "name": "Shantanu Sharma",
      "url": "https://www.linkedin.com/in/sharmashantanu911"
    },
    "publisher": {
      "@type": "Organization",
      "name": "Somyra",
      "logo": {
        "@type": "ImageObject",
        "url": "https://somyra.online/favicon.png"
      }
    }
  };

  return (
    <div 
      className="min-h-screen bg-[#080808] text-white flex flex-col justify-between"
      style={{ fontFamily: "'DM Sans', sans-serif" }}
    >
      <SEO
        title={`${title} | Somyra Blog`}
        description={description}
        canonical={canonicalUrl}
        schema={schemaData}
      />

      <Helmet>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700&display=swap" rel="stylesheet" />
      </Helmet>

      {/* Top Navigation */}
      <header className="border-b border-white/5 bg-[#0D0D0D]/80 backdrop-blur-md sticky top-0 z-50">
        <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-3 hover:opacity-90 transition-opacity">
            <svg className="w-6 h-6 text-[#2DD4BF]" viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
              <path d="M3 3h18v6H9v2h12v10H3v-6h12v-2H3V3z" />
            </svg>
            <span className="text-xl font-bold tracking-tight text-white">Somyra</span>
          </Link>

          <Link 
            to="/?utm_source=seo&utm_medium=organic&utm_campaign=blog-post-nav" 
            className="px-5 py-2.5 bg-[#2DD4BF] text-black font-bold rounded-xl hover:shadow-[0_0_20px_rgba(45,212,191,0.4)] hover:bg-[#2DD4BF]/90 transition-all text-sm"
          >
            Try Somyra Free
          </Link>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="flex-grow py-12 sm:py-20">
        <div className="max-w-6xl mx-auto px-6">
          
          {/* Article Header */}
          <div className="max-w-3xl mb-12">
            <span className="inline-block px-3 py-1 bg-[#2DD4BF]/10 text-[#2DD4BF] text-xs font-semibold rounded-full uppercase tracking-wider mb-6">
              {category}
            </span>
            <h1 className="text-3xl sm:text-5xl font-extrabold text-white leading-tight mb-6">
              {title}
            </h1>
            <div className="flex flex-wrap items-center gap-x-6 gap-y-2 text-xs text-[#888888] font-medium border-b border-white/5 pb-6">
              <div className="flex items-center gap-1.5">
                <User className="w-3.5 h-3.5 text-[#555555]" />
                <span>By Shantanu Sharma · Somyra</span>
              </div>
              <div className="flex items-center gap-1.5">
                <Calendar className="w-3.5 h-3.5 text-[#555555]" />
                <span>{publishedDate}</span>
              </div>
              <div className="flex items-center gap-1.5">
                <Clock className="w-3.5 h-3.5 text-[#555555]" />
                <span>{readingTime} min read</span>
              </div>
            </div>
          </div>

          {/* Grid Layout: Main article body + sticky CTA */}
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-12 items-start">
            
            {/* Article Body */}
            <article className="lg:col-span-3 prose prose-invert prose-teal max-w-none text-[#888888] leading-relaxed text-base sm:text-lg space-y-6">
              {children}
            </article>

            {/* Sticky Sidebar CTA */}
            <aside className="lg:col-span-1 lg:sticky lg:top-24 space-y-6">
              <div className="bg-[#141414] border border-[#2DD4BF]/20 rounded-2xl p-6 shadow-2xl relative overflow-hidden">
                <div className="absolute inset-0 bg-radial-at-t from-[#2DD4BF]/5 via-transparent to-transparent pointer-events-none" />
                <div className="relative z-10">
                  <div className="w-10 h-10 bg-[#2DD4BF]/10 rounded-xl flex items-center justify-center mb-4 text-[#2DD4BF]">
                    <Sparkles className="w-5 h-5" />
                  </div>
                  <h4 className="text-base font-extrabold text-white mb-2 leading-snug">
                    Writing LinkedIn posts manually?
                  </h4>
                  <p className="text-[#888888] text-xs leading-relaxed mb-6">
                    Let Somyra do it in your voice. Our AI learns your unique writing style and builds content that gets engagement.
                  </p>
                  <Link
                    to="/?utm_source=seo&utm_medium=organic&utm_campaign=blog-sidebar-cta"
                    className="block w-full py-3 bg-[#2DD4BF] text-black font-extrabold rounded-xl hover:shadow-[0_0_20px_rgba(45,212,191,0.3)] hover:bg-[#2DD4BF]/90 text-center text-xs transition-all"
                  >
                    Try Free
                  </Link>
                </div>
              </div>
            </aside>

          </div>

          {/* Related Tools Section */}
          <section className="mt-20 pt-16 border-t border-white/5">
            <h3 className="text-2xl font-extrabold text-white mb-8">Related Tools</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-6">
              {relatedTools.map((tool, idx) => (
                <Link 
                  key={idx}
                  to={tool.link} 
                  className="bg-[#141414] border border-white/5 rounded-2xl p-6 hover:border-[#2DD4BF]/20 hover:shadow-[0_0_20px_rgba(45,212,191,0.05)] transition-all flex flex-col justify-between h-full group"
                >
                  <div>
                    <div className="w-10 h-10 bg-[#2DD4BF]/5 border border-white/5 rounded-lg flex items-center justify-center mb-4 text-[#2DD4BF] group-hover:bg-[#2DD4BF]/10 transition-colors">
                      <tool.icon className="w-5 h-5" />
                    </div>
                    <h4 className="text-sm font-bold text-white mb-2 group-hover:text-[#2DD4BF] transition-colors">{tool.name}</h4>
                    <p className="text-xs text-[#888888] leading-relaxed">{tool.description}</p>
                  </div>
                  <div className="mt-4 flex items-center gap-1 text-[11px] font-bold text-[#2DD4BF] uppercase tracking-wider">
                    Use Tool
                    <ArrowRight className="w-3 h-3 transition-transform group-hover:translate-x-1" />
                  </div>
                </Link>
              ))}
            </div>
          </section>

          {/* Newsletter Signup Box */}
          <section className="mt-20">
            <div className="bg-[#141414] border border-white/5 rounded-3xl p-8 sm:p-12 text-center relative overflow-hidden shadow-2xl">
              <div className="absolute inset-0 bg-radial-at-t from-[#2DD4BF]/5 via-transparent to-transparent pointer-events-none" />
              <div className="max-w-xl mx-auto relative z-10">
                <div className="w-12 h-12 bg-[#2DD4BF]/10 rounded-full flex items-center justify-center mb-6 mx-auto text-[#2DD4BF]">
                  <Mail className="w-5 h-5" />
                </div>
                <h3 className="text-2xl sm:text-3xl font-extrabold text-white mb-4">
                  Get LinkedIn growth insights weekly. No fluff.
                </h3>
                <p className="text-[#888888] text-sm sm:text-base mb-8 font-medium">
                  We write strategy-first, detailed organic marketing breakdowns and style audit case studies. Zero fluff.
                </p>

                {!isSubmitted ? (
                  <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
                    <input
                      type="email"
                      required
                      placeholder="Enter your email address"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="flex-1 bg-[#080808] border border-white/10 rounded-xl px-4 py-3.5 text-sm text-white focus:outline-none focus:border-[#2DD4BF] transition-colors placeholder-[#555555]"
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
                    Successfully Subscribed!
                  </div>
                )}
              </div>
            </div>
          </section>

        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-white/5 bg-[#0D0D0D] py-12 mt-20">
        <div className="max-w-6xl mx-auto px-6">
          <div className="flex flex-col md:flex-row justify-between items-center gap-6 md:gap-0">
            
            {/* Logo and Credits */}
            <div className="flex flex-col items-center md:items-start gap-2">
              <Link to="/" className="flex items-center gap-2 hover:opacity-90 transition-opacity">
                <svg className="w-5 h-5 text-[#2DD4BF]" viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
                  <path d="M3 3h18v6H9v2h12v10H3v-6h12v-2H3V3z" />
                </svg>
                <span className="text-base font-bold text-white">Somyra</span>
              </Link>
              <p className="text-[11px] text-[#888888] font-bold uppercase tracking-[0.2em] text-center md:text-left">
                © 2026 Somyra AI. All rights reserved.
              </p>
            </div>

            {/* Legal Links */}
            <div className="flex items-center gap-6 md:gap-8">
              <Link 
                to="/terms" 
                className="text-[12px] font-bold uppercase tracking-widest text-[#888888] hover:text-[#2DD4BF] transition-all duration-300"
              >
                Terms
              </Link>
              <Link 
                to="/privacy" 
                className="text-[12px] font-bold uppercase tracking-widest text-[#888888] hover:text-[#2DD4BF] transition-all duration-300"
              >
                Privacy
              </Link>
              <Link 
                to="/contact" 
                className="text-[12px] font-bold uppercase tracking-widest text-[#888888] hover:text-[#2DD4BF] transition-all duration-300"
              >
                Contact
              </Link>
            </div>

          </div>
        </div>
      </footer>
    </div>
  );
};
