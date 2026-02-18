import { ref } from "vue";
import { geminiService } from "../services/geminiService";
import { logger } from "../utils/logger";

const CANNED_AFFIRMATIONS = [
  // The OG
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
  "You are destined for great things. Trust the process.",
  // The "Pickle Pride" Set
  'You’re never in a crunch you can’t handle.',
  'Your resilience is preserved in greatness.',
  'Don\'t let anyone dull your shine or your brine.',
  'You are the gold standard of gherkins.',
  'Your zest for life is absolutely contagious.',
  'You’re kind of a big deal—no, a big dill.',
  'Crisp, cool, and collected: that’s you.',
  'You have the perfect amount of tang and heart.',
  'You’re the snack that smiles back at the world.',
  'Your inner strength is what gives you that snap.',
  'You are 100% organic goodness.',
  'Even in a tight jar, you find room to grow.',
  'Your personality is the ultimate palate cleanser.',
  'Stay salty, stay sweet, stay uniquely you.',
  'You’re seasoned to perfection.',
  // The "Material Gherkin" (Madonna Inspired) Set
  'Express yourself; don\'t repress yourself.',
  'You’re a Material Girl/Boy in a vinegar world.',
  'Open your heart; it’s the key to everything.',
  'You’ve got the power to make a "Holiday" out of any day.',
  'Like a Virgin (vines), you’re fresh and ready for anything.',
  'Borderline? No, you’re way over the top in the best way.',
  'You’re "Hung Up" on greatness, and it shows.',
  'Cherish the thought of how wonderful you are.',
  'Just like a "Ray of Light," you brighten the jar.',
  'Music makes the people come together, and so do you.',
  'Don\'t go for second best, baby.',
  'You’re "Incredible," "Unstoppable," and "Beautiful."',
  'Life is a mystery, but your value is a certainty.',
  'Strike a pose; there\'s nothing to it.',
  'Your love is a "Lucky Star" for those around you.',
  // The "Zesty & Zen" Set
  'You are enough, just as you are.',
  'Every day is a fresh start from the vine.',
  'Your kindness is the secret ingredient.',
  'You are a masterpiece in progress.',
  'Trust your gut; it’s full of good culture.',
  'You radiate a special kind of "green" energy.',
  'Nothing can sour your beautiful spirit.',
  'You are a gourmet soul in a fast-food world.',
  'Your potential is as deep as the ocean.',
  'You handle the heat with total "chill."',
  'You are the "pick" of the litter.',
  'Your smile is the best garnish.',
  'Keep moving forward; your best days are ahead.',
  'You are a pillar of strength and vinegar.',
  'You make "being cool" look effortless.',
  // The "Snap & Strength" Set
  'You’re the crunch heard \'round the world.',
  'Your courage is more refreshing than ice water.',
  'You are a rare and savory find.',
  'Don\'t be afraid to get a little salty sometimes.',
  'Your wisdom is well-aged and perfect.',
  'You are the highlight of someone’s sandwich.',
  'Believe in the power of your own "snap."',
  'You are a jar-half-full kind of person.',
  'Your integrity is your strongest spice.',
  'You are vibrant, green, and growing.',
  'You have the "spear" of a champion.',
  'You bring the flavor to every party.',
  'You are a natural-born leader.',
  'Your heart is as big as a jumbo deli pickle.',
  'You deserve all the good things coming your way.',
  // The "Final Flourish" Set
  'You’re the "Bread and Butter" of this operation.',
  'Your light is too bright to be bottled up.',
  'You are a sensation in every sense.',
  'Keep your head high and your brine salty.',
  'You’re a classic that never goes out of style.',
  'Your "Papa Don\'t Preach," but your pickle does: You’re great!',
  'You’ve got "Groove," and it’s in your heart.',
  'You’re a "Rebel Heart" with a savory soul.',
  'You are worthy of love and celebration.',
  'Every "Little Star" deserves to shine—including you.',
  'You’re the zest thing that ever happened to us.',
  'Take a bow; you’ve earned the applause.',
  'You’re living in a "Celebration" of your own making.',
  'Your spirit is "Unapologetic" and beautiful.',
  'You are the ultimate survivor.',
  'You’re a sweet-and-spicy masterpiece.',
  'Your confidence is your best accessory.',
  'You are a "Lucky Star" in a dark sky.',
  'Keep it real, keep it crisp, keep it you.',
  'You are, quite simply, the most amazing pickle ever.',
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
      logger.error("Gemini/Dynamo Request Failed. Using fallback affirmation.", message);

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
