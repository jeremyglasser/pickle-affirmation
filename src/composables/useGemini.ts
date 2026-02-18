import { ref } from "vue";
import { geminiService } from "../services/geminiService";

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
      error.value = message;
      throw message;
    } finally {
      loading.value = false;
    }
  }

  /**
   * Specifically generates a pickle-themed affirmation.
   */
  async function generatePickleAffirmation() {
    const prompt = "Give me a short, witty, and encouraging pickle-themed affirmation. Under 15 words.";
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
