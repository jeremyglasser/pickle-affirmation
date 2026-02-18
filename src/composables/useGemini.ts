import { ref } from "vue";
import { geminiService } from "../services/geminiService";

const CANNED_AFFIRMATIONS = [
  "You are more capable than you know.",
  "Your kindness is a gift to everyone you meet.",
  "Today is full of possibilities. Make them yours.",
  "You're a big dill, and your crunch is legendary.",
  "Like a Prayer, your presence is incredibly uplifting and bright.",
  "You handle every challenge with such grace and poise.",
  "You're the finest pickle in the jar of life.",
  "Stayfocused and keep your eyes on the prize today.",
  "Believe in yourself. You have everything you need right now.",
  "You bring a refreshing zest to the world around you.",
  "In the brine of adversity, you only get better.",
  "Vogue! Your confidence is so uplifting and inspiring to others.",
  "Every crunch you make proves your incredible inner strength.",
  "You are loved, you are valued, and you matter.",
  "You've got that satisfying snap that keeps everyone inspired.",
  "Your sunshine spreads warmth. Thank you for being you today.",
  "The world is better because you are in it.",
  "You are an absolute gem. Keep shining your bright light.",
  "Embrace the vinegar of life; it makes you stronger.",
  "You are destined for great things. Trust the process."
];

/**
 * Vue composable for interacting with the Gemini AI service.
 * Follows Vue 3 Composition API best practices for state management.
 */
export function useGemini() {
  const loading = ref(false);
  const error = ref<Error | null>(null);
  const result = ref<string | null>(null);

  /**
   * Sends a prompt to Gemini and updates the reactive state.
   * If the request fails, returns a random canned affirmation as a fallback.
   * @param prompt The prompt string to send.
   */
  async function generate(prompt: string) {
    loading.value = true;
    error.value = null;

    try {
      const response = await geminiService.generateText(prompt);
      result.value = response;
      return response;
    } catch (err) {
      const message = err instanceof Error ? err : new Error(String(err));
      console.error("Gemini Request Failed. Using fallback affirmation.", message);

      // Set error state so the UI can at least know something happened
      error.value = message;

      // Select a random fallback
      const fallback = CANNED_AFFIRMATIONS[Math.floor(Math.random() * CANNED_AFFIRMATIONS.length)];
      result.value = fallback;
      return fallback;
    } finally {
      loading.value = false;
    }
  }

  /**
   * Specifically generates a pickle-themed affirmation.
   */
  async function generatePickleAffirmation() {
    const prompt = "Generate a new affirmation.";
    return await generate(prompt);
  }

  return {
    loading,
    error,
    result,
    generate,
    generatePickleAffirmation,
  };
}
