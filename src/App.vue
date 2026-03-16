<script setup lang="ts">
import { ref, onMounted } from 'vue'
import PickleComponent from './components/PickleComponent.vue'

const currentRoute = ref(window.location.pathname)

onMounted(() => {
  window.addEventListener('popstate', () => {
    currentRoute.value = window.location.pathname
  })
})

function navigate(event: MouseEvent, path: string) {
  event.preventDefault()
  window.history.pushState({}, '', path)
  currentRoute.value = path
}

const showAbout = ref(false)
</script>

<template>
  <main>
    <nav class="nav-links">
      <a href="/" @click="navigate($event, '/')" :class="{ active: currentRoute === '/' }">Affirmations</a>
      <a href="/joke" @click="navigate($event, '/joke')" :class="{ active: currentRoute === '/joke' }">Jokes</a>
    </nav>
    <PickleComponent v-if="currentRoute === '/joke'" :key="'joke'" type="joke" />
    <PickleComponent v-else :key="'affirmation'" type="affirmation" />

    <div class="version-indicator" @click="showAbout = true">v1.1</div>

    <div v-if="showAbout" class="modal-overlay" @click="showAbout = false">
      <div class="modal-content" @click.stop>
        <h2>About Pickle Affirmations</h2>
        <p>
          All affirmations and jokes are generated dynamically using AI.
          They are intended to be fun and light-hearted, and shouldn't be taken seriously.
          Provided as-is without liability. Stay crunchy!
        </p>
        <button @click="showAbout = false" class="close-btn">Close</button>
      </div>
    </div>
  </main>
</template>

<style scoped>
.nav-links {
  position: absolute;
  top: 20px;
  right: 20px;
  display: flex;
  gap: 15px;
  z-index: 100;
}

.nav-links a {
  color: rgba(255, 255, 255, 0.6);
  text-decoration: none;
  font-family: 'Outfit', sans-serif;
  font-weight: 600;
  padding: 8px 16px;
  border-radius: 20px;
  background: rgba(255, 255, 255, 0.1);
  transition: all 0.2s ease;
}

.nav-links a.active {
  color: #000;
  background: #4ade80;
}

.nav-links a:hover {
  background: rgba(255, 255, 255, 0.2);
  color: #fff;
}
.nav-links a.active:hover {
  background: #22c55e;
}

.version-indicator {
  position: absolute;
  bottom: 20px;
  right: 20px;
  color: #4ade80;
  background: rgba(74, 222, 128, 0.1);
  border: 1px solid rgba(74, 222, 128, 0.3);
  padding: 6px 12px;
  border-radius: 12px;
  font-family: 'Outfit', sans-serif;
  font-weight: 600;
  font-size: 0.8rem;
  cursor: pointer;
  transition: all 0.2s ease;
  z-index: 100;
}

.version-indicator:hover {
  background: rgba(74, 222, 128, 0.2);
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(74, 222, 128, 0.2);
}

.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  background: rgba(0, 0, 0, 0.6);
  backdrop-filter: blur(4px);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
}

.modal-content {
  background: #1a1a1a;
  border: 1px solid rgba(255, 255, 255, 0.1);
  padding: 2.5rem;
  border-radius: 16px;
  max-width: 400px;
  width: 90%;
  color: #fff;
  font-family: 'Outfit', sans-serif;
  text-align: center;
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.5);
}

.modal-content h2 {
  color: #4ade80;
  margin-top: 0;
  margin-bottom: 1rem;
}

.modal-content p {
  color: rgba(255, 255, 255, 0.8);
  line-height: 1.5;
  margin-bottom: 2rem;
  font-size: 0.95rem;
}

.close-btn {
  background: linear-gradient(135deg, #4ade80 0%, #22c55e 100%);
  color: #000;
  border: none;
  padding: 10px 24px;
  border-radius: 10px;
  font-weight: 600;
  font-size: 0.9rem;
  cursor: pointer;
  transition: all 0.2s ease;
}

.close-btn:hover {
  transform: scale(1.05);
}
</style>
