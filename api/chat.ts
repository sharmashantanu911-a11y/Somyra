import type { VercelRequest, VercelResponse } from '@vercel/node';

// ─────────────────────────────────────────────────────────────────────────────
// MODEL CHAINS — Groq only. Qwen3-32B primary, Llama 70B fallback.
// Gemini removed entirely due to free tier rate limits.
// ─────────────────────────────────────────────────────────────────────────────
const MODEL_CHAINS: Record<string, string[]> = {
  Free: ['llama-3.3-70b-versatile'],
  Pro:  ['qwen/qwen3-32b', 'llama-3.3-70b-versatile'],
  Max:  ['qwen/qwen3-32b', 'llama-3.3-70b-versatile'],
};

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

  const groqRes = await fetch('https://api.groq.com/openai/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${process.env.GROQ_API_KEY}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(body),
  });

  if (!groqRes.ok) {
    const err = await groqRes.json();
    throw new Error(err.error?.message || `Groq API error ${groqRes.status}`);
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

  for (const modelId of chain) {
    try {
      console.log(`[ROUTING] Tier: ${tier} → Model: ${modelId}`);
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

      const isRetryable =
        error.message?.includes('429') ||
        error.message?.includes('quota') ||
        error.message?.includes('rate_limit') ||
        error.message?.includes('Resource has been exhausted') ||
        error.message?.includes('RESOURCE_EXHAUSTED') ||
        error.message?.includes('503') ||
        error.message?.includes('500') ||
        error.message?.includes('overloaded') ||
        error.message?.includes('high demand') ||
        error.message?.includes('empty content');

      console.warn(`[${isRetryable ? 'FAILOVER' : 'ERROR'}] ${modelId}: ${error.message}`);
      continue; // always try next in chain
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
