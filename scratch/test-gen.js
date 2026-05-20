import { GoogleGenAI } from "@google/genai";
import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({ path: path.join(__dirname, "..", ".env.local") });

async function test() {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    console.error("Missing GEMINI_API_KEY");
    return;
  }

  const genAI = new GoogleGenAI({ apiKey });
  
  try {
    console.log("Testing models/gemini-2.5-flash...");
    const response = await genAI.models.generateContent({
      model: "models/gemini-2.5-flash",
      systemInstruction: "You are a helpful assistant.",
      contents: [{ role: 'user', parts: [{ text: 'Say hello' }] }],
      config: {
        temperature: 0.8,
        maxOutputTokens: 1000,
        safetySettings: [
          { category: 'HARM_CATEGORY_HATE_SPEECH', threshold: 'BLOCK_NONE' },
          { category: 'HARM_CATEGORY_HARASSMENT', threshold: 'BLOCK_NONE' },
          { category: 'HARM_CATEGORY_SEXUALLY_EXPLICIT', threshold: 'BLOCK_NONE' },
          { category: 'HARM_CATEGORY_DANGEROUS_CONTENT', threshold: 'BLOCK_NONE' }
        ]
      }
    });
    console.log("SUCCESS:", response.text);
  } catch (err) {
    console.error("FAILED gemini-2.5-flash:", err.message);
  }
}

test();
