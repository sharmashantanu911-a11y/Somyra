import { readFileSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = join(__dirname, '..');
const BASE_URL = 'https://somyra.online';
const INDEXNOW_API = 'https://api.indexnow.org/indexnow';
const KEY = 'a9cded6a-78b4-46aa-8689-549aba7e7ee6';

async function main() {
  const sitemapPath = join(ROOT, 'dist', 'sitemap.xml');
  const sitemap = readFileSync(sitemapPath, 'utf-8');
  const urls = [...sitemap.matchAll(/<loc>(.*?)<\/loc>/g)].map(m => m[1]);

  if (urls.length === 0) {
    console.error('No URLs found in sitemap');
    process.exit(1);
  }

  const payload = {
    host: 'somyra.online',
    key: KEY,
    keyLocation: `${BASE_URL}/${KEY}.txt`,
    urlList: urls,
  };

  console.log(`Pushing ${urls.length} URLs to IndexNow...`);

  const response = await fetch(INDEXNOW_API, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });

  if (response.ok) {
    console.log('IndexNow push successful (HTTP 200)');
  } else {
    const text = await response.text();
    throw new Error(`HTTP ${response.status}: ${text}`);
  }
}

main().catch(err => {
  console.error('IndexNow push failed:', err.message);
  process.exit(1);
});
