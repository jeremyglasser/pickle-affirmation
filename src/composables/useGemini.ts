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

// Shared state across all instances of the composable to avoid redundant DynamoDB checks
const allHistoricalAffirmations = ref<string[]>([]);
const todayAffirmation = ref<string | null>(null);
const hasCheckedDynamo = ref(false);

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
   * Workflow:
   * 1. Pull ALL affirmations from Dynamo.
   * 2. If nothing exists for today, generate and save a new record.
   * 3. For subsequent requests, pick from ALL historical + canned at random.
   */
  async function generate(prompt: string) {
    loading.value = true;
    error.value = null;

    const today = new Date().toISOString().split('T')[0];

    try {
      // 1. Pull ALL affirmations if we haven't yet
      if (!hasCheckedDynamo.value) {
        const cached = await geminiService.listAllAffirmations();
        if (cached && cached.length > 0) {
          allHistoricalAffirmations.value = cached.map(c => c.affirmation);

          // Check if today exists specifically
          const todayMatch = cached.find(c => c.date === today);
          if (todayMatch) {
            todayAffirmation.value = todayMatch.affirmation;
          }
        }
        hasCheckedDynamo.value = true;
      }

      // 2. If no affirmation for today, generate, save, and update pool
      if (!todayAffirmation.value) {
        const response = await geminiService.generateText(prompt);
        await geminiService.saveDailyAffirmation(today, response);

        todayAffirmation.value = response;
        allHistoricalAffirmations.value.push(response);

        result.value = response;
        return response;
      }

      // 3. For subsequent clicks (or if today was already found during initial load):
      // Return today's affirmation if this is the first interaction in this lifecycle,
      // otherwise pick randomly from the growing historical pool + canned.
      if (!result.value) {
        result.value = todayAffirmation.value;
        return todayAffirmation.value;
      }

      const pool = [...allHistoricalAffirmations.value, ...CANNED_AFFIRMATIONS.filter(a => typeof a === 'string')];
      const randomAff = pool[Math.floor(Math.random() * pool.length)];
      result.value = randomAff;
      return randomAff;

    } catch (err) {
      const message = err instanceof Error ? err : new Error(String(err));
      console.error("Gemini/Dynamo Request Failed. Using fallback affirmation.", message);

      // Select a random fallback from canned pool ONLY
      const pool = CANNED_AFFIRMATIONS.filter(a => typeof a === 'string');
      const fallback = pool[Math.floor(Math.random() * pool.length)];
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
