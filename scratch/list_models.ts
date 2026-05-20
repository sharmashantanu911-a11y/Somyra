import dotenv from "dotenv";
import { GoogleGenAI } from "@google/genai";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({ path: path.join(__dirname, ".env.local") });

async function listModels() {
  const genAI = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY || '' });
  try {
    const models = await genAI.models.list();
    console.log("Available models:");
    models.forEach((m) => {
      console.log(`- ${m.name}`);
    });
  } catch (error) {
    console.error("Failed to list models:", error);
  }
}

listModels();
