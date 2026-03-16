import { ref } from "vue";
import { geminiService } from "../services/geminiService";
import { logger } from "../utils/logger";

const CANNED_AFFIRMATIONS = [
  // Positive Pickle (physical cards)
  "Choose to fill your life with those who lift you higher.",
  "Even the smallest person can make a big difference.",
  "The progress is encouraging.",
  "May you have the chance to explore the places you love, making wonderful memories wherever you go.",
  "Relish every moment you share with those you love.",
  "May you always keep a childlike heart, no matter your age, and never lose the ability to find fun in life.",
  "Your thoughts build reality; use optimism as your architect.",
  "The feeling is gratifying.",
  "Every breath you take fills you with vitality and positive energy.",
  "Positivity is the key to unlocking your true potential.",
  "May the music you love always fill your heart with happiness, just like how Madonna's music brings joy to you.",
  "The moment is precious.",
  "Let the wings of positivity carry you higher.",
  "The change is refreshing.",
  "Yeah, and you'll get a big bang out of it, too.",
  "The solution is effective.",
  "You are a shining star in your own right.",
  "Let the sun of positivity cast away the shadows within.",
  "There is never a dull moment in life!",
  "It's a beautiful day to be a helper, and you're already doing it so well.",
  "The struggle today develops strength for tomorrow.",
  "The growth is significant.",
  "The memory is treasured.",
  "The best is yet to come.",
  "Quitters never win and winners never quit.",
  "You listen to yourself body and give it the rest it deserves.",
  "See challenges as opportunities; let positivity guide you.",
  "Your kindness is like a warm hug that everyone can feel.",
  "Sometimes you need a reminder of your own greatness. so here it is: you are incredible!",
  "There's no one in the world that is just like you, and that makes you very special.",
  "You are capable of great things.",
  "Remember that you are strong and resilient and can handle any challenge.",
  "You're as special as a shooting star in the sky.",
  "Most of all, have fun.",
  "You're a kind friend who makes playtime even more fun.",
  "You are doing your best. and that effort deserves recognition and compassion",
  "Release self-doubt and embrace inner strength.",
  "What doesn't kill you make you stronger",
  "Don't wait for opportunity, create it.",
  "I attract vibrant health into every aspect of my life.",
  "You'll probably have fun in life.",
  "May every student (including those you care about) grow steadily in their journey of learning, gaining knowledge and courage along the way.",
  "Live to have fun.",
  "The improvement is noticeable.",
  "I trust that I have the strength to overcome adversity.",
  "Never, never, never, never give up.",
  "have fun. Goodbye.",
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

const allHistoricalJokes = ref<string[]>([]);
const todayJoke = ref<string | null>(null);

const hasCheckedDynamo = ref(false);

const CANNED_JOKES = [
  "Why did the pickle go to the doctor? Because it was feeling a little dill!",
  "What do you call a genius pickle? A brine-iac!",
  "Why are pickles so bad at understanding jokes? Because they're a little sour.",
  "What is a pickle's favorite TV show? Dill or No Dill.",
  "What's a pickle's favorite instrument? The pickle-o!",
  // The Classics (Short & Punchy)
  "I’m afraid for the calendar. Its days are numbered.",
  "My wife said I should do lunges to stay in shape. That would be a big step forward.",
  "Why do skeletons stays so calm? Because nothing gets under their skin.",
  "I used to be a baker, but I couldn't make enough dough.",
  "What do you call a fake noodle? An impasta.",
  "Why don’t scientists trust atoms? Because they make up everything.",
  "I’m reading a book on anti-gravity. It’s impossible to put down.",
  "Did you hear about the guy who invented the Lifesaver? They say he made a mint.",
  "I used to play piano by ear, but now I use my hands.",
  "What’s the best thing about Switzerland? I don’t know, but the flag is a big plus.",
  // Professional & Workplace Humor
  "Why did the scarecrow win an award? Because he was outstanding in his field.",
  "I told my boss that three people were following me. He asked who. I said, \"Twitter, Facebook, and Instagram.\"",
  "Why did the M&M go to school? He wanted to be a Smartie.",
  "My tailor is happy to make me a new suit. Or so he seams.",
  "What do you call a factory that sells passable products? A satisfactory.",
  "How does a penguin build its house? Igloos it together.",
  "I’m on a whiskey diet. I’ve lost three days already.",
  "Why was the belt arrested? For holding up a pair of pants.",
  "I have a joke about chemistry, but I don’t think it’ll get a reaction.",
  "What do you call someone with no body and no nose? Nobody knows.",
  // Animal Antics
  "What do you call a fish wearing a bowtie? Sofishticated.",
  "Why do cows wear bells? Because their horns don’t work.",
  "What do you call a bear with no teeth? A gummy bear.",
  "A dog walked into a flea market and stole the show.",
  "What do you call a sleeping dinosaur? A dino-snore.",
  "Why don’t seagulls fly over the bay? Because then they’d be bagels.",
  "What do you call a pig that knows karate? A pork chop.",
  "How do you make a goldfish age? Take away the 'g.'",
  "Why are frogs so happy? They eat whatever bugs them.",
  "What do you call an alligator in a vest? An investigator.",
  // Food for Thought
  "I’m so good at sleeping that I can do it with my eyes closed.",
  "What do you call cheese that isn't yours? Nacho cheese.",
  "Why did the grape stop in the middle of the road? Because he ran out of juice.",
  "I’m worried about the guy who fell into the upholstery machine. He’s fully recovered now.",
  "Want to hear a joke about a pizza? Never mind, it’s too cheesy.",
  "Why did the tomato turn red? Because it saw the salad dressing.",
  "What do you call a pile of kittens? A meowntain.",
  "Why do coffee beans get in trouble? Because they’re always grounded.",
  "What did the sushi say to the bee? Wasabi!",
  "I wouldn't buy anything with Velcro. It's a total rip-off.",
  // Tech & Science Puns
  "Why was the computer cold? It left its Windows open.",
  "How many tickles does it take to make an octopus laugh? Ten-tickles.",
  "What is a computer's favorite snack? Microchips.",
  "Why did the man put his money in the freezer? He wanted cold hard cash.",
  "A termite walks into a bar and asks, 'Is the bar tender here?'",
  "What do you call a line of men waiting to get haircuts? A barbecue.",
  "Why can’t you hear a pterodactyl go to the bathroom? Because the 'p' is silent.",
  "I have a lot of jokes about unemployed people, but none of them work.",
  "Parallel lines have so much in common. It’s a shame they’ll never meet.",
  "What did the ocean say to the beach? Nothing, it just waved.",
  // The "Groaners" (Commit to the Bit)
  "I’m only friends with 25 letters of the alphabet. I don’t know Y.",
  "How do you find Will Smith in the snow? You look for the Fresh Prints.",
  "Why did the bullet lose its job? It got fired.",
  "I was going to tell a joke about time travel, but you guys didn’t like it.",
  "What did the zero say to the eight? 'Nice belt!'",
  "Why was the math book sad? It had too many problems.",
  "What do you call a can opener that doesn’t work? A can’t opener.",
  "I was wondering why the frisbee kept getting bigger. Then it hit me.",
  "I’ve just written a song about tortillas. Actually, it’s more of a rap.",
  "Did you hear about the guy who dipped his 100-dollar bill in gum? He wanted to have some extra 'chew-la.'",
  // Adventure & The Great Outdoors
  "What kind of tree fits in your hand? A palm tree.",
  "Why are mountains so funny? Because they’re hill-areas.",
  "What do you call a map guide who can't find his way? A lost cause.",
  "How do you organize a space party? You planet.",
  "What do you call a beehive without an exit? Unbelievable.",
  "Why did the golfer bring two pairs of pants? In case he got a hole in one.",
  "I’m not a fan of spring cleaning. I prefer to let things leaf.",
  "Why did the bicycle fall over? Because it was two-tired.",
  "What did one plate say to the other plate? Dinner is on me.",
  "What’s blue and smells like red paint? Blue paint.",
  // Music & Arts
  "What’s a skeleton's favorite instrument? A trom-bone.",
  "Why did the musician get kicked out of the library? He was being too sharp.",
  "I’m practicing for a 'hide and seek' tournament. It’s going well, but good players are hard to find.",
  "Why was the artist so bad at drawing? He couldn't find his perspective.",
  "What do you call a singing laptop? A Dell.",
  "What’s a pirate’s favorite letter? You’d think it’s R, but his first love is the C.",
  "Why did the picture go to jail? It was framed.",
  "What do you call a fake stone in Ireland? A sham-rock.",
  "How do you make a tissue dance? You put a little boogie in it.",
  "Why did the hipster burn his tongue? He drank his coffee before it was cool.",
  // Around the House
  "Why did the broom miss the meeting? It overswept.",
  "What do you call a guy with a rubber toe? Roberto.",
  "I’m on a new diet where I only eat things that start with the letter 'P.' Pizza, Pasta, Pancakes... and Prozac.",
  "Why don't skeletons ever go trick-or-treating? They have no body to go with.",
  "What kind of car does an egg drive? A Yolkswagon.",
  "I used to hate facial hair, but then it grew on me.",
  "What do you call a boomerang that won’t come back? A stick.",
  "Why did the man name his dogs Rolex and Timex? Because they were watch dogs.",
  "How do you tell the difference between an alligator and a crocodile? You will see one later and one in a while.",
  "I told my wife she was drawing her eyebrows too high. She looked surprised.",
  // The Grand Finale
  "What do you call a cold dog? A chili dog.",
  "I thought about starting a business selling clones. But I realized I’d just be making a name for myself.",
  "Why do ducks have feathers? To cover their butt-quacks.",
  "Why did the orange stop? It ran out of zest.",
  "What do you call a funny mountain? Hill-arious.",
  "I’m reading a book about mazes. I got lost in it.",
  "Why are elevator jokes so good? They work on many levels.",
  "What do you call a man who can’t stand? Neil.",
  "What do you call a person who polishes stairs? A step-ladder.",
  "If you see a robbery at an Apple Store, does that make you an iWitness?",
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
   */
  async function generate(prompt: string, type: 'affirmation' | 'joke' = 'affirmation') {
    loading.value = true;
    error.value = null;

    const today = new Date().toISOString().split('T')[0];

    try {
      // 1. Pull ALL data if we haven't yet
      if (!hasCheckedDynamo.value) {
        const cached = await geminiService.listAllData();
        if (cached && cached.length > 0) {
          allHistoricalAffirmations.value = cached.filter(c => c.affirmation).map(c => c.affirmation as string);
          allHistoricalJokes.value = cached.filter(c => c.joke).map(c => c.joke as string);

          const todayMatch = cached.find(c => c.date === today);
          if (todayMatch) {
            if (todayMatch.affirmation) todayAffirmation.value = todayMatch.affirmation;
            if (todayMatch.joke) todayJoke.value = todayMatch.joke;
          }
        }
        hasCheckedDynamo.value = true;
      }

      const todayContentRef = type === 'affirmation' ? todayAffirmation : todayJoke;
      const historyRef = type === 'affirmation' ? allHistoricalAffirmations : allHistoricalJokes;
      const cannedPool = type === 'affirmation' ? CANNED_AFFIRMATIONS : CANNED_JOKES;

      // 2. If no content for today, generate, save, and update pool
      if (!todayContentRef.value) {
        const response = await geminiService.generateText(prompt);
        await geminiService.saveDailyContent(today, type, response);

        todayContentRef.value = response;
        historyRef.value.push(response);

        result.value = response;
        return response;
      }

      // 3. For subsequent clicks...
      if (!result.value) {
        result.value = todayContentRef.value;
        return todayContentRef.value;
      }

      const pool = [...historyRef.value, ...cannedPool.filter(a => typeof a === 'string')];
      const randomContent = pool[Math.floor(Math.random() * pool.length)];
      result.value = randomContent;
      return randomContent;

    } catch (err) {
      const message = err instanceof Error ? err : new Error(String(err));
      logger.error(`Gemini/Dynamo Request Failed for ${type}. Using fallback.`, message);

      const pool = type === 'affirmation' ? CANNED_AFFIRMATIONS : CANNED_JOKES;
      const fallback = pool[Math.floor(Math.random() * pool.length)] as string;
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
    const dateStr = new Date().toISOString().split('T')[0];
    const prompt = `Generate a new, completely unique affirmation for ${dateStr}. Do not repeat previous ones.`;
    return await generate(prompt);
  }

  /**
   * specifically generates a pickle joke, utilizing daily caching.
   */
  async function generateJoke() {
    const dateStr = new Date().toISOString().split('T')[0];
    const prompt = `TYPE:JOKE Generate a new, completely unique joke for ${dateStr}. Do not repeat previous ones.`;
    return await generate(prompt, 'joke');
  }

  return {
    loading,
    error,
    result,
    generate,
    generatePickleAffirmation,
    generateJoke,
  };
}
