import { generateClient } from "aws-amplify/data";
import type { Schema } from "../../amplify/data/resource";
import { logger } from "../utils/logger";

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
        logger.error("Amplify Mutation Errors:", errors);
        throw new Error(errors[0].message || "Failed to generate affirmation through Amplify");
      }

      if (!data) {
        throw new Error("No data returned from Amplify mutation");
      }

      return data;
    } catch (error) {
      logger.error("Gemini Service Error:", error);
      throw error;
    }
  }

  /**
   * Fetches all historical data from the database.
   */
  async listAllData(): Promise<{ date: string; affirmation?: string | null; joke?: string | null }[]> {
    try {
      const { data } = await this.client.models.DailyAffirmation.list();
      return data || [];
    } catch (error) {
      logger.error("Error listing all data:", error);
      return [];
    }
  }

  /**
   * Saves a single affirmation or joke for a specific date.
   */
  async saveDailyContent(date: string, property: 'affirmation' | 'joke', text: string): Promise<void> {
    try {
      const { data: existing } = await this.client.models.DailyAffirmation.get({ date });
      
      if (existing) {
        await this.client.models.DailyAffirmation.update({
          date,
          affirmation: property === 'affirmation' ? text : existing.affirmation,
          joke: property === 'joke' ? text : existing.joke,
        });
      } else {
        await this.client.models.DailyAffirmation.create({
          date,
          [property]: text,
        });
      }
    } catch (error) {
      logger.error(`Error saving daily ${property}:`, error);
    }
  }
}

// Export a singleton instance
export const geminiService = new GeminiService();
