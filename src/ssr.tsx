/**
 * Server-side render entry point for the landing page.
 * Used by scripts/prerender.mjs to pre-render the homepage to static HTML.
 * Imports LandingMid and LandingBelow eagerly so the full body is in SSR output.
 */
import { renderToString } from 'react-dom/server';
import { HelmetProvider } from 'react-helmet-async';
import { StaticRouter } from 'react-router';
import { LandingPage } from './components/LandingPage';
import { LandingMid } from './components/landing/LandingMid';
import { LandingBelow } from './components/landing/LandingBelow';

export interface SSRResult {
  html: string;
  helmet: any;
}

const noop = () => {};

export function renderHomepage(): SSRResult {
  const helmetContext: any = {};
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
          _midEager={LandingMid}
          _belowEager={LandingBelow}
        />
      </StaticRouter>
    </HelmetProvider>
  );
  return { html, helmet: helmetContext.helmet };
}
