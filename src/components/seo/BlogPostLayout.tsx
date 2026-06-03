import React, { useState, useEffect, useCallback } from 'react';
import { SEOPageLayout } from './SEOPageLayout';
import { SEO } from '../SEO';
import { ArrowLeft, Linkedin, Twitter, Link as LinkIcon, ChevronUp, Clock, User, BookOpen } from 'lucide-react';
import { Link } from 'react-router-dom';

const proseStyles = `
  .blog-content p a, .blog-content li a, .blog-content blockquote a {
    color: #2DD4BF !important;
    font-weight: 600 !important;
    text-decoration: none !important;
  }
  .blog-content p a:hover, .blog-content li a:hover, .blog-content blockquote a:hover {
    text-decoration: underline !important;
  }
`;

interface BlogPostLayoutProps {
  children: React.ReactNode;
  title: string;
  description: string;
  category: string;
  publishedDate: string;
  wordCount: number;
  slug: string;
  faqSchema?: object;
}

const allPosts = [
  { title: "How to Write LinkedIn Posts That Actually Get Engagement", slug: "how-to-write-linkedin-posts-that-get-engagement", category: "Content Writing", wordCount: 2000 },
  { title: "The LinkedIn Outreach Strategy That Actually Gets Replies", slug: "linkedin-outreach-strategy-that-gets-replies", category: "Outreach", wordCount: 1800 },
  { title: "The No-Nonsense LinkedIn Personal Branding Guide for Founders", slug: "linkedin-personal-branding-guide-founders", category: "Personal Brand", wordCount: 2200 },
  { title: "LinkedIn Profile Optimization: The Complete Checklist for 2025", slug: "linkedin-profile-optimization-checklist", category: "Profile", wordCount: 1800 },
  { title: "How to Write a LinkedIn About Section That Actually Converts", slug: "how-to-write-linkedin-about-section", category: "Profile", wordCount: 1700 },
  { title: "7 LinkedIn Hook Formulas That Stop the Scroll (With Real Examples)", slug: "linkedin-hook-formulas-that-stop-the-scroll", category: "Content Writing", wordCount: 1600 },
  { title: "The LinkedIn DM Formula That Gets Replies (Without Being Salesy)", slug: "linkedin-dm-formula-that-gets-replies", category: "Outreach", wordCount: 1600 },
  { title: "What to Post on LinkedIn When You Have Absolutely No Ideas", slug: "what-to-post-on-linkedin-when-you-have-no-ideas", category: "Content Writing", wordCount: 1600 },
  { title: "Why Most AI LinkedIn Posts Sound Like a Cheerful Robot", slug: "why-linkedin-posts-sound-robotic", category: "Writing", wordCount: 1500 },
  { title: "What Is the Best LinkedIn Post Generator in 2025?", slug: "best-linkedin-post-generator-2025", category: "Tools", wordCount: 1800 },
  { title: "Does LinkedIn Penalize AI-Generated Content? The Honest Answer", slug: "does-ai-linkedin-content-get-penalized", category: "Tools", wordCount: 1600 },
  { title: "How Long Should a LinkedIn Post Be? The Data-Backed Answer", slug: "how-long-should-linkedin-post-be", category: "Content Writing", wordCount: 3200 },
];

export const BlogPostLayout: React.FC<BlogPostLayoutProps> = ({
  children,
  title,
  description,
  category,
  publishedDate,
  wordCount,
  slug,
  faqSchema,
}) => {
  const [scrollProgress, setScrollProgress] = useState(0);
  const [showBackToTop, setShowBackToTop] = useState(false);

  const readTime = Math.ceil(wordCount / 200);

  useEffect(() => {
    const handleScroll = () => {
      const scrollTop = window.scrollY;
      const docHeight = document.documentElement.scrollHeight - window.innerHeight;
      setScrollProgress(docHeight > 0 ? Math.min((scrollTop / docHeight) * 100, 100) : 0);
      setShowBackToTop(scrollTop > 400);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToTop = useCallback(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  const currentIndex = allPosts.findIndex(p => p.slug === slug);
  const prevPost = currentIndex > 0 ? allPosts[currentIndex - 1] : null;
  const nextPost = currentIndex < allPosts.length - 1 ? allPosts[currentIndex + 1] : null;

  const relatedPosts = allPosts
    .filter(p => p.category === category && p.slug !== slug)
    .slice(0, 4);

  const latestPosts = allPosts
    .filter(p => p.slug !== slug && !relatedPosts.some(r => r.slug === p.slug))
    .slice(0, 3);

  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "itemListElement": [
      { "@type": "ListItem", "position": 1, "name": "Home", "item": "https://somyra.online" },
      { "@type": "ListItem", "position": 2, "name": "Blog", "item": "https://somyra.online/blog" },
      { "@type": "ListItem", "position": 3, "name": title, "item": `https://somyra.online/blog/${slug}` }
    ]
  };

  const extraSchemas = [breadcrumbSchema];
  if (faqSchema) {
    extraSchemas.push(faqSchema);
  }

  const schemaData = {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    "mainEntityOfPage": {
      "@type": "WebPage",
      "@id": `https://somyra.online/blog/${slug}`
    },
    "headline": title,
    "description": description,
    "datePublished": new Date(publishedDate).toISOString(),
    "dateModified": new Date(publishedDate).toISOString(),
    "author": {
      "@type": "Person",
      "name": "Shantanu Sharma"
    },
    "publisher": {
      "@type": "Organization",
      "name": "Somyra",
      "logo": {
        "@type": "ImageObject",
        "url": "https://somyra.online/og-image.webp"
      }
    },
    "image": {
      "@type": "ImageObject",
      "url": "https://somyra.online/og-image.webp",
      "width": 1200,
      "height": 630
    },
    "wordCount": wordCount,
    "timeRequired": `PT${readTime}M`
  };

  const shareUrl = `https://somyra.online/blog/${slug}`;
  const shareText = `${title} — Somyra Blog`;

  return (
    <SEOPageLayout>
      <SEO
        title={`${title} | Somyra Blog`}
        description={description}
        canonical={shareUrl}
        ogImage={`https://somyra.online/og-image.webp`}
        ogType="article"
        schema={schemaData}
        schemas={extraSchemas}
      />

      {/* Reading Progress Bar */}
      <div className="fixed top-0 left-0 right-0 z-[60] h-[3px] bg-[#080808]">
        <div
          className="h-full bg-gradient-to-r from-[#2DD4BF] to-teal-400 transition-all duration-150 ease-out"
          style={{ width: `${scrollProgress}%` }}
        />
      </div>

      <article className="max-w-3xl mx-auto px-6 py-16 sm:py-20">
        <Link
          to="/blog"
          className="inline-flex items-center gap-2 text-sm font-bold text-[#888888] hover:text-white transition-colors mb-10 group"
        >
          <ArrowLeft className="w-4 h-4 transition-transform group-hover:-translate-x-1" />
          Back to Blog
        </Link>

        {/* Header */}
        <header className="mb-12">
          <div className="flex flex-wrap items-center gap-3 mb-5">
            <span className="type-overline text-[#2DD4BF] bg-[#2DD4BF]/10 border border-[#2DD4BF]/20 px-3 py-1.5 rounded-lg">
              {category}
            </span>
            <span className="type-overline font-bold text-[#555555] flex items-center gap-1.5">
              <Clock className="w-3 h-3" />
              {publishedDate}
            </span>
            <span className="type-overline font-bold text-[#555555] flex items-center gap-1.5">
              <BookOpen className="w-3 h-3" />
              {readTime} MIN READ
            </span>
          </div>

          <h1 className="text-[clamp(1.75rem,5vw,3rem)] font-semibold tracking-tight text-white leading-[1.12] mb-6">
            {title}
          </h1>

          <p className="text-base sm:text-lg text-[#888888] leading-relaxed max-w-2xl">
            {description}
          </p>

          {/* Author strip */}
          <div className="flex items-center gap-3 mt-8 pt-6 border-t border-white/5">
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#2DD4BF] to-teal-600 flex items-center justify-center text-black font-bold text-sm">
              SS
            </div>
            <div>
              <p className="text-sm font-bold text-white">Shantanu Sharma</p>
              <p className="text-xs text-[#555555]">Founder, Somyra</p>
            </div>
          </div>
        </header>

        {/* Content */}
        <style>{proseStyles}</style>
        <div className="blog-content prose prose-invert prose-lg max-w-none
          prose-headings:font-semibold prose-headings:tracking-tight prose-headings:text-white
          prose-h2:text-[clamp(1.35rem,3.5vw,1.75rem)] prose-h2:mt-12 prose-h2:mb-4
          prose-h3:text-[clamp(1.1rem,2.5vw,1.35rem)] prose-h3:mt-8 prose-h3:mb-3
          prose-p:text-[#A0A0A0] prose-p:leading-[1.75] prose-p:text-[16px]
          prose-strong:text-white prose-strong:font-bold
          prose-li:text-[#A0A0A0] prose-li:leading-[1.75]
          prose-blockquote:border-l-[#2DD4BF] prose-blockquote:text-[#A0A0A0] prose-blockquote:font-normal prose-blockquote:not-italic
          prose-code:text-[#2DD4BF] prose-code:bg-[#141414] prose-code:px-1.5 prose-code:py-0.5 prose-code:rounded-md prose-code:text-sm
          prose-hr:border-white/5
          prose-img:rounded-2xl prose-img:border prose-img:border-white/5
          [&_.bg-\[\#0D0D0D\]]:my-8 [&_.bg-\[\#141414\]]:my-8">
          {children}
        </div>

        {/* Social Sharing */}
        <div className="mt-12 pt-8 border-t border-white/5">
          <p className="text-sm font-bold text-white mb-4">Share this article</p>
          <div className="flex items-center gap-3">
            <a
              href={`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(shareUrl)}`}
              target="_blank"
              rel="noopener noreferrer"
              className="w-10 h-10 rounded-full bg-[#141414] border border-white/5 flex items-center justify-center text-[#888888] hover:text-[#2DD4BF] hover:border-[#2DD4BF]/20 hover:bg-[#2DD4BF]/5 transition-all"
              aria-label="Share on LinkedIn"
            >
              <Linkedin className="w-4 h-4" />
            </a>
            <a
              href={`https://twitter.com/intent/tweet?text=${encodeURIComponent(shareText)}&url=${encodeURIComponent(shareUrl)}`}
              target="_blank"
              rel="noopener noreferrer"
              className="w-10 h-10 rounded-full bg-[#141414] border border-white/5 flex items-center justify-center text-[#888888] hover:text-[#2DD4BF] hover:border-[#2DD4BF]/20 hover:bg-[#2DD4BF]/5 transition-all"
              aria-label="Share on Twitter"
            >
              <Twitter className="w-4 h-4" />
            </a>
            <button
              onClick={() => { navigator.clipboard.writeText(shareUrl); }}
              className="w-10 h-10 rounded-full bg-[#141414] border border-white/5 flex items-center justify-center text-[#888888] hover:text-[#2DD4BF] hover:border-[#2DD4BF]/20 hover:bg-[#2DD4BF]/5 transition-all"
              aria-label="Copy link"
            >
              <LinkIcon className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Related Posts */}
        {relatedPosts.length > 0 && (
          <div className="mt-12 pt-8 border-t border-white/5">
            <p className="text-sm font-bold text-white mb-5">Related Articles</p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {relatedPosts.map(post => (
                <Link
                  key={post.slug}
                  to={`/blog/${post.slug}`}
                  className="bg-[#141414] border border-white/5 rounded-xl p-5 hover:border-[#2DD4BF]/20 transition-all group"
                >
                  <span className="type-caption text-[#555555]">
                    {post.category}
                  </span>
                  <h4 className="text-sm font-bold text-white mt-2 leading-snug group-hover:text-[#2DD4BF] transition-colors">
                    {post.title}
                  </h4>
                </Link>
              ))}
            </div>
          </div>
        )}

        {/* Latest Articles */}
        {latestPosts.length > 0 && (
          <div className="mt-12 pt-8 border-t border-white/5">
            <p className="text-sm font-bold text-white mb-5">Latest Articles</p>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {latestPosts.map(post => (
                <Link
                  key={post.slug}
                  to={`/blog/${post.slug}`}
                  className="bg-[#141414] border border-white/5 rounded-xl p-5 hover:border-[#2DD4BF]/20 transition-all group"
                >
                  <span className="type-caption text-[#555555]">
                    {post.category}
                  </span>
                  <h4 className="text-sm font-bold text-white mt-2 leading-snug group-hover:text-[#2DD4BF] transition-colors">
                    {post.title}
                  </h4>
                </Link>
              ))}
            </div>
          </div>
        )}

        {/* Prev / Next Navigation */}
        {(prevPost || nextPost) && (
          <div className="mt-12 pt-8 border-t border-white/5 grid grid-cols-2 gap-4">
            {prevPost ? (
              <Link
                to={`/blog/${prevPost.slug}`}
                className="bg-[#141414] border border-white/5 rounded-xl p-5 hover:border-[#2DD4BF]/20 transition-all group text-left"
              >
                <span className="type-caption text-[#555555]">Previous</span>
                <h4 className="text-sm font-bold text-white mt-1 leading-snug group-hover:text-[#2DD4BF] transition-colors">
                  {prevPost.title}
                </h4>
              </Link>
            ) : <div />}
            {nextPost ? (
              <Link
                to={`/blog/${nextPost.slug}`}
                className="bg-[#141414] border border-white/5 rounded-xl p-5 hover:border-[#2DD4BF]/20 transition-all group text-right"
              >
                <span className="type-caption text-[#555555]">Next</span>
                <h4 className="text-sm font-bold text-white mt-1 leading-snug group-hover:text-[#2DD4BF] transition-colors">
                  {nextPost.title}
                </h4>
              </Link>
            ) : <div />}
          </div>
        )}

        {/* Author Bio */}
        <div className="mt-12 p-6 sm:p-8 bg-gradient-to-br from-[#0D0D0D] to-[#141414] border border-white/5 rounded-2xl">
          <div className="flex items-start gap-4">
            <div className="w-14 h-14 rounded-full bg-gradient-to-br from-[#2DD4BF] to-teal-600 flex items-center justify-center text-black font-bold text-lg shrink-0">
              SS
            </div>
            <div>
              <p className="text-base font-bold text-white mb-1">Shantanu Sharma</p>
              <p className="text-sm text-[#888888] leading-relaxed mb-3">
                Founder of Somyra. I write about LinkedIn strategy, content writing, and building a personal brand that actually drives business results.
              </p>
              <Link
                to="/?utm_source=seo&utm_medium=organic&utm_campaign=blog-author-bio"
                className="inline-flex items-center gap-1.5 text-sm font-bold text-[#2DD4BF] hover:underline"
              >
                Try Somyra for free
                <ArrowLeft className="w-3.5 h-3.5 rotate-180" />
              </Link>
            </div>
          </div>
        </div>
      </article>

      {/* Back to Top */}
      {showBackToTop && (
        <button
          onClick={scrollToTop}
          className="fixed bottom-8 right-8 w-12 h-12 rounded-full bg-[#2DD4BF] text-black flex items-center justify-center shadow-lg hover:shadow-[0_0_20px_rgba(45,212,191,0.4)] transition-all hover:-translate-y-1 z-50"
          aria-label="Back to top"
        >
          <ChevronUp className="w-5 h-5" />
        </button>
      )}
    </SEOPageLayout>
  );
};
