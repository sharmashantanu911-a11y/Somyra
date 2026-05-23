import React from 'react';
import { Helmet } from 'react-helmet-async';
import { Link } from 'react-router-dom';
import { BlogPostLayout } from '../../components/seo/BlogPostLayout';

const LinkedinOutreachStrategyThatGetsReplies: React.FC = () => {
  return (
    <BlogPostLayout
      category="Outreach"
      title="The LinkedIn Outreach Strategy That Actually Gets Replies"
      wordCount={1400}
      publishedDate="May 18, 2026"
      description="Most outbound on LinkedIn is terrible. This strategy breaks down exactly how to find, approach, and convert high-value prospects without sounding like a spam bot."
      slug="linkedin-outreach-strategy-that-gets-replies"
    >
      <div className="space-y-6">
        <p className="text-[#888888] leading-relaxed">
          The era of spray-and-pray automated outreach on LinkedIn is dead. If you are sending connection requests with generic pitch slaps attached, you are burning your own pipeline. 
        </p>
        <h2 className="text-2xl font-bold text-white mt-8 mb-4">The Relevance-First Approach</h2>
        <p className="text-[#888888] leading-relaxed">
          Relevance scales; personalization does not. Instead of finding out where someone went to college, find out what specific business problem their department is currently wrestling with. Lead with that context, offer a completely free resource to help them, and ask for absolutely nothing in return.
        </p>
      </div>
    </BlogPostLayout>
  );
};

export default LinkedinOutreachStrategyThatGetsReplies;
