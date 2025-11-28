<template>
  <div id="app" class="min-h-screen flex flex-col">
    <!-- Header -->
    <HeaderBar />
    
    <!-- Main Content -->
    <main class="flex-1 pb-20">
      <router-view v-slot="{ Component }">
        <transition name="fade" mode="out-in">
          <component :is="Component" />
        </transition>
      </router-view>
    </main>

    <!-- Toast Notifications -->
    <ToastContainer />

    <!-- Login Modal -->
    <Teleport to="body">
      <transition name="fade">
        <LoginModal v-if="authStore.showLoginPrompt" @close="authStore.showLoginPrompt = false" />
      </transition>
    </Teleport>
  </div>
</template>

<script setup>
import { onMounted } from 'vue'
import HeaderBar from '@/components/HeaderBar.vue'
import LoginModal from '@/components/LoginModal.vue'
import ToastContainer from '@/components/ToastContainer.vue'
import { useAuthStore } from '@/composables/useAuth'

const authStore = useAuthStore()

onMounted(() => {
  // Check for existing session
  authStore.checkAuth()
})
</script>

<style scoped>
/* Page transition animations */
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>
