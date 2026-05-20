import { Handler } from "@netlify/functions";

export const handler: Handler = async (event, context) => {
  // Only allow POST
  if (event.httpMethod !== "POST") {
    return {
      statusCode: 405,
      body: "Method Not Allowed",
    };
  }

  try {
    const body = JSON.parse(event.body || "{}");
    const { messages, temperature, max_tokens, tier = 'Free' } = body;
    
    // Use the primary model for the tier
    const primaryModel = tier === 'Pro' || tier === 'Max' ? 'gemini-3.1-pro' : 'gemini-2.5-flash';

    const response = await fetch("http://localhost:3001/api/chat", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ messages, temperature, max_tokens, tier, model: primaryModel })
    });

      return {
        statusCode: response.status,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      };
    } else {
      const text = await response.text();
      console.error(`Groq API returned non-JSON response (${response.status}):`, text);
      return {
        statusCode: response.status,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ error: "Groq API returned non-JSON response", details: text.substring(0, 500) }),
      };
    }
  } catch (error) {
    console.error("Netlify Function Proxy Error:", error);
    return {
      statusCode: 500,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ error: "Internal Server Error", details: error instanceof Error ? error.message : String(error) }),
    };
  }
};
