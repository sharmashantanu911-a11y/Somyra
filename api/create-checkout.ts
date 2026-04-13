import type { VercelRequest, VercelResponse } from '@vercel/node';
import https from 'https';
import { URL } from 'url';

const makeRequest = (url: string, options: any, body: string): Promise<any> => {
  return new Promise((resolve, reject) => {
    const urlObj = new URL(url);
    const reqOptions = {
      hostname: urlObj.hostname,
      port: 443,
      path: urlObj.pathname,
      method: options.method || 'POST',
      headers: {
        ...options.headers,
        'Content-Length': Buffer.byteLength(body)
      }
    };
    
    const req = https.request(reqOptions, (res) => {
      let data = '';
      res.on('data', chunk => {
        data += chunk;
      });
      res.on('end', () => {
        try {
          const isJson = res.headers['content-type']?.includes('application/json');
          resolve({
            ok: res.statusCode && res.statusCode >= 200 && res.statusCode < 300,
            status: res.statusCode,
            json: () => isJson ? JSON.parse(data) : { message: data },
            text: () => data
          });
        } catch (e) {
          resolve({
            ok: false,
            status: res.statusCode,
            text: () => data,
            json: () => ({ message: data })
          });
        }
      });
    });
    
    req.on('error', (err) => {
      console.error('HTTPS Request Error Detail:', err);
      reject(err);
    });
    
    req.write(body);
    req.end();
  });
};

export default async function handler(req: VercelRequest, res: VercelResponse) {
  // CORS Headers
  const origin = (req.headers.origin as string) || (req.headers.referer as string) || 'https://somyra.vercel.app';
  const baseUrl = origin.split('?')[0].replace(/\/$/, ""); 
  
  res.setHeader('Access-Control-Allow-Origin', origin);
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  const { productId, userId, email } = req.body;

  if (!productId || !userId || !email) {
    return res.status(400).json({ error: 'Missing required fields: productId, userId, email' });
  }

  const DODO_API_KEY = process.env.DODO_API_KEY;
  
  // Debug logging for API key
  console.log('Dodo API Key exists:', !!DODO_API_KEY);
  if (DODO_API_KEY) {
    console.log('Dodo API Key prefix:', DODO_API_KEY.substring(0, 8));
  }

  if (!DODO_API_KEY) {
    console.error('CRITICAL: DODO_API_KEY is missing from environment variables');
    return res.status(500).json({ error: 'Server configuration error: DODO_API_KEY missing' });
  }

  try {
    const isLive = DODO_API_KEY.startsWith('live_');
    const dodoBaseUrl = isLive ? 'https://live.dodopayments.com' : 'https://test.dodopayments.com';
    const dodoApiUrl = `${dodoBaseUrl}/checkouts`;

    const payload = {
      customer: {
        email: email,
        name: email.split('@')[0] || 'User',
      },
      product_cart: [
        {
          product_id: productId,
          quantity: 1,
        }
      ],
      metadata: {
        supabase_user_id: userId,
      },
      return_url: `${baseUrl}/dashboard?upgraded=true`,
    };

    console.log(`Sending request to Dodo (${isLive ? 'LIVE' : 'TEST'}):`, JSON.stringify(payload));

    const response = await makeRequest(dodoApiUrl, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${DODO_API_KEY}`,
        'Content-Type': 'application/json',
      }
    }, JSON.stringify(payload));

    const responseText = response.text();
    const data = await response.json();

    if (!response.ok) {
      console.error('Dodo API Error:', data);
      return res.status(response.status).json({ 
        error: 'Dodo Payments API error', 
        details: data.message || data.error || responseText,
        status: response.status
      });
    }

    if (!data.checkout_url) {
      console.error('Unexpected Dodo API response (no checkout_url):', data);
      return res.status(500).json({ error: 'Dodo API did not return a checkout URL', details: data });
    }

    return res.status(200).json({ checkout_url: data.checkout_url });
  } catch (error) {
    console.error('Create Checkout Error:', error);
    return res.status(500).json({
      error: 'Internal Server Error',
      details: error instanceof Error ? error.message : String(error),
    });
  }
}


