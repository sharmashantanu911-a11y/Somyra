import { execSync } from 'child_process';
import { createServer } from 'http';
import { readFileSync, writeFileSync, mkdirSync, existsSync, statSync } from 'fs';
import { join, extname, dirname } from 'path';
import { fileURLToPath } from 'url';
import puppeteer from 'puppeteer-core';

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = join(__dirname, '..');
const DIST = join(ROOT, 'dist');
const PORT = 8765;
const CHROME_PATH = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';

const ROUTES = [
  '/',
  '/blog',
  '/blog/linkedin-personal-branding-guide-founders',
  '/blog/how-to-write-linkedin-posts-that-get-engagement',
  '/blog/linkedin-outreach-strategy-that-gets-replies',
  '/blog/linkedin-profile-optimization-checklist',
  '/blog/why-linkedin-posts-sound-robotic',
  '/blog/linkedin-hook-formulas-that-stop-the-scroll',
  '/blog/how-to-write-linkedin-about-section',
  '/blog/linkedin-dm-formula-that-gets-replies',
  '/blog/what-to-post-on-linkedin-when-you-have-no-ideas',
  '/blog/best-linkedin-post-generator-2025',
  '/blog/does-ai-linkedin-content-get-penalized',
  '/blog/how-long-should-linkedin-post-be',
  '/linkedin-post-generator',
  '/linkedin-profile-audit',
  '/linkedin-dm-generator',
  '/linkedin-hook-generator',
  '/linkedin-topic-generator',
  '/compare/somyra-vs-taplio',
  '/terms',
  '/privacy',
  '/contact',
];

const MIME_TYPES = {
  '.html': 'text/html',
  '.js': 'application/javascript',
  '.css': 'text/css',
  '.png': 'image/png',
  '.webp': 'image/webp',
  '.svg': 'image/svg+xml',
  '.json': 'application/json',
  '.woff2': 'font/woff2',
  '.woff': 'font/woff',
  '.ttf': 'font/ttf',
  '.ico': 'image/x-icon',
  '.mp4': 'video/mp4',
};

function build() {
  console.log('\n=== Building app ===\n');
  execSync('npx vite build', { cwd: ROOT, stdio: 'inherit' });
}

function startServer() {
  return new Promise((resolve) => {
    const server = createServer((req, res) => {
      const urlPath = new URL(req.url, `http://localhost:${PORT}`).pathname;
      let filePath = join(DIST, urlPath === '/' ? 'index.html' : urlPath);

      if (existsSync(filePath) && !statSync(filePath).isDirectory()) {
        serveFile(filePath, res);
        return;
      }

      const indexPath = join(filePath, 'index.html');
      if (existsSync(indexPath)) {
        serveFile(indexPath, res);
        return;
      }

      const assetPath = join(DIST, urlPath);
      if (existsSync(assetPath) && !statSync(assetPath).isDirectory()) {
        serveFile(assetPath, res);
        return;
      }

      serveFile(join(DIST, 'index.html'), res);
    });

    server.listen(PORT, () => {
      console.log(`Server running on http://localhost:${PORT}\n`);
      resolve(server);
    });
  });
}

function serveFile(filePath, res) {
  try {
    const content = readFileSync(filePath);
    const ext = extname(filePath);
    res.writeHead(200, { 'Content-Type': MIME_TYPES[ext] || 'application/octet-stream' });
    res.end(content);
  } catch {
    res.writeHead(404);
    res.end('Not found');
  }
}

async function prerender(server) {
  console.log('=== Starting prerender ===\n');

  const browser = await puppeteer.launch({
    executablePath: CHROME_PATH,
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox', '--disable-dev-shm-usage'],
  });

  for (const route of ROUTES) {
    const url = `http://localhost:${PORT}${route}`;
    process.stdout.write(`Rendering: ${route} ... `);

    const page = await browser.newPage();

    await page.setRequestInterception(true);
    page.on('request', (req) => {
      const type = req.resourceType();
      if (type === 'image' || type === 'font' || type === 'media') {
        req.abort();
      } else {
        req.continue();
      }
    });

    page.on('console', (msg) => {
      if (msg.type() === 'error') {
        process.stdout.write(`\n  [console.error] ${msg.text()}\n`);
      }
    });

    page.on('pageerror', (err) => {
      process.stdout.write(`\n  [PAGE ERROR] ${err.message}\n`);
    });

    try {
      await page.goto(url, { waitUntil: 'networkidle0', timeout: 30000 });

      await page.waitForSelector('h1, article, main, .blog-content, .landing-nav, [id]', { timeout: 30000 });

      await new Promise((r) => setTimeout(r, 2000));

      const html = await page.content();

      const outputPath = route === '/'
        ? join(DIST, 'index.html')
        : join(DIST, route, 'index.html');

      mkdirSync(dirname(outputPath), { recursive: true });
      writeFileSync(outputPath, html);

      process.stdout.write(`saved\n`);
    } catch (err) {
      process.stdout.write(`FAILED: ${err.message}\n`);
    } finally {
      await page.close();
    }
  }

  await browser.close();
  console.log('\n=== Prerender complete ===\n');
}

async function main() {
  try {
    build();
    const server = await startServer();
    try {
      await prerender(server);
    } finally {
      server.close();
    }
    console.log('All done!');
  } catch (err) {
    console.error('Fatal error:', err);
    process.exit(1);
  }
}

main();
