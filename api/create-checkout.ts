import type { VercelRequest, VercelResponse } from '@vercel/node';

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

  // Verify other plan IDs exist as a sanity check
  const requiredEnv = [
    'DODO_PRO_MONTHLY_ID', 'DODO_PRO_ANNUAL_ID', 
    'DODO_MAX_MONTHLY_ID', 'DODO_MAX_ANNUAL_ID'
  ];
  requiredEnv.forEach(env => {
    if (!process.env[env]) console.warn(`Warning: Environment variable ${env} is not defined`);
  });

  try {
    const dodoApiUrl = 'https://api.dodopayments.com/checkouts';

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

    console.log(`Sending request to Dodo:`, JSON.stringify(payload));

    const response = await fetch(dodoApiUrl, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${DODO_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    });

    const responseText = await response.text();
    let data;
    try {
      data = JSON.parse(responseText);
    } catch (e) {
      data = { message: responseText };
    }

    if (!response.ok) {
      console.error('Dodo API Error:', data);
      return res.status(response.status).json({ 
        error: 'Dodo Payments API error', 
        details: data.message || data.error || responseText,
        status: response.status
      });
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

