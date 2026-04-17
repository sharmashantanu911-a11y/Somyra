import dotenv from "dotenv";
import express from "express";
import cors from "cors";
import { createServer as createViteServer } from "vite";
import path from "path";
import { fileURLToPath } from "url";
import { GoogleGenerativeAI } from "@google/generative-ai";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({ path: path.join(__dirname, ".env.local") });
dotenv.config({ path: path.join(__dirname, ".env") });

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || '');

console.log('-------------------------------------------');
console.log('🚀 SOMYRA AI ENGINE LOADED');
console.log(`📡 Models: gemini-2.5-pro, gemini-2.5-flash, gemini-2.0-flash`);
console.log('-------------------------------------------');

// Model Chain Definitions
// NOTE: Do NOT prefix model names with "models/" — the new @google/genai SDK
// does not use that prefix. Using it causes silent failures.
const MODEL_CHAINS: Record<string, string[]> = {
  'Free': [
    'gemini-2.0-flash',
    'gemini-1.5-flash',
    'gemini-2.0-flash-lite',
    'llama-3.3-70b-versatile'
  ],
  'Pro': [
    'gemini-1.5-pro',
    'gemini-2.0-flash',
    'gemini-1.5-flash',
    'llama-3.3-70b-versatile'
  ],
  'Max': [
    'gemini-1.5-pro',
    'gemini-2.0-flash',
    'gemini-1.5-flash',
    'llama-3.3-70b-versatile'
  ]
};

async function executeAiGeneration(
  modelId: string,
  messages: any[],
  temperature: number,
  maxTokens: number
) {
  // ── Groq / Llama path (OpenAI-compatible, keep as-is) ──────────────────────
  if (modelId.includes('llama') || modelId.includes('versatile')) {
    const groqResponse = await fetch('https://api.groq.com/openai/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${process.env.GROQ_API_KEY}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        model: modelId,
        messages,
        temperature,
        max_tokens: maxTokens
      })
    });

    if (!groqResponse.ok) {
      const error = await groqResponse.json();
      throw new Error(error.error?.message || 'Groq API error');
    }
    return await groqResponse.json();
  }

  // ── Gemini path ────────────────────────────────────────────────────────────

  // FIX 1: Strip any "models/" prefix — new SDK does not use it.
  const cleanModelId = modelId.replace(/^models\//, '');

  // FIX 2: Extract system message before building the contents array.
  const systemMessage = messages.find((m: any) => m.role === 'system')?.content || '';

  // FIX 3: Map remaining messages to Gemini's content format.
  // Gemini only accepts role "user" or "model" (not "assistant").
  // Also Gemini requires the conversation to start with a "user" turn —
  // never with a "model" turn. Filter out any leading model messages.
  const userMessages = messages
    .filter((m: any) => m.role !== 'system')
    .map((m: any) => ({
      role: m.role === 'assistant' ? 'model' : 'user',
      parts: [{ text: typeof m.content === 'string' ? m.content : JSON.stringify(m.content) }]
    }));

  // Guard: Gemini requires at least one user message
  if (userMessages.length === 0) {
    throw new Error('No user messages to send to Gemini');
  }

  // Guard: conversation must start with "user" role
  if (userMessages[0].role !== 'user') {
    throw new Error('Gemini conversation must start with a user message');
  }

  // FIX: Use getGenerativeModel (works across all @google/generative-ai versions)
  const model = genAI.getGenerativeModel({
    model: cleanModelId,
    ...(systemMessage
      ? { systemInstruction: { role: 'system', parts: [{ text: systemMessage }] } }
      : {}),
    generationConfig: {
      temperature,
      maxOutputTokens: maxTokens,
    },
    // Safety settings at TOP LEVEL, not inside generationConfig
    safetySettings: [
      { category: 'HARM_CATEGORY_HATE_SPEECH' as any,       threshold: 'BLOCK_NONE' as any },
      { category: 'HARM_CATEGORY_HARASSMENT' as any,         threshold: 'BLOCK_NONE' as any },
      { category: 'HARM_CATEGORY_SEXUALLY_EXPLICIT' as any,  threshold: 'BLOCK_NONE' as any },
      { category: 'HARM_CATEGORY_DANGEROUS_CONTENT' as any,  threshold: 'BLOCK_NONE' as any }
    ]
  });

  const response = await model.generateContent({ contents: userMessages });

  // FIX: .text() is a METHOD, not a property — call it, don't read it
  let outputText = '';
  try {
    outputText =
      response?.response?.candidates?.[0]?.content?.parts?.[0]?.text ??
      (typeof response?.response?.text === 'function' ? response.response.text() : '') ??
      '';
  } catch {
    outputText = '';
  }

  return {
    choices: [
      {
        message: {
          content: outputText
        }
      }
    ]
  };
}

async function startServer() {
  const app = express();
  const PORT = Number(process.env.PORT || 3001);

  app.use(cors());
  app.use(express.json({ limit: '2mb' })); // Voice profiles + audit prompts can be large

  // Health check
  app.get("/api/health", (_req, res) => {
    res.json({ status: "ok", timestamp: new Date().toISOString() });
  });

  // Main Chat Router with Tiered Fallback
  app.post("/api/chat", async (req, res) => {
    const { messages, temperature, max_tokens, tier = 'Free' } = req.body;

    // Validate request body
    if (!messages || !Array.isArray(messages) || messages.length === 0) {
      return res.status(400).json({
        error: { message: 'messages array is required and must not be empty', type: 'invalid_request' }
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

        // Validate that we actually got content back before returning
        const content = result?.choices?.[0]?.message?.content;
        if (!content || typeof content !== 'string' || content.trim().length === 0) {
          throw new Error(`Model ${modelId} returned empty content`);
        }

        console.log(`[SUCCESS] Tier: ${tier} | Model: ${modelId} | Chars: ${content.length}`);
        return res.json(result);

      } catch (error: any) {
        lastError = error;

        const isRateLimit =
          error.message?.includes('429') ||
          error.message?.includes('quota') ||
          error.message?.includes('Resource has been exhausted') ||
          error.message?.includes('503') ||
          error.message?.includes('high demand') ||
          error.message?.includes('RESOURCE_EXHAUSTED') ||
          error.message?.includes('overloaded');

        const isRetryable =
          isRateLimit ||
          error.message?.includes('empty content') ||
          error.message?.includes('500');

        if (isRetryable) {
          console.warn(`[FAILOVER] ${modelId} → ${error.message}. Trying next in chain...`);
          continue;
        }

        // Non-retryable errors: bad request, auth, invalid model, etc.
        console.error(`[ERROR] ${modelId} hard failure:`, error.message);

        // If there's a next model, try it anyway — better to try than to stop
        if (modelId !== chain[chain.length - 1]) {
          console.warn(`[FAILOVER] Trying next model despite hard error...`);
          continue;
        }

        break;
      }
    }

    console.error('[CHAIN EXHAUSTED] All models failed. Last error:', lastError?.message);
    res.status(500).json({
      error: {
        message: lastError?.message || 'All models in chain failed.',
        type: 'resilience_failure'
      }
    });
  });

  // Vite middleware for development
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: {
        middlewareMode: true,
        hmr: {
          port: Number(process.env.VITE_HMR_PORT || 24681),
        },
      },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    app.use(express.static(path.join(__dirname, "dist")));
    app.get("*", (_req, res) => {
      res.sendFile(path.join(__dirname, "dist", "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`✅ Server running on http://localhost:${PORT}`);
  });
}

startServer();
