import dotenv from "dotenv";
import express from "express";
import cors from "cors";
import { createServer as createViteServer } from "vite";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({ path: path.join(__dirname, ".env.local") });
dotenv.config({ path: path.join(__dirname, ".env") });

console.log('-------------------------------------------');
console.log('🚀 SOMYRA AI ENGINE LOADED');
console.log('📡 Models: qwen/qwen3-32b → llama-3.3-70b-versatile → llama-3.1-8b-instant');
console.log('-------------------------------------------');

// ─────────────────────────────────────────────────────────────────────────────
// MODEL CHAINS — Groq only. Every tier ends with a lightweight emergency
// fallback so no generation ever hard-fails due to rate limits.
// ─────────────────────────────────────────────────────────────────────────────
const MODEL_CHAINS: Record<string, string[]> = {
  'Free': ['llama-3.3-70b-versatile', 'llama-3.1-8b-instant'],
  'Pro':  ['llama-3.3-70b-versatile', 'qwen/qwen3-32b', 'llama-3.1-8b-instant'],
  'Max':  ['llama-3.3-70b-versatile', 'qwen/qwen3-32b', 'llama-3.1-8b-instant'],
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

  let groqResponse: Response;
  try {
    groqResponse = await fetch('https://api.groq.com/openai/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${process.env.GROQ_API_KEY}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(body)
    });
  } catch (networkErr: any) {
    // fetch() itself threw — DNS failure, connection refused, network timeout
    throw new Error(`Network error calling Groq (${modelId}): ${networkErr.message} [503]`);
  }

  if (!groqResponse.ok) {
    // Safely parse error — Groq sometimes returns HTML on 502/503
    let errorMessage = `Groq API error ${groqResponse.status}`;
    try {
      const error = await groqResponse.json();
      errorMessage = error.error?.message || errorMessage;
    } catch {
      // Non-JSON response (HTML 502 page, etc.) — embed status code for retryable detection
      errorMessage = `Groq returned non-JSON error (status ${groqResponse.status}) [${groqResponse.status}]`;
    }
    throw new Error(errorMessage);
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

        console.log(`[SUCCESS] Tier: ${tier} | Model: ${modelId} | Chars: ${content.length}`);
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
    // cleanUrls-like middleware for prerendered flat .html files
    app.use((req, res, next) => {
      if (!path.extname(req.path)) {
        const htmlPath = path.join(__dirname, "dist", req.path.slice(1) + '.html');
        if (fs.existsSync(htmlPath)) {
          return res.sendFile(htmlPath);
        }
      }
      next();
    });
    app.get("*", (_req, res) => {
      res.sendFile(path.join(__dirname, "dist", "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`✅ Server running on http://localhost:${PORT}`);
  });
}

startServer();
