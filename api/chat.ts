import type { VercelRequest, VercelResponse } from '@vercel/node';
import { GoogleGenerativeAI } from '@google/generative-ai';

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || '');

const MODEL_CHAINS: Record<string, string[]> = {
  Free: ['gemini-2.0-flash', 'gemini-2.0-flash-lite', 'llama-3.3-70b-versatile'],
  Pro:  ['gemini-2.5-flash', 'gemini-2.0-flash', 'llama-3.3-70b-versatile'],
  Max:  ['gemini-2.5-pro',   'gemini-2.5-flash',  'llama-3.3-70b-versatile'],
};

async function executeAiGeneration(
  modelId: string,
  messages: any[],
  temperature: number,
  maxTokens: number
) {
  // ── Groq / Llama path ──────────────────────────────────────────────────────
  if (modelId.includes('llama') || modelId.includes('versatile')) {
    const groqRes = await fetch('https://api.groq.com/openai/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${process.env.GROQ_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ model: modelId, messages, temperature, max_tokens: maxTokens }),
    });
    if (!groqRes.ok) {
      const err = await groqRes.json();
      throw new Error(err.error?.message || 'Groq API error');
    }
    return groqRes.json();
  }

  // ── Gemini path ────────────────────────────────────────────────────────────
  const cleanModelId = modelId.replace(/^models\//, '');
  const systemMessage = messages.find((m: any) => m.role === 'system')?.content || '';

  const contents = messages
    .filter((m: any) => m.role !== 'system')
    .map((m: any) => ({
      role: m.role === 'assistant' ? 'model' : 'user',
      parts: [{ text: typeof m.content === 'string' ? m.content : JSON.stringify(m.content) }],
    }));

  if (contents.length === 0) throw new Error('No user messages to send to Gemini');
  if (contents[0].role !== 'user') throw new Error('Gemini conversation must start with a user message');

  const model = genAI.getGenerativeModel({
    model: cleanModelId,
    ...(systemMessage
      ? { systemInstruction: { role: 'system', parts: [{ text: systemMessage }] } }
      : {}),
    generationConfig: { temperature, maxOutputTokens: maxTokens },
    safetySettings: [
      { category: 'HARM_CATEGORY_HATE_SPEECH'      as any, threshold: 'BLOCK_NONE' as any },
      { category: 'HARM_CATEGORY_HARASSMENT'        as any, threshold: 'BLOCK_NONE' as any },
      { category: 'HARM_CATEGORY_SEXUALLY_EXPLICIT' as any, threshold: 'BLOCK_NONE' as any },
      { category: 'HARM_CATEGORY_DANGEROUS_CONTENT' as any, threshold: 'BLOCK_NONE' as any },
    ],
  });

  const result = await model.generateContent({ contents });

  let outputText = '';
  try {
    outputText =
      result?.response?.candidates?.[0]?.content?.parts?.[0]?.text ??
      (typeof result?.response?.text === 'function' ? result.response.text() : '') ??
      '';
  } catch {
    outputText = '';
  }

  return { choices: [{ message: { content: outputText } }] };
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  // CORS headers (needed for browser → serverless function calls)
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  const { messages, temperature, max_tokens, tier = 'Free' } = req.body;

  if (!messages || !Array.isArray(messages) || messages.length === 0) {
    return res.status(400).json({ error: { message: 'messages array is required', type: 'invalid_request' } });
  }

  const chain = MODEL_CHAINS[tier] || MODEL_CHAINS['Free'];
  let lastError: Error | null = null;

  for (const modelId of chain) {
    try {
      console.log(`[ROUTING] Tier: ${tier} → Model: ${modelId}`);
      const result = await executeAiGeneration(modelId, messages, temperature ?? 0.7, max_tokens ?? 8192);

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
        error.message?.includes('RESOURCE_EXHAUSTED') ||
        error.message?.includes('503') ||
        error.message?.includes('overloaded') ||
        error.message?.includes('empty content') ||
        error.message?.includes('500');

      console.warn(`[${isRetryable ? 'FAILOVER' : 'ERROR'}] ${modelId}: ${error.message}`);
      continue; // always try next in chain
    }
  }

  console.error('[CHAIN EXHAUSTED] Last error:', lastError?.message);
  return res.status(500).json({
    error: { message: lastError?.message || 'All models failed.', type: 'resilience_failure' }
  });
}
