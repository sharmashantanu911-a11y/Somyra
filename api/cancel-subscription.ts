import type { VercelRequest, VercelResponse } from '@vercel/node';
import { createClient } from '@supabase/supabase-js';

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
    console.error('[CANCEL] Missing fields — subscriptionId:', subscriptionId, 'userId:', userId);
    return res.status(400).json({ error: 'Missing subscriptionId or userId' });
  }

  const DODO_API_KEY = process.env.DODO_API_KEY;
  if (!DODO_API_KEY) {
    console.error('[CANCEL] CRITICAL: DODO_API_KEY missing');
    return res.status(500).json({ error: 'DODO_API_KEY is not configured' });
  }

  // Initialize Supabase inside handler
  const supabaseUrl = process.env.VITE_SUPABASE_URL || process.env.SUPABASE_URL || '';
  const supabaseServiceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY || '';
  const supabase = createClient(supabaseUrl, supabaseServiceRoleKey);

  try {
    // Use correct Dodo API URL based on key type
    const isLive = DODO_API_KEY.startsWith('live_');
    const dodoBaseUrl = isLive ? 'https://live.dodopayments.com' : 'https://test.dodopayments.com';

    console.log(`[CANCEL] Cancelling subscription ${subscriptionId} for user ${userId} on ${isLive ? 'LIVE' : 'TEST'}`);

    // Dodo uses PATCH to update subscription status, not DELETE
    const response = await fetch(`${dodoBaseUrl}/subscriptions/${subscriptionId}`, {
      method: 'PATCH',
      headers: {
        'Authorization': `Bearer ${DODO_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        status: 'cancelled',
      }),
    });

    if (!response.ok) {
      let errorData;
      try {
        errorData = await response.json();
      } catch {
        errorData = { message: await response.text() };
      }
      console.error('[CANCEL] Dodo API Error:', response.status, errorData);
      return res.status(response.status).json({ 
        error: 'Failed to cancel subscription with Dodo', 
        details: errorData 
      });
    }

    console.log('[CANCEL] Dodo confirmed cancellation');

    // Update Supabase — mark as cancelled but keep is_pro/is_max until expiry webhook
    const { error: updateError } = await supabase
      .from('profiles')
      .update({ subscription_status: 'cancelled' })
      .eq('id', userId);

    if (updateError) {
      console.error('[CANCEL] Supabase update error:', updateError);
      // Don't fail — the Dodo cancellation already went through
    }

    console.log(`[CANCEL] Successfully cancelled subscription for user ${userId}`);
    return res.status(200).json({ status: 'success' });
  } catch (error) {
    console.error('[CANCEL] Unhandled error:', error);
    return res.status(500).json({
      error: 'Internal Server Error',
      details: error instanceof Error ? error.message : String(error),
    });
  }
}
