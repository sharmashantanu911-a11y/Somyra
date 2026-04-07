import type { VercelRequest, VercelResponse } from '@vercel/node';
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.VITE_SUPABASE_URL || '';
const supabaseServiceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY || '';
const supabase = createClient(supabaseUrl, supabaseServiceRoleKey);

export default async function handler(req: VercelRequest, res: VercelResponse) {
  // CORS Headers
  const origin = (req.headers.origin as string) || (req.headers.referer as string) || 'https://somyra.vercel.app';
  res.setHeader('Access-Control-Allow-Origin', origin);
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  const { subscriptionId, userId } = req.body;

  if (!subscriptionId || !userId) {
    return res.status(400).json({ error: 'Missing subscriptionId or userId' });
  }

  const DODO_API_KEY = process.env.DODO_API_KEY;
  if (!DODO_API_KEY) {
    console.error('CRITICAL: DODO_API_KEY missing in cancellation handler');
    return res.status(500).json({ error: 'DODO_API_KEY is not configured' });
  }

  try {
    const response = await fetch(`https://api.dodopayments.com/subscriptions/${subscriptionId}`, {
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${DODO_API_KEY}`,
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      const data = await response.json();
      console.error('Dodo Cancellation API Error:', data);
      return res.status(response.status).json({ error: 'Failed to cancel subscription with Dodo', details: data });
    }

    // Update Supabase profiles table
    // We only update status, keeping is_pro/is_max until expiration webhook
    const { error: updateError } = await supabase
      .from('profiles')
      .update({
        subscription_status: 'cancelled',
      })
      .eq('id', userId);

    if (updateError) {
      console.error('Supabase Update Error after cancellation:', updateError);
      throw updateError;
    }

    return res.status(200).json({ status: 'success' });
  } catch (error) {
    console.error('Cancellation processing error:', error);
    return res.status(500).json({
      error: 'Internal Server Error',
      details: error instanceof Error ? error.message : String(error),
    });
  }
}
