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
