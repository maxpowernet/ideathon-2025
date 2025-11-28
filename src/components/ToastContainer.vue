<template>
  <div class="fixed top-20 right-4 z-50 space-y-3 max-w-sm w-full px-4 sm:px-0">
    <transition-group name="toast">
      <div
        v-for="toast in toasts"
        :key="toast.id"
        class="bg-white rounded-xl shadow-2xl border-l-4 overflow-hidden animate-slide-in"
        :class="getBorderColor(toast.type)"
      >
        <div class="p-4 flex items-start gap-3">
          <!-- Icon -->
          <div class="flex-shrink-0">
            <div 
              class="w-10 h-10 rounded-full flex items-center justify-center"
              :class="getIconBgColor(toast.type)"
            >
              <!-- Success Icon -->
              <svg v-if="toast.type === 'success'" class="w-6 h-6" :class="getIconColor(toast.type)" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
              </svg>
              
              <!-- Error Icon -->
              <svg v-else-if="toast.type === 'error'" class="w-6 h-6" :class="getIconColor(toast.type)" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
              
              <!-- Warning Icon -->
              <svg v-else-if="toast.type === 'warning'" class="w-6 h-6" :class="getIconColor(toast.type)" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
              
              <!-- Info Icon -->
              <svg v-else class="w-6 h-6" :class="getIconColor(toast.type)" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
          </div>
          
          <!-- Message -->
          <div class="flex-1 pt-1">
            <p class="text-sm font-medium text-gray-800">
              {{ toast.message }}
            </p>
          </div>
          
          <!-- Close Button -->
          <button
            @click="removeToast(toast.id)"
            class="flex-shrink-0 p-1 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <svg class="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
      </div>
    </transition-group>
  </div>
</template>

<script setup>
import { useToast } from '@/composables/useToast'

const { toasts, removeToast } = useToast()

const getBorderColor = (type) => {
  const colors = {
    success: 'border-cerrado-green',
    error: 'border-red-500',
    warning: 'border-cerrado-yellow',
    info: 'border-blue-500'
  }
  return colors[type] || colors.info
}

const getIconBgColor = (type) => {
  const colors = {
    success: 'bg-cerrado-green/10',
    error: 'bg-red-50',
    warning: 'bg-cerrado-yellow/10',
    info: 'bg-blue-50'
  }
  return colors[type] || colors.info
}

const getIconColor = (type) => {
  const colors = {
    success: 'text-cerrado-green',
    error: 'text-red-500',
    warning: 'text-cerrado-yellow',
    info: 'text-blue-500'
  }
  return colors[type] || colors.info
}
</script>

<style scoped>
.toast-enter-active,
.toast-leave-active {
  transition: all 0.3s ease;
}

.toast-enter-from {
  opacity: 0;
  transform: translateX(100%);
}

.toast-leave-to {
  opacity: 0;
  transform: translateX(100%);
}

.animate-slide-in {
  animation: slideIn 0.3s ease-out;
}

@keyframes slideIn {
  from {
    opacity: 0;
    transform: translateX(100%);
  }
  to {
    opacity: 1;
    transform: translateX(0);
  }
}
</style>
