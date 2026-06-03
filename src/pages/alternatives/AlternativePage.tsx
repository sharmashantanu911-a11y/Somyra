import React from 'react';
import { Link } from 'react-router-dom';
import { getCompetitorBySlug } from '../../data/compareData';
import { CompareLayout } from '../../components/compare/CompareLayout';
import { AlternativeHero } from '../../components/compare/AlternativeHero';
import { PainPoints } from '../../components/compare/PainPoints';
import { WhySomyra } from '../../components/compare/WhySomyra';
import { FAQSection } from '../../components/compare/FAQ';
import { CTASection } from '../../components/compare/CTA';

interface AlternativePageProps {
  competitorId: string;
}

const AlternativePage: React.FC<AlternativePageProps> = ({ competitorId }) => {
  const competitor = getCompetitorBySlug(competitorId);

  if (!competitor) {
    return (
      <div className="min-h-screen bg-[#080808] flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-4xl font-bold text-white mb-4">Alternatives Not Found</h1>
          <p className="text-[#888888] mb-6">We couldn't find that alternatives page.</p>
          <Link to="/alternatives" className="text-[#2DD4BF] hover:underline font-semibold">View all alternatives</Link>
        </div>
      </div>
    );
  }

  const { alternative } = competitor;
  const slug = `somyra-vs-${competitor.id}`;

  return (
    <CompareLayout competitor={competitor} pageType="alternative">
      <AlternativeHero
        tagline={alternative.tagline}
        description={alternative.description}
        competitorName={competitor.name}
      />
      <PainPoints
        painPoints={alternative.painPoints}
        competitorName={competitor.name}
      />
      <WhySomyra features={alternative.whySomyraFeatures} />
      <FAQSection faqs={alternative.faqs} />
      <CTASection slug={slug} pageType="alternative" />
    </CompareLayout>
  );
};

export default AlternativePage;
