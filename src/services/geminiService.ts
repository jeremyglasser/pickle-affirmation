import { generateClient } from "aws-amplify/data";
import type { Schema } from "../../amplify/data/resource";

/**
 * Service to interact with the Gemini AI mutation via AWS Amplify Data.
 * This implementation uses Amplify secrets on the backend to keep API keys secure.
 */
export class GeminiService {
  private client = generateClient<Schema>();

  /**
   * Generates text by calling the backend Amplify function through GraphQL.
   * @param prompt The prompt to send to the model.
   * @returns The generated text response.
   */
  async generateText(prompt: string): Promise<string> {
    try {
      const { data, errors } = await this.client.mutations.generateAffirmation({
        prompt: prompt,
      });

      if (errors) {
        console.error("Amplify Mutation Errors:", errors);
        throw new Error(errors[0].message || "Failed to generate affirmation through Amplify");
      }

      if (!data) {
        throw new Error("No data returned from Amplify mutation");
      }

      return data;
    } catch (error) {
      console.error("Gemini Service Error:", error);
      throw error;
    }
  }
}

// Export a singleton instance
export const geminiService = new GeminiService();
