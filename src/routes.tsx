import React, { lazy, Suspense, useEffect } from 'react';
import { Routes, Route, useNavigate, useParams } from 'react-router-dom';
import App from './App';
const LandingPage = lazy(() => import('./pages/LandingPage'));
import { Terms } from './components/Terms';
import { Privacy } from './components/Privacy';
import { Contact } from './components/Contact';

const LinkedInPostGeneratorPage = lazy(() => import('./pages/LinkedInPostGeneratorPage'));
const LinkedInProfileAuditPage = lazy(() => import('./pages/LinkedInProfileAuditPage'));
const LinkedInDMGeneratorPage = lazy(() => import('./pages/LinkedInDMGeneratorPage'));
const LinkedInHookGeneratorPage = lazy(() => import('./pages/LinkedInHookGeneratorPage'));
const LinkedInTopicGeneratorPage = lazy(() => import('./pages/LinkedInTopicGeneratorPage'));
const CompareTaplioPage = lazy(() => import('./pages/compare/CompareTaplioPage'));
const BlogPage = lazy(() => import('./pages/BlogPage'));
const NotFoundPage = lazy(() => import('./pages/NotFoundPage'));

// Import blog posts
import LinkedinPersonalBrandingGuideFounders from './content/posts/linkedin-personal-branding-guide-founders';
import HowToWriteLinkedinPostsThatGetEngagement from './content/posts/how-to-write-linkedin-posts-that-get-engagement';
import LinkedinOutreachStrategyThatGetsReplies from './content/posts/linkedin-outreach-strategy-that-gets-replies';
import LinkedinProfileOptimizationChecklist from './content/posts/linkedin-profile-optimization-checklist';
import WhyRoboticPosts from './content/posts/why-linkedin-posts-sound-robotic';
import LinkedinHookFormulasThatStopTheScroll from './content/posts/linkedin-hook-formulas-that-stop-the-scroll';
import HowToWriteLinkedinAboutSection from './content/posts/how-to-write-linkedin-about-section';
import LinkedinDmFormulaThatGetsReplies from './content/posts/linkedin-dm-formula-that-gets-replies';
import WhatToPostOnLinkedinWhenYouHaveNoIdeas from './content/posts/what-to-post-on-linkedin-when-you-have-no-ideas';
import BestLinkedinPostGenerator2025 from './content/posts/best-linkedin-post-generator-2025';
import DoesAiLinkedinContentGetPenalized from './content/posts/does-ai-linkedin-content-get-penalized';
import HowLongShouldLinkedinPostBe from './content/posts/how-long-should-linkedin-post-be';

const BlogRouter: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();

  switch (slug) {
    case 'linkedin-personal-branding-guide-founders':
      return <LinkedinPersonalBrandingGuideFounders />;
    case 'how-to-write-linkedin-posts-that-get-engagement':
      return <HowToWriteLinkedinPostsThatGetEngagement />;
    case 'linkedin-outreach-strategy-that-gets-replies':
      return <LinkedinOutreachStrategyThatGetsReplies />;
    case 'linkedin-profile-optimization-checklist':
      return <LinkedinProfileOptimizationChecklist />;
    case 'why-linkedin-posts-sound-robotic':
      return <WhyRoboticPosts />;
    case 'linkedin-hook-formulas-that-stop-the-scroll':
      return <LinkedinHookFormulasThatStopTheScroll />;
    case 'how-to-write-linkedin-about-section':
      return <HowToWriteLinkedinAboutSection />;
    case 'linkedin-dm-formula-that-gets-replies':
      return <LinkedinDmFormulaThatGetsReplies />;
    case 'what-to-post-on-linkedin-when-you-have-no-ideas':
      return <WhatToPostOnLinkedinWhenYouHaveNoIdeas />;
    case 'best-linkedin-post-generator-2025':
      return <BestLinkedinPostGenerator2025 />;
    case 'does-ai-linkedin-content-get-penalized':
      return <DoesAiLinkedinContentGetPenalized />;
    case 'how-long-should-linkedin-post-be':
      return <HowLongShouldLinkedinPostBe />;
    default:
      return <NotFoundPage />;
  }
};

export const AppRoutes: React.FC = () => {
  const navigate = useNavigate();

  const SignUpPage: React.FC = () => {
    useEffect(() => { navigate('/dashboard', { replace: true }); }, [navigate]);
    return <div style={{background:'#080808', minHeight:'100vh'}}/>;
  };

  const SignInPage: React.FC = () => {
    useEffect(() => { navigate('/dashboard', { replace: true }); }, [navigate]);
    return <div style={{background:'#080808', minHeight:'100vh'}}/>;
  };

  return (
    <Suspense fallback={<div style={{background:'#080808', minHeight:'100vh'}}/>}>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/dashboard" element={<App />} />
        <Route path="/signup" element={<SignUpPage />} />
        <Route path="/signin" element={<SignInPage />} />
        <Route path="/terms" element={<Terms onBack={() => navigate('/')} />} />
        <Route path="/privacy" element={<Privacy onBack={() => navigate('/')} />} />
        <Route path="/contact" element={<Contact onBack={() => navigate('/')} />} />
        <Route path="/linkedin-post-generator" element={<LinkedInPostGeneratorPage />} />
        <Route path="/linkedin-profile-audit" element={<LinkedInProfileAuditPage />} />
        <Route path="/linkedin-dm-generator" element={<LinkedInDMGeneratorPage />} />
        <Route path="/linkedin-hook-generator" element={<LinkedInHookGeneratorPage />} />
        <Route path="/linkedin-topic-generator" element={<LinkedInTopicGeneratorPage />} />
        <Route path="/compare/somyra-vs-taplio" element={<CompareTaplioPage />} />
        <Route path="/blog" element={<BlogPage />} />
        <Route path="/blog/:slug" element={<BlogRouter />} />
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </Suspense>
  );
};
