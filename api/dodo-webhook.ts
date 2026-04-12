import type { VercelRequest, VercelResponse } from '@vercel/node';
import { Webhook } from 'svix';
import { createClient } from '@supabase/supabase-js';

// Product ID Mapping as constants for visibility
const PRO_ID_1 = 'pdt_0NcAa6Nsq6rb7WhPjW213';
const PRO_ID_2 = 'pdt_0NcAaljffcuBCTOBy4CJz';
const MAX_ID_1 = 'pdt_0NcAc5FxE6ZAoRh64IaD9';
const MAX_ID_2 = 'pdt_0NcAcV68XuqmUWa250TxD';

export const config = {
  api: {
    bodyParser: false,
  },
};

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  // 1. Initialize Detailed Context Logging
  console.log('--- DODO WEBHOOK START ---');

  // 2. Access Raw Body manually because bodyParser is disabled in vercel.json
  const rawBody = await new Promise<string>((resolve, reject) => {
    let data = '';
    req.on('data', chunk => { data += chunk; });
    req.on('end', () => resolve(data));
    req.on('error', reject);
  });

  const WEBHOOK_SECRET = process.env.DODO_WEBHOOK_SECRET;
  if (!WEBHOOK_SECRET) {
    console.error('[CRITICAL] Dodo Webhook Secret not configured in environment variables');
    return res.status(500).json({ error: 'Webhook secret not configured' });
  }

  const webhookId = req.headers['webhook-id'] as string;
  const webhookTimestamp = req.headers['webhook-timestamp'] as string;
  const webhookSignature = req.headers['webhook-signature'] as string;

  if (!webhookId || !webhookTimestamp || !webhookSignature) {
    console.error('[ERROR] Missing mandatory Svix/Dodo webhook headers');
    return res.status(400).json({ error: 'Missing webhook headers' });
  }

  const wh = new Webhook(WEBHOOK_SECRET);
  let evt: any;

  try {
    // We pass the RAW string body to wh.verify() for cryptographic integrity
    evt = wh.verify(rawBody, {
      'webhook-id': webhookId,
      'webhook-timestamp': webhookTimestamp,
      'webhook-signature': webhookSignature,
    });
    console.log('[SUCCESS] Signature verification completed successfully');
  } catch (err) {
    console.error('[ERROR] Webhook verification failed:', err);
    return res.status(400).json({ error: 'Invalid signature' });
  }

  const { type, data } = evt;
  console.log(`[EVENT] Received type: ${type}`);
  console.log(`[DATA] Product ID: ${data.product_id}`);

  // 3. Initialize Supabase inside handler to ensure env vars are available
  const supabaseUrl = process.env.VITE_SUPABASE_URL || process.env.SUPABASE_URL || '';
  const supabaseServiceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY || '';
  
  if (!supabaseUrl || !supabaseServiceRoleKey) {
    console.error('[CRITICAL] Supabase connection details missing in runtime environment');
    return res.status(500).json({ error: 'Supabase config missing' });
  }

  const supabase = createClient(supabaseUrl, supabaseServiceRoleKey);

  try {
    // 4. Extract and check product IDs
    const PRO_MONTHLY = process.env.DODO_PRO_MONTHLY_ID || PRO_ID_1;
    const PRO_ANNUAL = process.env.DODO_PRO_ANNUAL_ID || PRO_ID_2;
    const MAX_MONTHLY = process.env.DODO_MAX_MONTHLY_ID || MAX_ID_1;
    const MAX_ANNUAL = process.env.DODO_MAX_ANNUAL_ID || MAX_ID_2;

    console.log('[CONFIG] PRO_MONTHLY:', PRO_MONTHLY);
    console.log('[CONFIG] PRO_ANNUAL:', PRO_ANNUAL);
    console.log('[CONFIG] MAX_MONTHLY:', MAX_MONTHLY);
    console.log('[CONFIG] MAX_ANNUAL:', MAX_ANNUAL);

    const productId = data.product_id;
    const isPro = productId === PRO_MONTHLY || productId === PRO_ANNUAL;
    const isMax = productId === MAX_MONTHLY || productId === MAX_ANNUAL;
    
    console.log(`[EVALUATION] isPro: ${isPro}, isMax: ${isMax}`);

    // 5. Identify User
    const finalUserId = data.metadata?.supabase_user_id || data.metadata?.userId;
    const email = data.customer?.email;
    const subscriptionId = data.subscription_id || data.id;

    console.log(`[USER_CONTEXT] finalUserId: ${finalUserId}, email: ${email}`);

    let userIdToUpdate = finalUserId;

    if (!userIdToUpdate && email) {
      console.log('[LOOKUP] No metadata ID found, attempting email lookup for:', email);
      const { data: profile, error: lookupError } = await supabase
        .from('profiles')
        .select('id')
        .eq('email', email)
        .single();
        
      if (profile) {
        userIdToUpdate = profile.id;
        console.log('[SUCCESS] User ID found via email lookup:', userIdToUpdate);
      } else {
        console.warn('[WARNING] No profile found for email:', email, lookupError);
      }
    }

    if (!userIdToUpdate) {
       console.error('[CRITICAL] Could not identify target user (no metadata ID and no email match)');
       return res.status(200).json({ status: 'ignored_no_user_found' });
    }

    // 6. Subscription Logic Branching
    switch (type) {
      case 'subscription.active':
      case 'payment.succeeded':
      case 'subscription.updated':
        console.log(`[ACTION] Activating/Updating plan for user: ${userIdToUpdate}`);
        
        // Use UPSERT for safety as per instructions
        const { data: updateData, error: updateError } = await supabase
          .from('profiles')
          .upsert({
            id: userIdToUpdate, // match on primary key
            is_pro: isPro || isMax,
            is_max: isMax,
            subscription_id: subscriptionId,
            subscription_status: 'active',
            plan_id: productId,
            email: email // include email just in case it's a new row
          }, { onConflict: 'id' });

        if (updateError) {
          console.error('[CRITICAL] Supabase upsert failed:', updateError);
          return res.status(200).json({ status: 'supabase_error', error: updateError });
        } else {
          console.log(`[FINAL] Activated ${isMax ? 'Max' : isPro ? 'Pro' : 'Tier'} for user ${userIdToUpdate}`);
        }
        break;

      case 'subscription.cancelled':
        console.log(`[ACTION] Marking subscription as cancelled for user: ${userIdToUpdate}`);
        await supabase
          .from('profiles')
          .update({ subscription_status: 'cancelled' })
          .eq('id', userIdToUpdate);
        break;

      case 'subscription.expired':
        console.log(`[ACTION] Revoking access for expired subscription: ${userIdToUpdate}`);
        await supabase
          .from('profiles')
          .update({
            is_pro: false,
            is_max: false,
            subscription_id: null,
            subscription_status: 'free',
            plan_id: null
          })
          .eq('id', userIdToUpdate);
        break;

      default:
        console.log('[INFO] Unhandled Dodo event type:', type);
    }

    console.log('--- DODO WEBHOOK COMPLETED ---');
    return res.status(200).json({ status: 'success' });
  } catch (error) {
    console.error('[CRITICAL] Webhook processing error:', error);
    return res.status(200).json({ status: 'error_logged' });
  }
}
