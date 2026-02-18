<script setup lang="ts">
import { ref } from 'vue';
import { useGemini } from '../composables/useGemini';

const { loading, error, generatePickleAffirmation } = useGemini();
const affirmation = ref("You're doing great, Pickle!");

async function changeAffirmation() {
  try {
    const result = await generatePickleAffirmation();
    if (result) {
      affirmation.value = result;
    }
  } catch (err) {
    // Fallback if AI fails
    affirmation.value = "You're still a big dill, even if I'm shy right now!";
  }
}
</script>

<template>
  <div class="pickle-container">
    <div class="pickle-card">
      <div class="image-wrapper">
        <img src="/pickle.png" alt="Pickle" class="pickle-image" />
      </div>
      <h1 class="affirmation-text">
        <span v-if="loading" class="pulse">Thinking...</span>
        <span v-else>{{ affirmation }}</span>
      </h1>
      <button
        @click="changeAffirmation"
        class="primary-button"
        :disabled="loading"
      >
        {{ loading ? 'Generating...' : 'Ask Pickle for Affirmation' }}
      </button>
    </div>
  </div>
</template>

<style scoped>
.pickle-container {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 100vh;
  min-height: 100dvh;
  width: 100%;
  padding: 2rem;
  background: radial-gradient(circle at top right, #1a1a1a 0%, #000000 100%);
  overflow-x: hidden;
  box-sizing: border-box;
}

.pickle-card {
  background: rgba(255, 255, 255, 0.05);
  backdrop-filter: blur(12px);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 24px;
  padding: 3rem;
  text-align: center;
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.4);
  max-width: 500px;
  width: 100%;
  box-sizing: border-box;
  transition: transform 0.3s ease, box-shadow 0.3s ease;
}

.pickle-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 25px 50px rgba(0, 0, 0, 0.5), 0 0 20px rgba(74, 222, 128, 0.2);
}

.image-wrapper {
  margin-bottom: 2rem;
  position: relative;
}

.pickle-image {
  width: 200px;
  max-width: 100%;
  height: auto;
  border-radius: 16px;
  filter: drop-shadow(0 10px 15px rgba(0, 0, 0, 0.3));
  animation: float 4s ease-in-out infinite;
}

@keyframes float {
  0%, 100% { transform: translateY(0); }
  50% { transform: translateY(-15px); }
}

.affirmation-text {
  font-family: 'Outfit', sans-serif;
  font-size: 20px; /* Base for scale */
  font-size: clamp(1.2rem, 5vw, 2rem);
  font-weight: 700;
  color: #ffffff;
  margin-bottom: 2rem;
  background: linear-gradient(to right, #4ade80, #22c55e);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  min-height: 4rem;
  display: block;
  text-align: center;
  word-wrap: break-word;
  overflow-wrap: break-word;
}

.primary-button {
  background: linear-gradient(135deg, #4ade80 0%, #22c55e 100%);
  color: #000;
  border: none;
  padding: 12px 28px;
  border-radius: 12px;
  font-weight: 600;
  font-size: 1rem;
  cursor: pointer;
  transition: all 0.2s ease;
  box-shadow: 0 4px 12px rgba(74, 222, 128, 0.3);
}

.primary-button:hover {
  transform: scale(1.05);
  box-shadow: 0 6px 20px rgba(74, 222, 128, 0.4);
}

.primary-button:active {
  transform: scale(0.98);
}

.primary-button:disabled {
  opacity: 0.6;
  cursor: not-allowed;
  transform: none;
}

.error-message {
  color: #ef4444;
  font-size: 0.875rem;
  margin-bottom: 1rem;
  background: rgba(239, 68, 68, 0.1);
  padding: 0.5rem;
  border-radius: 8px;
  border: 1px solid rgba(239, 68, 68, 0.2);
}

.pulse {
  animation: pulse 1.5s cubic-bezier(0.4, 0, 0.6, 1) infinite;
}

@keyframes pulse {
  0%, 100% { opacity: 1; }
  50% { opacity: 0.5; }
}

@media (max-width: 440px) {
  .pickle-container {
    padding: 1rem;
  }

  .pickle-card {
    padding: 2rem 1rem;
    border-radius: 16px;
    width: 100%;
    max-width: calc(100vw - 2rem); /* Hard limit */
  }

  .pickle-image {
    width: 140px;
  }

  .affirmation-text {
    font-size: 1.25rem;
    min-height: 3.5rem;
    margin-bottom: 2rem;
  }

  .primary-button {
    padding: 12px 20px;
    font-size: 0.9rem;
    width: 100%;
    max-width: 100%;
  }
}
</style>
