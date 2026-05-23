import React from 'react';
import { SEOPageLayout } from './SEOPageLayout';
import { SEO } from '../SEO';
import { ArrowLeft } from 'lucide-react';
import { Link } from 'react-router-dom';

interface BlogPostLayoutProps {
  children: React.ReactNode;
  title: string;
  description: string;
  category: string;
  publishedDate: string;
  wordCount: number;
  slug: string;
}

export const BlogPostLayout: React.FC<BlogPostLayoutProps> = ({
  children,
  title,
  description,
  category,
  publishedDate,
  wordCount,
  slug,
}) => {
  const readTime = Math.ceil(wordCount / 200);

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
    "author": {
      "@type": "Person",
      "name": "Shantanu Sharma"
    },
    "publisher": {
      "@type": "Organization",
      "name": "Somyra",
      "logo": {
        "@type": "ImageObject",
        "url": "https://somyra.online/logo.png"
      }
    }
  };

  return (
    <SEOPageLayout>
      <SEO
        title={`${title} | Somyra Blog`}
        description={description}
        canonical={`https://somyra.online/blog/${slug}`}
        schema={schemaData}
      />
      
      <article className="max-w-3xl mx-auto px-6 py-20">
        <Link 
          to="/blog"
          className="inline-flex items-center gap-2 text-sm font-bold text-[#888888] hover:text-white transition-colors mb-12"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Blog
        </Link>
        
        <header className="mb-12">
          <div className="flex items-center gap-4 mb-6">
            <span className="text-xs font-extrabold text-[#2DD4BF] uppercase tracking-widest bg-[#2DD4BF]/10 border border-[#2DD4BF]/20 px-3 py-1.5 rounded-lg">
              {category}
            </span>
            <span className="text-xs font-bold text-[#555555] uppercase tracking-widest">
              {publishedDate}
            </span>
            <span className="text-xs font-bold text-[#555555] uppercase tracking-widest flex items-center gap-1.5 before:content-[''] before:w-1 before:h-1 before:bg-[#555555] before:rounded-full">
              {readTime} MIN READ
            </span>
          </div>
          
          <h1 className="text-4xl sm:text-5xl font-extrabold tracking-tight text-white leading-[1.15]">
            {title}
          </h1>
        </header>

        <div className="prose prose-invert prose-lg max-w-none prose-headings:font-bold prose-headings:tracking-tight prose-a:text-[#2DD4BF] prose-a:no-underline hover:prose-a:underline prose-p:text-[#888888] prose-p:leading-relaxed prose-li:text-[#888888]">
          {children}
        </div>
      </article>
    </SEOPageLayout>
  );
};
