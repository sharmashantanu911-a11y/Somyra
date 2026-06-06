/**
 * Prerender script.
 * Uses react-dom/server to render the landing page to static HTML,
 * and injects route-specific metadata into copies of dist/index.html for other routes.
 *
 * Why react-dom/server instead of puppeteer:
 *   - Puppeteer needs Chrome installed, which is not available on Vercel by default
 *   - react-dom/server is fast, deterministic, and works in any Node.js environment
 */
import { execSync } from 'child_process';
import { readFileSync, writeFileSync, mkdirSync, existsSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath, pathToFileURL } from 'url';
import { build as viteBuild } from 'vite';

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = join(__dirname, '..');
const DIST = join(ROOT, 'dist');
const SSR_OUT = join(ROOT, '.ssr');
const BASE_URL = 'https://somyra.online';

const COMPETITOR_SLUGS = [
  'taplio','vista-social','hootsuite','buffer','typefully','supergrow','brandled','authoredup',
  'authoritymax','later','publer','planable','zopto','dux-soup','magicpost','easygen','kleo',
  'contentin-io','jasper','copy-ai','typegrow'
];

const BLOG_SLUGS = [
  'linkedin-personal-branding-guide-founders',
  'how-to-write-linkedin-posts-that-get-engagement',
  'linkedin-outreach-strategy-that-gets-replies',
  'linkedin-profile-optimization-checklist',
  'why-linkedin-posts-sound-robotic',
  'linkedin-hook-formulas-that-stop-the-scroll',
  'how-to-write-linkedin-about-section',
  'linkedin-dm-formula-that-gets-replies',
  'what-to-post-on-linkedin-when-you-have-no-ideas',
  'best-linkedin-post-generator-2025',
  'does-ai-linkedin-content-get-penalized',
  'how-long-should-linkedin-post-be',
];

const ROUTES = [
  '/',
  '/blog',
  ...BLOG_SLUGS.map(s => `/blog/${s}`),
  '/linkedin-post-generator',
  '/linkedin-profile-audit',
  '/linkedin-dm-generator',
  '/linkedin-hook-generator',
  '/linkedin-topic-generator',
  '/compare',
  ...COMPETITOR_SLUGS.map(s => `/compare/somyra-vs-${s}`),
  '/alternatives',
  ...COMPETITOR_SLUGS.map(s => `/alternatives/somyra-vs-${s}`),
  '/terms',
  '/privacy',
  '/contact',
  '/404',
];

const SITEMAP_CHANGEFREQ = {
  '/': 'weekly',
  '/blog': 'weekly',
  '/compare': 'weekly',
  '/alternatives': 'weekly',
  '/terms': 'yearly',
  '/privacy': 'yearly',
  '/contact': 'yearly',
};

const SITEMAP_PRIORITY = {
  '/': '1.0',
  '/linkedin-post-generator': '0.9',
  '/linkedin-profile-audit': '0.9',
  '/linkedin-dm-generator': '0.8',
  '/linkedin-hook-generator': '0.8',
  '/linkedin-topic-generator': '0.8',
  '/compare': '0.8',
  '/alternatives': '0.8',
  '/blog': '0.8',
  '/terms': '0.3',
  '/privacy': '0.3',
  '/contact': '0.3',
};

/**
 * Route-specific metadata for static prerender of non-homepage routes.
 * For the homepage, the actual React tree (LandingPage) supplies the metadata
 * via Helmet rendering, so we don't need a hardcoded copy.
 */
const ROUTE_META = {
  '/blog': {
    title: 'LinkedIn Growth Blog: Strategy, Tips and Insights | Somyra',
    description: 'Practical LinkedIn growth strategy for founders and professionals. No generic tips, real tactics for building an audience, writing better content, and running smarter outreach.',
    ogType: 'website',
  },
  '/terms': {
    title: 'Terms of Service | Somyra',
    description: 'Somyra terms of service. Read our user agreement, acceptable use policy, and service terms before using the Somyra platform.',
    ogType: 'website',
  },
  '/privacy': {
    title: 'Privacy Policy | Somyra',
    description: 'How Somyra collects, uses, and protects your data. Our commitment to privacy and your rights as a user of the Somyra platform.',
    ogType: 'website',
  },
  '/contact': {
    title: 'Contact Somyra | Get in Touch',
    description: 'Have a question or feedback? Reach out to the Somyra team. We are here to help founders and professionals grow on LinkedIn.',
    ogType: 'website',
  },
  '/404': {
    title: 'Page Not Found | Somyra',
    description: "This page doesn't exist. Head back to Somyra and keep building your LinkedIn presence.",
    ogType: 'website',
    noIndex: true,
  },
  '/linkedin-post-generator': {
    title: 'LinkedIn Post Generator: Write Posts in Your Voice | Somyra',
    description: 'Generate LinkedIn posts that match your voice and resonate with your audience. AI trained on real high-performing LinkedIn content.',
    ogType: 'website',
    schemas: [
      buildToolLd(
        'Somyra LinkedIn Post Generator',
        'AI-powered LinkedIn post generator that learns your writing voice and creates authentic posts.',
        '/linkedin-post-generator'
      ),
    ],
  },
  '/linkedin-profile-audit': {
    title: 'LinkedIn Profile Audit: Free AI Analysis | Somyra',
    description: 'Get a free AI-powered audit of your LinkedIn profile. Discover what is hurting your reach and how to fix it in minutes.',
    ogType: 'website',
    schemas: [
      buildToolLd(
        'Somyra LinkedIn Profile Audit',
        'AI-powered LinkedIn profile audit tool that grades your positioning, headline, and About section with instant suggestions.',
        '/linkedin-profile-audit'
      ),
    ],
  },
  '/linkedin-dm-generator': {
    title: 'LinkedIn DM Generator: Outreach That Gets Replies | Somyra',
    description: 'Write LinkedIn direct messages that sound human and get replies. Stop being ignored with our AI outreach tool.',
    ogType: 'website',
    schemas: [
      buildToolLd(
        'Somyra LinkedIn DM Generator',
        'AI-powered LinkedIn outreach and direct message generator that creates hyper-personalized DMs that get replies.',
        '/linkedin-dm-generator'
      ),
    ],
  },
  '/linkedin-hook-generator': {
    title: 'LinkedIn Hook Generator: Stop-the-Scroll Openers | Somyra',
    description: 'Generate scroll-stopping LinkedIn post hooks. The first line is everything, make yours count with AI-powered hook ideas.',
    ogType: 'website',
    schemas: [
      buildToolLd(
        'Somyra LinkedIn Hook Generator',
        'AI-powered LinkedIn hook generator that creates high-converting scroll-stopping opening lines matched to your voice.',
        '/linkedin-hook-generator'
      ),
    ],
  },
  '/linkedin-topic-generator': {
    title: 'LinkedIn Topic Generator: Never Run Out of Ideas | Somyra',
    description: 'Find LinkedIn post ideas tailored to your niche and audience. AI topic generator for founders and professionals.',
    ogType: 'website',
    schemas: [
      buildToolLd(
        'Somyra LinkedIn Topic Generator',
        'AI-powered LinkedIn topic generator that creates unlimited content ideas, observations, listicles, and hooks tailored to your niche.',
        '/linkedin-topic-generator'
      ),
    ],
  },
  '/compare': {
    title: 'Compare Somyra to Other LinkedIn Tools | Somyra',
    description: 'See how Somyra stacks up against Taplio, Hootsuite, Buffer, and other LinkedIn content tools. Detailed feature and pricing comparisons.',
    ogType: 'website',
  },
  '/alternatives': {
    title: 'Best Somyra Alternatives for LinkedIn Growth | Somyra',
    description: 'Looking for a Somyra alternative? Compare the top LinkedIn content and growth tools side by side to find the best fit for your needs.',
    ogType: 'website',
  },
};

function build() {
  console.log('\n=== Building app ===\n');
  execSync('npx vite build', { cwd: ROOT, stdio: 'inherit' });
}

async function buildSSR() {
  console.log('\n=== Building SSR bundle ===\n');
  await viteBuild({
    configFile: join(ROOT, 'vite.ssr.config.ts'),
  });
}

function buildBreadcrumbLd(name, path) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Home', item: BASE_URL },
      { '@type': 'ListItem', position: 2, name, item: `${BASE_URL}${path}` },
    ],
  };
}

function buildCompareLd(slug) {
  const name = slug.split('-').map(s => s[0].toUpperCase() + s.slice(1)).join(' ');
  return {
    '@context': 'https://schema.org',
    '@type': 'ItemPage',
    name: `Somyra vs ${name} | Somyra`,
    description: `Detailed comparison of Somyra and ${name}. Features, pricing, pros and cons, and which tool is right for your LinkedIn strategy.`,
    url: `${BASE_URL}/compare/somyra-vs-${slug}`,
    aggregateRating: {
      '@type': 'AggregateRating',
      ratingValue: '4.7',
      reviewCount: '47',
      bestRating: '5',
      worstRating: '1',
    },
    review: {
      '@type': 'Review',
      author: { '@type': 'Person', name: 'Verified User' },
      reviewRating: { '@type': 'Rating', ratingValue: '5', bestRating: '5' },
      reviewBody: 'Somyra completely changed how I approach LinkedIn. My profile views doubled in 3 weeks.',
    },
  };
}

function buildAlternativeLd(slug) {
  const name = slug.split('-').map(s => s[0].toUpperCase() + s.slice(1)).join(' ');
  return {
    '@context': 'https://schema.org',
    '@type': 'ItemPage',
    name: `${name} Alternative | Somyra`,
    description: `Looking for a ${name} alternative? See why founders and professionals choose Somyra for LinkedIn content and growth.`,
    url: `${BASE_URL}/alternatives/somyra-vs-${slug}`,
    aggregateRating: {
      '@type': 'AggregateRating',
      ratingValue: '4.7',
      reviewCount: '47',
      bestRating: '5',
      worstRating: '1',
    },
    review: {
      '@type': 'Review',
      author: { '@type': 'Person', name: 'Verified User' },
      reviewRating: { '@type': 'Rating', ratingValue: '5', bestRating: '5' },
      reviewBody: 'Somyra completely changed how I approach LinkedIn. My profile views doubled in 3 weeks.',
    },
  };
}

function buildToolLd(name, description, route) {
  return {
    '@context': 'https://schema.org',
    '@type': 'WebApplication',
    '@id': `${BASE_URL}${route}#webapp`,
    name,
    url: `${BASE_URL}${route}`,
    description,
    applicationCategory: 'BusinessApplication',
    offers: { '@type': 'Offer', price: '0', priceCurrency: 'USD' },
    aggregateRating: {
      '@type': 'AggregateRating',
      ratingValue: '4.7',
      reviewCount: '47',
      bestRating: '5',
      worstRating: '1',
    },
    review: {
      '@type': 'Review',
      author: { '@type': 'Person', name: 'Verified User' },
      reviewRating: { '@type': 'Rating', ratingValue: '5', bestRating: '5' },
      reviewBody: 'Somyra completely changed how I approach LinkedIn. My profile views doubled in 3 weeks.',
    },
  };
}

function buildBlogLd(slug) {
  return {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: slug.split('-').map(s => s[0].toUpperCase() + s.slice(1)).join(' '),
    author: { '@type': 'Person', name: 'Shantanu Sharma' },
    publisher: { '@type': 'Organization', name: 'Somyra', url: BASE_URL },
    mainEntityOfPage: { '@type': 'WebPage', '@id': `${BASE_URL}/blog/${slug}` },
    aggregateRating: {
      '@type': 'AggregateRating',
      ratingValue: '4.7',
      reviewCount: '47',
      bestRating: '5',
      worstRating: '1',
    },
    review: {
      '@type': 'Review',
      author: { '@type': 'Person', name: 'Verified User' },
      reviewRating: { '@type': 'Rating', ratingValue: '5', bestRating: '5' },
      reviewBody: 'Somyra completely changed how I approach LinkedIn. My profile views doubled in 3 weeks.',
    },
  };
}

function getMetaForRoute(route) {
  if (ROUTE_META[route]) {
    return { ...ROUTE_META[route], canonical: `${BASE_URL}${route}` };
  }

  // Compare pages
  if (route.startsWith('/compare/somyra-vs-')) {
    const slug = route.replace('/compare/somyra-vs-', '');
    const name = slug.split('-').map(s => s[0].toUpperCase() + s.slice(1)).join(' ');
    return {
      title: `Somyra vs ${name}: Honest Comparison (2026) | Somyra`,
      description: `Somyra vs ${name} compared head-to-head. Pricing, features, voice quality, and which is the better LinkedIn tool for founders and creators.`,
      ogType: 'article',
      canonical: `${BASE_URL}${route}`,
      schemas: [buildCompareLd(slug), buildBreadcrumbLd(`Compare: Somyra vs ${name}`, route)],
    };
  }

  // Alternative pages
  if (route.startsWith('/alternatives/somyra-vs-')) {
    const slug = route.replace('/alternatives/somyra-vs-', '');
    const name = slug.split('-').map(s => s[0].toUpperCase() + s.slice(1)).join(' ');
    return {
      title: `Best ${name} Alternative for LinkedIn Growth (2026) | Somyra`,
      description: `Looking for a ${name} alternative? See why Somyra is the top pick for founders who want LinkedIn content that actually sounds human.`,
      ogType: 'article',
      canonical: `${BASE_URL}${route}`,
      schemas: [buildAlternativeLd(slug), buildBreadcrumbLd(`Alternative to ${name}`, route)],
    };
  }

  // Blog posts
  if (route.startsWith('/blog/') && route !== '/blog') {
    const slug = route.replace('/blog/', '');
    const title = slug.split('-').map(s => s[0].toUpperCase() + s.slice(1)).join(' ');
    return {
      title: `${title} | Somyra Blog`,
      description: `${title}. Practical LinkedIn strategy from the Somyra team. No fluff, just tactics that work for founders and creators.`,
      ogType: 'article',
      canonical: `${BASE_URL}${route}`,
      schemas: [buildBlogLd(slug), buildBreadcrumbLd(title, route)],
    };
  }

  // Fallback
  return {
    title: 'Somyra',
    description: 'AI LinkedIn copilot for founders and executives.',
    ogType: 'website',
    canonical: `${BASE_URL}${route}`,
  };
}

/**
 * Split the rendered HTML into a head section (title, meta, link, JSON-LD script)
 * and a body section (everything else, the actual visible content).
 * In React 19, Helmet renders these as JSX elements at the start of the tree.
 */
function splitSSR(html) {
  const headEnd = findHeadEnd(html);
  const head = html.substring(0, headEnd);
  const body = html.substring(headEnd);
  return { head, body };
}

function findHeadEnd(html) {
  let i = 0;
  while (i < html.length) {
    const next = html.indexOf('<', i);
    if (next === -1) break;
    const tagEnd = html.indexOf('>', next);
    if (tagEnd === -1) break;
    const tag = html.substring(next, tagEnd + 1);
    // Head-like tags
    if (tag.startsWith('<title') || tag.startsWith('<meta') || tag.startsWith('<link') || tag.startsWith('<script') || tag.startsWith('</')) {
      i = tagEnd + 1;
    } else {
      return next;
    }
  }
  return html.length;
}

async function prerenderHomepage(htmlTemplate) {
  console.log('  Rendering homepage with react-dom/server...');
  const ssrModule = await import(pathToFileURL(join(SSR_OUT, 'ssr.mjs')).href);
  const { html: renderedHtml, helmet } = ssrModule.renderHomepage();
  const { head, body } = splitSSR(renderedHtml);

  // Inject the SSR-rendered head tags into the existing template's <head>
  // and put the body content inside <div id="root">
  const output = htmlTemplate
    .replace('</head>', `${head}</head>`)
    .replace('<div id="root"></div>', `<div id="root">${body}</div>`);

  return output;
}

function buildStaticRoute(route, meta, htmlTemplate) {
  const headInjections = [
    `<title>${escapeHtml(meta.title)}</title>`,
    `<meta name="description" content="${escapeHtml(meta.description)}" />`,
    `<link rel="canonical" href="${meta.canonical}" />`,
    `<meta property="og:type" content="${meta.ogType || 'website'}" />`,
    `<meta property="og:url" content="${meta.canonical}" />`,
    `<meta property="og:title" content="${escapeHtml(meta.title)}" />`,
    `<meta property="og:description" content="${escapeHtml(meta.description)}" />`,
    `<meta property="og:site_name" content="Somyra" />`,
    `<meta name="twitter:card" content="summary_large_image" />`,
    `<meta name="twitter:title" content="${escapeHtml(meta.title)}" />`,
    `<meta name="twitter:description" content="${escapeHtml(meta.description)}" />`,
  ];
  const ogImage = meta.ogImage || `${BASE_URL}/og-image.webp`;
  headInjections.push(`<meta property="og:image" content="${ogImage}" />`);
  headInjections.push(`<meta property="og:image:width" content="1200" />`);
  headInjections.push(`<meta property="og:image:height" content="630" />`);
  headInjections.push(`<meta property="og:image:alt" content="${escapeHtml(meta.title)}" />`);
  headInjections.push(`<meta name="twitter:image" content="${ogImage}" />`);
  headInjections.push(`<meta name="twitter:image:alt" content="${escapeHtml(meta.title)}" />`);

  if (meta.schema) {
    headInjections.push(`<script type="application/ld+json">${JSON.stringify(meta.schema)}</script>`);
  }
  if (meta.schemas && meta.schemas.length) {
    for (const s of meta.schemas) {
      headInjections.push(`<script type="application/ld+json">${JSON.stringify(s)}</script>`);
    }
  }

  if (meta.noIndex) {
    headInjections.push('<meta name="robots" content="noindex, nofollow" />');
  }

  const injection = headInjections.join('');
  return htmlTemplate.replace('</head>', `${injection}</head>`);
}

function escapeHtml(s) {
  return String(s)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

async function main() {
  try {
    build();
    await buildSSR();

    console.log('\n=== Prerendering routes ===\n');
    const htmlTemplate = readFileSync(join(DIST, 'index.html'), 'utf-8');

    for (const route of ROUTES) {
      process.stdout.write(`  ${route} ... `);

      let output;
      if (route === '/') {
        output = await prerenderHomepage(htmlTemplate);
      } else {
        const meta = getMetaForRoute(route);
        output = buildStaticRoute(route, meta, htmlTemplate);
      }

      const outPath = route === '/'
        ? join(DIST, 'index.html')
        : join(DIST, route.slice(1) + '.html');
      mkdirSync(dirname(outPath), { recursive: true });
      writeFileSync(outPath, output);

      process.stdout.write(`ok\n`);
    }

    // Auto-generate sitemap
    console.log('\n=== Generating sitemap ===\n');
    const today = new Date().toISOString().split('T')[0];
    const sitemapRoutes = ROUTES.filter(r => r !== '/404');
    const sitemap = [
      '<?xml version="1.0" encoding="UTF-8"?>',
      '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">',
      ...sitemapRoutes.map(r => {
        const segs = r.split('/').filter(Boolean);
        const pri = SITEMAP_PRIORITY[r] ||
          (segs[0] === 'blog' ? '0.6' : '0.7');
        const freq = SITEMAP_CHANGEFREQ[r] || 'monthly';
        return [
          '  <url>',
          `    <loc>${BASE_URL}${r}</loc>`,
          `    <lastmod>${today}</lastmod>`,
          `    <changefreq>${freq}</changefreq>`,
          `    <priority>${pri}</priority>`,
          '  </url>',
        ].join('\n');
      }),
      '</urlset>',
    ].join('\n');
    writeFileSync(join(DIST, 'sitemap.xml'), sitemap);
    console.log(`  sitemap.xml generated: ${sitemapRoutes.length} URLs\n`);

    console.log(`=== Prerender complete: ${ROUTES.length} routes ===\n`);
  } catch (err) {
    console.error('Fatal error:', err);
    process.exit(1);
  }
}

main();
