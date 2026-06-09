import React, { lazy, Suspense } from 'react';
import { Routes, Route, useNavigate, useParams } from 'react-router-dom';
import App from './App';
import { competitorSlugs } from './data/compareData';

const LinkedInPostGeneratorPage = lazy(() => import('./pages/LinkedInPostGeneratorPage'));
const LinkedInProfileAuditPage = lazy(() => import('./pages/LinkedInProfileAuditPage'));
const LinkedInDMGeneratorPage = lazy(() => import('./pages/LinkedInDMGeneratorPage'));
const LinkedInHookGeneratorPage = lazy(() => import('./pages/LinkedInHookGeneratorPage'));
const LinkedInTopicGeneratorPage = lazy(() => import('./pages/LinkedInTopicGeneratorPage'));
const CompareIndexPage = lazy(() => import('./pages/compare'));
const ComparePage = lazy(() => import('./pages/compare/ComparePage'));
const AlternativesIndexPage = lazy(() => import('./pages/alternatives'));
const AlternativePage = lazy(() => import('./pages/alternatives/AlternativePage'));
const BlogPage = lazy(() => import('./pages/BlogPage'));
const AuthCallback = lazy(() => import('./pages/AuthCallback'));
const EngageConnect = lazy(() => import('./pages/EngageConnect'));
const NotFoundPage = lazy(() => import('./pages/NotFoundPage'));
const Terms = lazy(() => import('./components/Terms').then(m => ({ default: m.Terms })));
const Privacy = lazy(() => import('./components/Privacy').then(m => ({ default: m.Privacy })));
const Contact = lazy(() => import('./components/Contact').then(m => ({ default: m.Contact })));

const blogComponents: Record<string, React.LazyExoticComponent<React.ComponentType<any>>> = {
  'linkedin-personal-branding-guide-founders': lazy(() => import('./content/posts/linkedin-personal-branding-guide-founders')),
  'how-to-write-linkedin-posts-that-get-engagement': lazy(() => import('./content/posts/how-to-write-linkedin-posts-that-get-engagement')),
  'linkedin-outreach-strategy-that-gets-replies': lazy(() => import('./content/posts/linkedin-outreach-strategy-that-gets-replies')),
  'linkedin-profile-optimization-checklist': lazy(() => import('./content/posts/linkedin-profile-optimization-checklist')),
  'why-linkedin-posts-sound-robotic': lazy(() => import('./content/posts/why-linkedin-posts-sound-robotic')),
  'linkedin-hook-formulas-that-stop-the-scroll': lazy(() => import('./content/posts/linkedin-hook-formulas-that-stop-the-scroll')),
  'how-to-write-linkedin-about-section': lazy(() => import('./content/posts/how-to-write-linkedin-about-section')),
  'linkedin-dm-formula-that-gets-replies': lazy(() => import('./content/posts/linkedin-dm-formula-that-gets-replies')),
  'what-to-post-on-linkedin-when-you-have-no-ideas': lazy(() => import('./content/posts/what-to-post-on-linkedin-when-you-have-no-ideas')),
  'best-linkedin-post-generator-2025': lazy(() => import('./content/posts/best-linkedin-post-generator-2025')),
  'does-ai-linkedin-content-get-penalized': lazy(() => import('./content/posts/does-ai-linkedin-content-get-penalized')),
  'how-long-should-linkedin-post-be': lazy(() => import('./content/posts/how-long-should-linkedin-post-be')),
};

const BlogRouter: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const Component = slug ? blogComponents[slug] : undefined;

  if (!Component) {
    return <NotFoundPage />;
  }

  return (
    <Suspense fallback={
      <div className="min-h-screen bg-[#080808] flex items-center justify-center">
        <div className="w-6 h-6 border-2 border-[#2DD4BF] border-t-transparent rounded-full animate-spin" />
      </div>
    }>
      <Component />
    </Suspense>
  );
};

export const AppRoutes: React.FC = () => {
  const navigate = useNavigate();

  return (
    <Suspense fallback={<div style={{background:'#080808', minHeight:'100vh'}}/>}>
      <Routes>
        <Route path="/" element={<App />} />
        <Route path="/terms" element={
          <Suspense fallback={<div style={{background:'#080808',minHeight:'100vh'}}/>}>
            <Terms onBack={() => navigate('/')} />
          </Suspense>
        } />
        <Route path="/privacy" element={
          <Suspense fallback={<div style={{background:'#080808',minHeight:'100vh'}}/>}>
            <Privacy onBack={() => navigate('/')} />
          </Suspense>
        } />
        <Route path="/contact" element={
          <Suspense fallback={<div style={{background:'#080808',minHeight:'100vh'}}/>}>
            <Contact onBack={() => navigate('/')} />
          </Suspense>
        } />
        <Route path="/linkedin-post-generator" element={<LinkedInPostGeneratorPage />} />
        <Route path="/linkedin-profile-audit" element={<LinkedInProfileAuditPage />} />
        <Route path="/linkedin-dm-generator" element={<LinkedInDMGeneratorPage />} />
        <Route path="/linkedin-hook-generator" element={<LinkedInHookGeneratorPage />} />
        <Route path="/linkedin-topic-generator" element={<LinkedInTopicGeneratorPage />} />
        <Route path="/compare" element={<CompareIndexPage />} />
        {competitorSlugs.map(slug => (
          <Route key={`compare-${slug}`} path={`/compare/somyra-vs-${slug}`} element={<ComparePage competitorId={slug} />} />
        ))}
        <Route path="/alternatives" element={<AlternativesIndexPage />} />
        {competitorSlugs.map(slug => (
          <Route key={`alt-${slug}`} path={`/alternatives/somyra-vs-${slug}`} element={<AlternativePage competitorId={slug} />} />
        ))}
        <Route path="/blog" element={<BlogPage />} />
        <Route path="/blog/:slug" element={<BlogRouter />} />
        <Route path="/auth/callback" element={
          <Suspense fallback={<div style={{background:'#080808',minHeight:'100vh'}}/>}>
            <AuthCallback />
          </Suspense>
        } />
        <Route path="/engage-connect" element={
          <Suspense fallback={<div style={{background:'#080808',minHeight:'100vh'}}/>}>
            <EngageConnect />
          </Suspense>
        } />
        <Route path="/dashboard" element={<App />} />
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </Suspense>
  );
};
