import React from 'react';
import { Link } from 'react-router-dom';
import { getCompetitorBySlug, getCompareUrl } from '../../data/compareData';
import { CompareLayout } from '../../components/compare/CompareLayout';
import { CompareHero } from '../../components/compare/CompareHero';
import { QuickSummary } from '../../components/compare/QuickSummary';
import { ComparisonTable } from '../../components/compare/ComparisonTable';
import { ChooseSection } from '../../components/compare/ChooseSection';
import { FAQSection } from '../../components/compare/FAQ';
import { CTASection } from '../../components/compare/CTA';

interface ComparePageProps {
  competitorId: string;
}

const ComparePage: React.FC<ComparePageProps> = ({ competitorId }) => {
  const competitor = getCompetitorBySlug(competitorId);

  if (!competitor) {
    return (
      <div className="min-h-screen bg-[#080808] flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-4xl font-bold text-white mb-4">Comparison Not Found</h1>
          <p className="text-[#888888] mb-6">We couldn't find that comparison page.</p>
          <Link to="/compare" className="text-[#2DD4BF] hover:underline font-semibold">View all comparisons</Link>
        </div>
      </div>
    );
  }

  const { comparison } = competitor;
  const slug = `somyra-vs-${competitor.id}`;

  return (
    <CompareLayout competitor={competitor} pageType="compare">
      <CompareHero
        tagline={comparison.tagline}
        description={comparison.description}
        competitorName={competitor.name}
      />
      <QuickSummary
        summarySomyra={comparison.summarySomyra}
        summaryCompetitor={comparison.summaryCompetitor}
        competitorName={competitor.name}
        slug={slug}
      />
      <ComparisonTable
        features={comparison.features}
        competitorName={competitor.name}
      />
      <ChooseSection
        chooseSomyra={comparison.chooseSomyra}
        chooseCompetitor={comparison.chooseCompetitor}
        competitorName={competitor.name}
      />
      <FAQSection faqs={comparison.faqs} />
      <CTASection slug={slug} pageType="compare" />
    </CompareLayout>
  );
};

export default ComparePage;
