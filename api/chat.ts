import type { VercelRequest, VercelResponse } from '@vercel/node';

// ─────────────────────────────────────────────────────────────────────────────
// MODEL CHAINS — Groq only. Every tier ends with a lightweight emergency
// fallback so no generation ever hard-fails due to rate limits.
// ─────────────────────────────────────────────────────────────────────────────
const MODEL_CHAINS: Record<string, string[]> = {
  Free: ['llama-3.3-70b-versatile', 'llama-3.1-8b-instant'],
  Pro:  ['llama-3.3-70b-versatile', 'qwen/qwen3-32b', 'llama-3.1-8b-instant'],
  Max:  ['llama-3.3-70b-versatile', 'qwen/qwen3-32b', 'llama-3.1-8b-instant'],
};

// Small delay helper — gives Groq rate limiter time to reset between models
const wait = (ms: number) => new Promise(r => setTimeout(r, ms));

async function executeAiGeneration(
  modelId: string,
  messages: any[],
  temperature: number,
  maxTokens: number
) {
  const body: Record<string, any> = {
    model: modelId,
    messages,
    temperature,
    max_tokens: maxTokens,
  };

  // Disable Qwen3's thinking mode — keeps responses fast and JSON-safe
  if (modelId.includes('qwen3')) {
    body.reasoning_effort = 'none';
  }

  let groqRes: Response;
  try {
    groqRes = await fetch('https://api.groq.com/openai/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${process.env.GROQ_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(body),
    });
  } catch (networkErr: any) {
    // fetch() itself threw — DNS failure, connection refused, network timeout
    throw new Error(`Network error calling Groq (${modelId}): ${networkErr.message} [503]`);
  }

  if (!groqRes.ok) {
    // Safely parse error — Groq sometimes returns HTML on 502/503
    let errorMessage = `Groq API error ${groqRes.status}`;
    try {
      const err = await groqRes.json();
      errorMessage = err.error?.message || errorMessage;
    } catch {
      // Non-JSON response (HTML 502 page, etc.) — embed status code for retryable detection
      errorMessage = `Groq returned non-JSON error (status ${groqRes.status}) [${groqRes.status}]`;
    }
    throw new Error(errorMessage);
  }

  return groqRes.json();
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  // CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  const { messages, temperature, max_tokens, tier = 'Free' } = req.body;

  if (!messages || !Array.isArray(messages) || messages.length === 0) {
    return res.status(400).json({
      error: { message: 'messages array is required', type: 'invalid_request' }
    });
  }

  const chain = MODEL_CHAINS[tier] || MODEL_CHAINS['Free'];
  let lastError: Error | null = null;

  for (let i = 0; i < chain.length; i++) {
    const modelId = chain[i];
    try {
      console.log(`[ROUTING] Tier: ${tier} → Model: ${modelId} (${i + 1}/${chain.length})`);
      const result = await executeAiGeneration(
        modelId,
        messages,
        temperature ?? 0.7,
        max_tokens ?? 8192
      );

      const content = result?.choices?.[0]?.message?.content;
      if (!content || typeof content !== 'string' || content.trim().length === 0) {
        throw new Error(`Model ${modelId} returned empty content`);
      }

      console.log(`[SUCCESS] ${modelId} | Chars: ${content.length}`);
      return res.json(result);

    } catch (error: any) {
      lastError = error;
      const msg = error.message || '';
      console.warn(`[FAILOVER] ${modelId}: ${msg}`);

      // Add a small delay before trying the next model to avoid cascade rate limits
      if (i < chain.length - 1) {
        const delay = msg.includes('429') || msg.includes('rate_limit') ? 2000 : 500;
        console.log(`[WAIT] ${delay}ms before next model...`);
        await wait(delay);
      }

      continue; // ALWAYS try the next model — never break early
    }
  }

  console.error('[CHAIN EXHAUSTED] Last error:', lastError?.message);
  return res.status(500).json({
    error: {
      message: lastError?.message || 'All models failed.',
      type: 'resilience_failure'
    }
  });
}
