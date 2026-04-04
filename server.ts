import dotenv from "dotenv";
import express from "express";
import { createServer as createViteServer } from "vite";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({ path: path.join(__dirname, ".env.local") });
dotenv.config({ path: path.join(__dirname, ".env") });

async function startServer() {
  const app = express();
  const PORT = Number(process.env.PORT || 3001);

  app.use(express.json());

  // Health check
  app.get("/api/health", (req, res) => {
    res.json({ status: "ok" });
  });

  // In-memory rate limiter: 20 requests per IP per minute
  const rateLimitMap = new Map<string, { count: number; resetAt: number }>();
  const RATE_LIMIT = 20;
  const RATE_WINDOW_MS = 60 * 1000;

  // Groq API Proxy
  app.post("/api/chat", async (req, res) => {
    const GROQ_API_KEY = process.env.GROQ_API_KEY;
    const DEFAULT_MODEL = "moonshotai/kimi-k2-instruct-0905";

    if (!GROQ_API_KEY) {
      console.error("GROQ_API_KEY is missing from environment variables");
      return res.status(500).json({ error: "GROQ_API_KEY is not configured" });
    }

    // Rate limit check
    const ip = (req.headers['x-forwarded-for'] as string)?.split(',')[0]?.trim() || req.socket.remoteAddress || 'unknown';
    const now = Date.now();
    const entry = rateLimitMap.get(ip);
    if (entry && now < entry.resetAt) {
      if (entry.count >= RATE_LIMIT) {
        return res.status(429).json({ error: 'Rate limit exceeded. Please wait before making more requests.' });
      }
      entry.count++;
    } else {
      rateLimitMap.set(ip, { count: 1, resetAt: now + RATE_WINDOW_MS });
    }
    // Cleanup old entries periodically
    if (rateLimitMap.size > 10000) {
      for (const [k, v] of rateLimitMap.entries()) {
        if (now > v.resetAt) rateLimitMap.delete(k);
      }
    }

    try {
      const response = await fetch("https://api.groq.com/openai/v1/chat/completions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${GROQ_API_KEY}`,
        },
        body: JSON.stringify({
          model: req.body.model || DEFAULT_MODEL,
          messages: req.body.messages,
          temperature: req.body.temperature || 0.7,
          max_tokens: req.body.max_tokens || 16384,
        }),
      });

      const contentType = response.headers.get("content-type");
      if (contentType && contentType.includes("application/json")) {
        const data = await response.json();
        res.status(response.status).json(data);
      } else {
        const text = await response.text();
        console.error("Groq API returned non-JSON response:", text);
        res.status(response.status).json({ error: "Groq API returned non-JSON response", details: text.substring(0, 500) });
      }
    } catch (error) {
      console.error("Local Proxy Error:", error);
      res.status(500).json({ error: "Internal Server Error", details: error instanceof Error ? error.message : String(error) });
    }
  });

  // Vite middleware for development
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: {
        middlewareMode: true,
        hmr: {
          port: Number(process.env.VITE_HMR_PORT || 24679),
        },
      },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    app.use(express.static(path.join(__dirname, "dist")));
    app.get("*", (req, res) => {
      res.sendFile(path.join(__dirname, "dist", "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
