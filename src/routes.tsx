import React from 'react';
import { Routes, Route, useNavigate } from 'react-router-dom';
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
      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  );
};
