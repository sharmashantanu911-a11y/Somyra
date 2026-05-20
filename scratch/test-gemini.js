import { GoogleGenAI } from "@google/genai";
import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({ path: path.join(__dirname, ".env.local") });

async function test() {
  const apiKey = process.env.GEMINI_API_KEY;
  console.log("Using API Key:", apiKey ? "FOUND" : "MISSING");
  if (!apiKey) return;

  const genAI = new GoogleGenAI({ apiKey });
  const modelId = "gemini-1.5-flash";

  try {
    console.log(`Testing model: ${modelId}...`);
    const response = await genAI.models.generateContent({
      model: modelId,
      contents: [{ role: 'user', parts: [{ text: 'Say hello' }] }],
    });
    console.log("SUCCESS:", response.text);
  } catch (err: any) {
    console.error("FAILED:", err.message);
    if (err.stack) console.error(err.stack);
  }
}

test();
