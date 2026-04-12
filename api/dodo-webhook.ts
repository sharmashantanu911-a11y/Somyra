import type { VercelRequest, VercelResponse } from '@vercel/node';
import { Webhook } from 'svix';
import { createClient } from '@supabase/supabase-js';

// Initialize Supabase with service role key for admin access
const supabaseUrl = process.env.VITE_SUPABASE_URL || '';
const supabaseServiceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY || '';
const supabase = createClient(supabaseUrl, supabaseServiceRoleKey);

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  const WEBHOOK_SECRET = process.env.DODO_WEBHOOK_SECRET;
  if (!WEBHOOK_SECRET) {
    console.error('Dodo Webhook Secret not configured');
    return res.status(500).json({ error: 'Webhook secret not configured' });
  }

  const headers = req.headers;
  const payload = JSON.stringify(req.body);
  const signature = headers['dodo-signature'] as string;
  console.log('All headers:', JSON.stringify(req.headers));

  if (!signature) {
    return res.status(400).json({ error: 'Missing dodo-signature header' });
  }

  const wh = new Webhook(WEBHOOK_SECRET);
  let evt: any;

  try {
    // Verify the webhook signature
    evt = wh.verify(payload, {
      'svix-id': headers['svix-id'] as string,
      'svix-timestamp': headers['svix-timestamp'] as string,
      'svix-signature': signature,
    });
  } catch (err) {
    console.error('Webhook signature verification failed:', err);
    return res.status(400).json({ error: 'Invalid signature' });
  }

  const { type, data } = evt;
  console.log(`Received Dodo Webhook: ${type}`, data);

  try {
    const userId = data.metadata?.userId;
    const email = data.customer?.email;
    const productId = data.product_id;
    const subscriptionId = data.subscription_id || data.id;

    // Product ID Mapping from Verification Checklist
    const PRO_ID_1 = 'pdt_0NcAa6Nsq6rb7WhPjW213';
    const PRO_ID_2 = 'pdt_0NcAaljffcuBCTOBy4CJz';
    const MAX_ID_1 = 'pdt_0NcAc5FxE6ZAoRh64IaD9';
    const MAX_ID_2 = 'pdt_0NcAcV68XuqmUWa250TxD';

    const PRO_MONTHLY = process.env.DODO_PRO_MONTHLY_ID || PRO_ID_1;
    const PRO_ANNUAL = process.env.DODO_PRO_ANNUAL_ID || PRO_ID_2;
    const MAX_MONTHLY = process.env.DODO_MAX_MONTHLY_ID || MAX_ID_1;
    const MAX_ANNUAL = process.env.DODO_MAX_ANNUAL_ID || MAX_ID_2;

    const isPro = productId === PRO_MONTHLY || productId === PRO_ANNUAL;
    const isMax = productId === MAX_MONTHLY || productId === MAX_ANNUAL;

    // Extract User ID - support both 'userId' and 'supabase_user_id'
    const finalUserId = data.metadata?.supabase_user_id || data.metadata?.userId;

    if (!finalUserId && email) {
      // If metadata is missing, identify user by email
      const { data: profile } = await supabase.from('profiles').select('id').eq('email', email).single();
      if (profile) {
        // Fallback found
      } else {
        console.warn('Webhook received without userId/email match:', type);
        return res.status(200).json({ status: 'ignored_no_user' });
      }
    }

    const userIdToUpdate = finalUserId || (await supabase.from('profiles').select('id').eq('email', email).single()).data?.id;

    if (!userIdToUpdate) {
       return res.status(200).json({ status: 'ignored_no_user_found' });
    }

    // Expiry Date (Handling for reminders)
    const nextBillingDate = data.next_billing_date || data.current_period_end;

    switch (type) {
      case 'subscription.active':
      case 'payment.succeeded':
      case 'subscription.updated':
        // Update user to active tier
        await supabase
          .from('profiles')
          .update({
            is_pro: isPro || isMax,
            is_max: isMax,
            subscription_id: subscriptionId,
            subscription_status: 'active',
            plan_id: productId,
            // current_period_end: nextBillingDate // Uncomment after adding column
          })
          .eq('id', userIdToUpdate);
        break;

      case 'subscription.cancelled':
        // User cancelled, but retain access until end of period
        await supabase
          .from('profiles')
          .update({
            subscription_status: 'cancelled',
            // We do NOT set is_pro/is_max to false here as per user's request
          })
          .eq('id', userIdToUpdate);
        break;

      case 'subscription.expired':
        // Access revoked only on expiration
        await supabase
          .from('profiles')
          .update({
            is_pro: false,
            is_max: false,
            subscription_id: null,
            subscription_status: 'free',
            plan_id: null,
            // current_period_end: null
          })
          .eq('id', userIdToUpdate);
        break;

      default:
        console.log('Unhandled event type:', type);
    }

    return res.status(200).json({ status: 'success' });
  } catch (error) {
    console.error('Webhook processing error:', error);
    // Always return 200 to Dodo to stop retries, but log the error
    return res.status(200).json({ status: 'error_logged' });
  }
}
