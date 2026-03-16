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
</script>

<template>
  <main>
    <nav class="nav-links">
      <a href="/" @click="navigate($event, '/')" :class="{ active: currentRoute === '/' }">Affirmations</a>
      <a href="/joke" @click="navigate($event, '/joke')" :class="{ active: currentRoute === '/joke' }">Jokes</a>
    </nav>
    <PickleComponent v-if="currentRoute === '/joke'" type="joke" />
    <PickleComponent v-else type="affirmation" />
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
</style>
