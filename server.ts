import dotenv from "dotenv";
import express from "express";
import cors from "cors";
import { createServer as createViteServer } from "vite";
import path from "path";
import { fileURLToPath } from "url";
import { GoogleGenAI } from "@google/genai";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({ path: path.join(__dirname, ".env.local") });
dotenv.config({ path: path.join(__dirname, ".env") });

const genAI = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY || '' });

console.log('-------------------------------------------');
console.log('🚀 SOMYRA AI ENGINE LOADED');
console.log(`📡 STABLE MODELS: gemini-2.0-flash-lite, gemini-1.5-pro`);
console.log('-------------------------------------------');

// Model Chain Definitions (April 2026 Standards)
const MODEL_CHAINS: Record<string, string[]> = {
  'Free': [
    'models/gemini-2.0-flash',
    'models/gemini-2.5-flash',
    'models/gemini-2.0-flash-lite-001',
    'llama-3.3-70b-versatile'
  ],
  'Pro': [
    'models/gemini-2.5-pro',
    'models/gemini-2.5-flash',
    'models/gemini-2.0-flash'
  ],
  'Max': [
    'models/gemini-2.5-pro',
    'models/gemini-2.5-flash',
    'models/gemini-2.0-flash'
  ]
};

async function executeAiGeneration(modelId: string, messages: any[], temperature: number, maxTokens: number) {
  // Handle Groq/Llama separately
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

  // Handle Gemini via unified SDK
  const systemMessage = messages.find((m: any) => m.role === 'system')?.content || '';
  const userMessages = messages.filter((m: any) => m.role !== 'system').map((m: any) => ({
    role: m.role === 'assistant' ? 'model' : 'user',
    parts: [{ text: m.content }]
  }));

  const response = await (genAI as any).models.generateContent({
    model: modelId,
    systemInstruction: systemMessage,
    contents: userMessages,
    config: {
      temperature: temperature,
      maxOutputTokens: maxTokens,
      safetySettings: [
        { category: 'HARM_CATEGORY_HATE_SPEECH', threshold: 'BLOCK_NONE' },
        { category: 'HARM_CATEGORY_HARASSMENT', threshold: 'BLOCK_NONE' },
        { category: 'HARM_CATEGORY_SEXUALLY_EXPLICIT', threshold: 'BLOCK_NONE' },
        { category: 'HARM_CATEGORY_DANGEROUS_CONTENT', threshold: 'BLOCK_NONE' }
      ]
    }
  });

  return {
    choices: [
      {
        message: {
          content: response.text
        }
      }
    ]
  };
}

async function startServer() {
  const app = express();
  const PORT = Number(process.env.PORT || 3001);

  app.use(cors());
  app.use(express.json());

  // Health check
  app.get("/api/health", (req, res) => {
    res.json({ status: "ok" });
  });

  // Main Chat Router with Tiered Fallback
  app.post("/api/chat", async (req, res) => {
    const { messages, temperature, max_tokens, tier = 'Free' } = req.body;
    const chain = MODEL_CHAINS[tier] || MODEL_CHAINS['Free'];
    let lastError = null;

    for (const modelId of chain) {
      try {
        console.log(`[ROUTING] Tier: ${tier} -> Attempting model: ${modelId}`);
        const result = await executeAiGeneration(modelId, messages, temperature || 0.7, max_tokens || 8192);
        return res.json(result);
      } catch (error: any) {
        lastError = error;
        const isRateLimit = error.message?.includes('429') || 
                           error.message?.includes('quota') || 
                           error.message?.includes('Resource has been exhausted') ||
                           error.message?.includes('503') ||
                           error.message?.includes('high demand');
        
        if (isRateLimit) {
          console.warn(`[FAILOVER] Model ${modelId} rate limited. Trying next in chain...`);
          continue;
        }
        
        console.error(`[ERROR] Model ${modelId} failed:`, error.message);
        if (modelId === chain[chain.length - 1]) break;
      }
    }

    res.status(500).json({ 
      error: { 
        message: lastError?.message || 'All models in chain failed.',
        type: 'resilience_failure',
        details: lastError?.stack || lastError?.toString()
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
    app.get("*", (req, res) => {
      res.sendFile(path.join(__dirname, "dist", "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
