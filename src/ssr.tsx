/**
 * Server-side render entry point for the landing page.
 * Used by scripts/prerender.mjs to pre-render the homepage to static HTML.
 * Uses react-dom/server + HelmetProvider + StaticRouter for proper meta tag injection.
 */
import { renderToString } from 'react-dom/server';
import { HelmetProvider } from 'react-helmet-async';
import { StaticRouter } from 'react-router';
import { LandingPage } from './components/LandingPage';

export interface SSRResult {
  html: string;
  helmet: any;
}

export function renderHomepage(): SSRResult {
  const helmetContext: any = {};
  const noop = () => {};
  const html = renderToString(
    <HelmetProvider context={helmetContext}>
      <StaticRouter location="/">
        <LandingPage
          setActiveTab={noop}
          setShowAuth={noop}
          setAuthMode={noop}
          setShowPricingModal={noop}
          testimonials={[]}
          loadingTestimonials={false}
          showReviewModal={false}
          setShowReviewModal={noop}
          user={null}
        />
      </StaticRouter>
    </HelmetProvider>
  );
  return { html, helmet: helmetContext.helmet };
}
