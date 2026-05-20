import { GoogleGenAI } from "@google/genai";
import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({ path: path.join(__dirname, "..", ".env.local") });

async function listModels() {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) return;

  const genAI = new GoogleGenAI({ apiKey });
  try {
    const models = await genAI.models.list();
    console.log("AVAILABLE MODELS:");
    console.log(JSON.stringify(models, null, 2));
  } catch (err) {
    console.error("FAILED TO LIST MODELS:", err.message);
  }
}

listModels();
