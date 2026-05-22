import React, { lazy, Suspense } from 'react';
import { Routes, Route, useNavigate } from 'react-router-dom';
import App from './App';
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

export const AppRoutes: React.FC = () => {
  const navigate = useNavigate();

  return (
    <Suspense fallback={<div style={{background:'#080808', minHeight:'100vh'}}/>}>
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
    </Suspense>
  );
};
