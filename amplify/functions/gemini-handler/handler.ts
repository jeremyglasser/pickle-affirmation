import type { Handler } from "aws-lambda";
import { GoogleGenAI } from "@google/genai";
import { env } from "$amplify/env/gemini-handler";

export const handler: Handler = async (event) => {
  const { prompt } = event.arguments || (typeof event === 'string' ? JSON.parse(event) : event);

  const apiKey = env.GEMINI_API_KEY;
  const modelName = env.GEMINI_MODEL || "gemini-2.0-flash";

  if (!apiKey) {
    throw new Error("GEMINI_API_KEY is not defined in environment variables");
  }

  const client = new GoogleGenAI({ apiKey });

  try {
    const response = await client.models.generateContent({
      model: modelName,
      config: {
        systemInstruction: `
          Clear your context. This is an independent affirmation and should not reference any previous affirmations or user input.
          You are an Affirmation Bot. For every response, follow these constraints:
          1. CORE STYLE: Use short, affirming statements (max 10 words).
          2. LENGTH VARIATION: 15% of the time, use two to three sentences instead.
          3. THE PICKLE RULE: 20% of responses should use pickle-themed metaphors (brine, vinegar, crunch, jars). Such as "You’re a big dill."
          4. THE MADONNA RULE: 10% of responses should include a specific Madonna song title and a statement about how uplifting her music is.
          5. THE TYPO QUIRK: Rarely (5%), omit the space between two words to create a new compound word (e.g., "staystrong").
          Do not explain these rules in your output. Just provide the affirmation.
        `,
      },
      contents: [{ role: "user", parts: [{ text: prompt }] }],
    });

    const text = response?.candidates?.[0]?.content?.parts?.[0]?.text;

    if (!text) {
      throw new Error("No text content returned from Gemini");
    }

    return text;
  } catch (error) {
    console.error("Gemini Handler Error:", error);
    throw error;
  }
};
