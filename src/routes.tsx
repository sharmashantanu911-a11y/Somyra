import React from 'react';
import { Routes, Route, useNavigate, useParams } from 'react-router-dom';
import App from './App';
import { Terms } from './components/Terms';
import { Privacy } from './components/Privacy';
import { Contact } from './components/Contact';
import LinkedInPostGeneratorPage from './pages/LinkedInPostGeneratorPage';
import LinkedInProfileAuditPage from './pages/LinkedInProfileAuditPage';
import LinkedInDMGeneratorPage from './pages/LinkedInDMGeneratorPage';
import LinkedInHookGeneratorPage from './pages/LinkedInHookGeneratorPage';
import LinkedInTopicGeneratorPage from './pages/LinkedInTopicGeneratorPage';
import CompareTaplioPage from './pages/compare/CompareTaplioPage';
import BlogPage from './pages/BlogPage';
import NotFoundPage from './pages/NotFoundPage';

// Import blog posts
import WhyRoboticPosts from './content/posts/WhyRoboticPosts';
import OutreachCringePosts from './content/posts/OutreachCringePosts';
import AboutSectionConverts from './content/posts/AboutSectionConverts';
import LinkedinPersonalBrandingGuideFounders from './content/posts/linkedin-personal-branding-guide-founders';
import HowToWriteLinkedinPostsThatGetEngagement from './content/posts/how-to-write-linkedin-posts-that-get-engagement';
import LinkedinOutreachStrategyThatGetsReplies from './content/posts/linkedin-outreach-strategy-that-gets-replies';
import LinkedinProfileOptimizationChecklist from './content/posts/linkedin-profile-optimization-checklist';

const BlogRouter: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();

  switch (slug) {
    case 'why-linkedin-posts-sound-robotic':
      return <WhyRoboticPosts />;
    case 'linkedin-outreach-strategy-cringe':
      return <OutreachCringePosts />;
    case 'linkedin-about-section-converts':
      return <AboutSectionConverts />;
    case 'linkedin-personal-branding-guide-founders':
      return <LinkedinPersonalBrandingGuideFounders />;
    case 'how-to-write-linkedin-posts-that-get-engagement':
      return <HowToWriteLinkedinPostsThatGetEngagement />;
    case 'linkedin-outreach-strategy-that-gets-replies':
      return <LinkedinOutreachStrategyThatGetsReplies />;
    case 'linkedin-profile-optimization-checklist':
      return <LinkedinProfileOptimizationChecklist />;
    default:
      return <NotFoundPage />;
  }
};

export const AppRoutes: React.FC = () => {
  const navigate = useNavigate();

  return (
    <Routes>
      <Route path="/" element={<App />} />
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
  );
};

