<script setup lang="ts">
import { ref } from 'vue';

const affirmation = ref("You're doing great, Pickle!");

const affirmations = [
  "You're kind of a big dill!",
  "Stay cool as a cucumber.",
  "You're simply smashing!",
  "Pickle power!",
  "Everything is going to be just vine.",
  "You're the zest!",
];

function changeAffirmation() {
  const randomIndex = Math.floor(Math.random() * affirmations.length);
  affirmation.value = affirmations[randomIndex];
}
</script>

<template>
  <div class="pickle-container">
    <div class="pickle-card">
      <div class="image-wrapper">
        <img src="/pickle.png" alt="Pickle" class="pickle-image" />
      </div>
      <h1 class="affirmation-text">{{ affirmation }}</h1>
      <button @click="changeAffirmation" class="primary-button">
        Get New Affirmation
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
  width: 100%;
  padding: 2rem;
  background: radial-gradient(circle at top right, #1a1a1a 0%, #000000 100%);
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
  font-size: 2rem;
  font-weight: 700;
  color: #ffffff;
  margin-bottom: 2rem;
  background: linear-gradient(to right, #4ade80, #22c55e);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  min-height: 4rem;
  display: flex;
  align-items: center;
  justify-content: center;
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
</style>
