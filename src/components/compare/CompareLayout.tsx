import React from 'react';
import { SEOPageLayout } from '../seo/SEOPageLayout';
import { SEO } from '../SEO';
import { Competitor } from '../../data/compareData';

interface CompareLayoutProps {
  competitor: Competitor;
  pageType: 'compare' | 'alternative';
  children: React.ReactNode;
}

export const CompareLayout: React.FC<CompareLayoutProps> = ({ competitor, pageType, children }) => {
  const isCompare = pageType === 'compare';
  const slug = `somyra-vs-${competitor.id}`;
  const url = `/${pageType}/${slug}`;
  const canonical = `https://somyra.online${url}`;
  const data = isCompare ? competitor.comparison : competitor.alternative;

  const title = isCompare
    ? `Somyra vs ${competitor.name}: Which LinkedIn Tool Is Right for You | Somyra`
    : `Best Alternatives to ${competitor.name} for LinkedIn Growth in 2026 | Somyra`;

  const description = isCompare
    ? `Somyra vs ${competitor.name}: honest comparison of features, pricing, and who each tool is built for. Find out which LinkedIn AI tool actually fits your needs.`
    : `Looking for the best ${competitor.name} alternative for LinkedIn? Somyra offers AI powered voice cloning, profile audits, and smart outreach. Starting at free.`;

  return (
    <SEOPageLayout>
      <SEO
        title={title}
        description={description}
        canonical={canonical}
        schema={data.schema}
      />
      {children}
    </SEOPageLayout>
  );
};
