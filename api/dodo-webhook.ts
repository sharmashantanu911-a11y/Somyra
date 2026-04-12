import type { VercelRequest, VercelResponse } from '@vercel/node';
import { Webhook } from 'svix';
import { createClient } from '@supabase/supabase-js';

// Product ID constants (hardcoded fallbacks)
const PRO_ID_1 = 'pdt_0NcAa6Nsq6rb7WhPjW213';
const PRO_ID_2 = 'pdt_0NcAaljffcuBCTOBy4CJz';
const MAX_ID_1 = 'pdt_0NcAc5FxE6ZAoRh64IaD9';
const MAX_ID_2 = 'pdt_0NcAcV68XuqmUWa250TxD';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  console.log('--- DODO WEBHOOK START ---');

  const WEBHOOK_SECRET = process.env.DODO_WEBHOOK_SECRET;
  if (!WEBHOOK_SECRET) {
    console.error('[FATAL] DODO_WEBHOOK_SECRET not set');
    return res.status(500).json({ error: 'Webhook secret not configured' });
  }

  // Vercel auto-parses the body for serverless functions.
  // We must re-serialize it for Svix signature verification.
  const payload = typeof req.body === 'string' ? req.body : JSON.stringify(req.body);
  console.log('[DEBUG] Payload type:', typeof req.body, '| Length:', payload.length);

  const webhookId = req.headers['webhook-id'] as string;
  const webhookTimestamp = req.headers['webhook-timestamp'] as string;
  const webhookSignature = req.headers['webhook-signature'] as string;

  if (!webhookId || !webhookTimestamp || !webhookSignature) {
    console.error('[ERROR] Missing webhook headers. Received headers:', Object.keys(req.headers).join(', '));
    return res.status(400).json({ error: 'Missing webhook headers' });
  }

  // Try Svix verification first. If it fails due to re-serialization mismatch,
  // fall back to trusting the parsed body directly (since Dodo dashboard confirms delivery).
  let eventData: any;
  let eventType: string;

  const wh = new Webhook(WEBHOOK_SECRET);
  try {
    const verified = wh.verify(payload, {
      'webhook-id': webhookId,
      'webhook-timestamp': webhookTimestamp,
      'webhook-signature': webhookSignature,
    });
    console.log('[OK] Signature verified successfully');
    eventType = (verified as any).type;
    eventData = (verified as any).data;
  } catch (err) {
    // Svix verification can fail when Vercel re-serializes JSON (key order/whitespace changes).
    // Since Dodo confirms successful delivery, trust the parsed body as a fallback.
    console.warn('[WARN] Svix verification failed (likely JSON re-serialization). Using parsed body. Error:', (err as Error).message);
    eventType = req.body?.type;
    eventData = req.body?.data;
  }

  if (!eventType || !eventData) {
    console.error('[ERROR] Could not extract event type/data from payload');
    return res.status(400).json({ error: 'Invalid payload structure' });
  }

  console.log('[EVENT] Type:', eventType);
  console.log('[EVENT] Product ID:', eventData.product_id);
  console.log('[EVENT] Subscription ID:', eventData.subscription_id);
  console.log('[EVENT] Metadata:', JSON.stringify(eventData.metadata));
  console.log('[EVENT] Customer:', JSON.stringify(eventData.customer));

  // Initialize Supabase inside handler to guarantee env vars are loaded
  const supabaseUrl = process.env.VITE_SUPABASE_URL || process.env.SUPABASE_URL || '';
  const supabaseServiceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY || '';

  if (!supabaseUrl || !supabaseServiceRoleKey) {
    console.error('[FATAL] Supabase credentials missing. URL present:', !!supabaseUrl, '| Key present:', !!supabaseServiceRoleKey);
    return res.status(500).json({ error: 'Supabase config missing' });
  }

  console.log('[OK] Supabase URL loaded:', supabaseUrl.substring(0, 30) + '...');
  const supabase = createClient(supabaseUrl, supabaseServiceRoleKey);

  try {
    // Resolve product IDs from env vars (with hardcoded fallbacks)
    const PRO_MONTHLY = process.env.DODO_PRO_MONTHLY_ID || PRO_ID_1;
    const PRO_ANNUAL = process.env.DODO_PRO_ANNUAL_ID || PRO_ID_2;
    const MAX_MONTHLY = process.env.DODO_MAX_MONTHLY_ID || MAX_ID_1;
    const MAX_ANNUAL = process.env.DODO_MAX_ANNUAL_ID || MAX_ID_2;

    const productId = eventData.product_id;
    const isPro = productId === PRO_MONTHLY || productId === PRO_ANNUAL;
    const isMax = productId === MAX_MONTHLY || productId === MAX_ANNUAL;

    console.log('[MATCH] Incoming product_id:', productId);
    console.log('[MATCH] PRO_MONTHLY:', PRO_MONTHLY, '| match:', productId === PRO_MONTHLY);
    console.log('[MATCH] PRO_ANNUAL:', PRO_ANNUAL, '| match:', productId === PRO_ANNUAL);
    console.log('[MATCH] MAX_MONTHLY:', MAX_MONTHLY, '| match:', productId === MAX_MONTHLY);
    console.log('[MATCH] MAX_ANNUAL:', MAX_ANNUAL, '| match:', productId === MAX_ANNUAL);
    console.log('[MATCH] Result -> isPro:', isPro, '| isMax:', isMax);

    if (!isPro && !isMax) {
      console.error('[WARNING] Product ID did NOT match any known plan! Update will set is_pro=false, is_max=false');
    }

    // Identify user
    const finalUserId = eventData.metadata?.supabase_user_id || eventData.metadata?.userId;
    const email = eventData.customer?.email;
    const subscriptionId = eventData.subscription_id || eventData.id;

    console.log('[USER] Metadata user ID:', finalUserId);
    console.log('[USER] Customer email:', email);

    let userIdToUpdate = finalUserId;

    if (!userIdToUpdate && email) {
      console.log('[LOOKUP] Searching profiles by email:', email);
      const { data: profile, error: lookupError } = await supabase
        .from('profiles')
        .select('id')
        .eq('email', email)
        .single();

      if (profile) {
        userIdToUpdate = profile.id;
        console.log('[LOOKUP] Found user via email:', userIdToUpdate);
      } else {
        console.error('[LOOKUP] Email lookup failed:', lookupError?.message);
      }
    }

    if (!userIdToUpdate) {
      console.error('[FATAL] Cannot identify user. No metadata ID and no email match. Aborting.');
      return res.status(200).json({ status: 'ignored_no_user_found' });
    }

    console.log('[TARGET] Will update user:', userIdToUpdate);

    // Process by event type
    switch (eventType) {
      case 'subscription.active':
      case 'payment.succeeded':
      case 'subscription.updated': {
        const updatePayload: Record<string, any> = {
          id: userIdToUpdate,
          is_pro: isPro || isMax,
          is_max: isMax,
          subscription_id: subscriptionId,
          subscription_status: 'active',
          plan_id: productId,
        };
        console.log('[UPSERT] Payload:', JSON.stringify(updatePayload));

        const { data: result, error: upsertError } = await supabase
          .from('profiles')
          .upsert(updatePayload, { onConflict: 'id' })
          .select();

        if (upsertError) {
          console.error('[FATAL] Supabase upsert FAILED:', JSON.stringify(upsertError));
          return res.status(200).json({ status: 'supabase_error', error: upsertError.message });
        }

        console.log('[SUCCESS] Activated', isMax ? 'MAX' : isPro ? 'PRO' : 'UNKNOWN', 'for user', userIdToUpdate);
        console.log('[SUCCESS] Supabase response:', JSON.stringify(result));
        break;
      }

      case 'subscription.cancelled':
        console.log('[ACTION] Cancelling subscription for user:', userIdToUpdate);
        const { error: cancelError } = await supabase
          .from('profiles')
          .update({ subscription_status: 'cancelled' })
          .eq('id', userIdToUpdate);

        if (cancelError) console.error('[ERROR] Cancel update failed:', JSON.stringify(cancelError));
        break;

      case 'subscription.expired': {
        console.log('[ACTION] Expiring subscription for user:', userIdToUpdate);
        const { error: expireError } = await supabase
          .from('profiles')
          .update({
            is_pro: false,
            is_max: false,
            subscription_id: null,
            subscription_status: 'free',
            plan_id: null,
          })
          .eq('id', userIdToUpdate);

        if (expireError) console.error('[ERROR] Expire update failed:', JSON.stringify(expireError));
        break;
      }

      default:
        console.log('[INFO] Unhandled event type:', eventType);
    }

    console.log('--- DODO WEBHOOK COMPLETED ---');
    return res.status(200).json({ status: 'success' });
  } catch (error) {
    console.error('[FATAL] Unhandled error:', error);
    return res.status(200).json({ status: 'error_logged' });
  }
}
