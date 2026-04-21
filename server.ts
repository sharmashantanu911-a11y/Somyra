import dotenv from "dotenv";
import express from "express";
import cors from "cors";
import { createServer as createViteServer } from "vite";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({ path: path.join(__dirname, ".env.local") });
dotenv.config({ path: path.join(__dirname, ".env") });

console.log('-------------------------------------------');
console.log('🚀 SOMYRA AI ENGINE LOADED');
console.log('📡 Models: qwen/qwen3-32b → llama-3.3-70b-versatile');
console.log('-------------------------------------------');

// ─────────────────────────────────────────────────────────────────────────────
// MODEL CHAINS — Groq only. Qwen3-32B primary, Llama 70B fallback.
// Gemini removed entirely due to free tier rate limits.
// ─────────────────────────────────────────────────────────────────────────────
const MODEL_CHAINS: Record<string, string[]> = {
  'Free': ['llama-3.3-70b-versatile'],
  'Pro':  ['qwen/qwen3-32b', 'llama-3.3-70b-versatile'],
  'Max':  ['qwen/qwen3-32b', 'llama-3.3-70b-versatile'],
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

  const groqResponse = await fetch('https://api.groq.com/openai/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${process.env.GROQ_API_KEY}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(body)
  });

  if (!groqResponse.ok) {
    const error = await groqResponse.json();
    throw new Error(error.error?.message || `Groq API error ${groqResponse.status}`);
  }

  return await groqResponse.json();
}

async function startServer() {
  const app = express();
  const PORT = Number(process.env.PORT || 3001);

  app.use(cors());
  app.use(express.json({ limit: '2mb' }));

  // Health check
  app.get("/api/health", (_req, res) => {
    res.json({ status: "ok", timestamp: new Date().toISOString() });
  });

  // Main Chat Router with Tiered Fallback
  app.post("/api/chat", async (req, res) => {
    const { messages, temperature, max_tokens, tier = 'Free' } = req.body;

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

        const content = result?.choices?.[0]?.message?.content;
        if (!content || typeof content !== 'string' || content.trim().length === 0) {
          throw new Error(`Model ${modelId} returned empty content`);
        }

        console.log(`[SUCCESS] Tier: ${tier} | Model: ${modelId} | Chars: ${content.length}`);
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

        if (isRetryable) {
          console.warn(`[FAILOVER] ${modelId} → ${error.message}. Trying next in chain...`);
          continue;
        }

        console.error(`[ERROR] ${modelId} hard failure:`, error.message);

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
