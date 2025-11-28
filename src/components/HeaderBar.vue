<template>
  <header class="sticky top-0 z-40 bg-white/95 backdrop-blur-sm shadow-soft">
    <div class="container mx-auto px-4 py-3">
      <div class="flex items-center justify-between">
        <!-- Logo -->
        <router-link to="/" class="flex items-center gap-3 active:scale-95 transition-transform">
          <div class="w-12 h-12 rounded-full gradient-cerrado flex items-center justify-center">
            <svg class="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" 
                d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
            </svg>
          </div>
          <div class="hidden sm:block">
            <h1 class="text-lg font-bold text-gradient-cerrado leading-tight">
              Vitrine do Cerrado
            </h1>
            <p class="text-xs text-gray-500">Bioeconomia em Ação</p>
          </div>
        </router-link>

        <!-- Actions -->
        <div class="flex items-center gap-2">
          <!-- Reseller Panel Button -->
          <button 
            v-if="authStore.isAuthenticated && authStore.userRole === 'buyer'"
            @click="showRevendaPanel = true"
            class="p-3 hover:bg-amber-50 rounded-xl transition-colors active:scale-95 text-amber-600"
            title="Painel de Revendedor"
          >
            <svg class="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
              <path d="M3 1a1 1 0 000 2h1.22l.305 1.222a.997.997 0 00.01.042l1.358 5.43-.893.892C3.74 11.846 4.632 14 6.414 14H15a1 1 0 000-2H6.414l1-1H14a1 1 0 00.894-.553l3-6A1 1 0 0017 3H6.28l-.31-1.243A1 1 0 005 1H3zM16 16.5a1.5 1.5 0 11-3 0 1.5 1.5 0 013 0zM6.5 18a1.5 1.5 0 100-3 1.5 1.5 0 000 3z"/>
            </svg>
          </button>

          <!-- Cart Button -->
          <router-link 
            to="/carrinho" 
            class="relative p-3 hover:bg-gray-100 rounded-xl transition-colors active:scale-95"
            aria-label="Carrinho de compras"
          >
            <svg class="w-6 h-6 text-cerrado-green" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" 
                d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
            </svg>
            <span 
              v-if="cart.totalItems.value > 0"
              class="absolute -top-1 -right-1 bg-cerrado-yellow text-cerrado-earth text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center"
            >
              {{ cart.totalItems.value }}
            </span>
          </router-link>

          <!-- Login/Profile Button -->
          <button 
            v-if="!authStore.isAuthenticated"
            @click="authStore.showLoginPrompt = true"
            class="btn-outline py-2 px-4 text-sm"
          >
            Entrar
          </button>
          
          <div v-else class="relative">
            <button 
              @click="showProfileMenu = !showProfileMenu"
              class="flex items-center gap-3 p-2 hover:bg-gray-100 rounded-xl transition-colors active:scale-95"
            >
              <div class="w-9 h-9 rounded-full bg-cerrado-green flex items-center justify-center text-white">
                <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                  <path fill-rule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clip-rule="evenodd" />
                </svg>
              </div>
              <div class="hidden sm:block text-left">
                <p class="text-xs text-gray-500">Logado como</p>
                <p class="text-sm font-medium text-gray-700">{{ authStore.userRole === 'producer' ? '🌱 Produtor' : '🤖 ADMakers' }}</p>
              </div>
              <svg class="w-4 h-4 text-gray-400 hidden sm:block" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
              </svg>
            </button>

            <!-- Profile Dropdown -->
            <transition name="fade">
              <div 
                v-if="showProfileMenu"
                class="absolute right-0 mt-2 w-56 bg-white rounded-xl shadow-lg py-2 border border-gray-100"
              >
                <router-link 
                  v-if="authStore.userRole === 'producer'"
                  to="/produtor"
                  class="block px-4 py-3 hover:bg-gray-50 transition-colors"
                  @click="showProfileMenu = false"
                >
                  <p class="font-semibold text-cerrado-green">Painel do Produtor</p>
                  <p class="text-xs text-gray-600">Gerenciar produtos</p>
                </router-link>
                
                <router-link 
                  v-if="authStore.userRole === 'producer'"
                  to="/produtor/pedidos"
                  class="block px-4 py-3 hover:bg-gray-50 transition-colors"
                  @click="showProfileMenu = false"
                >
                  <p class="font-medium">Pedidos Recebidos</p>
                </router-link>

                <router-link 
                  v-if="authStore.userRole === 'buyer'"
                  to="/pedidos"
                  class="block px-4 py-3 hover:bg-gray-50 transition-colors"
                  @click="showProfileMenu = false"
                >
                  <p class="font-medium">Meus Pedidos</p>
                </router-link>
                
                <hr class="my-2" />
                <button 
                  @click="handleLogout"
                  class="w-full text-left px-4 py-3 hover:bg-red-50 text-red-600 transition-colors"
                >
                  Sair
                </button>
              </div>
            </transition>
          </div>
        </div>
      </div>
    </div>
  </header>

  <!-- Revenda Panel Modal -->
  <RevendaPanel 
    v-if="showRevendaPanel"
    @close="showRevendaPanel = false"
  />
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useAuthStore } from '@/composables/useAuth'
import { useCart } from '@/composables/useCart'
import RevendaPanel from './RevendaPanel.vue'

const authStore = useAuthStore()
const cart = useCart()
const showProfileMenu = ref(false)
const showRevendaPanel = ref(false)

onMounted(() => {
  cart.loadCart()
  cart.loadBuyerType()
})

const handleLogout = () => {
  authStore.logout()
  showProfileMenu.value = false
}
</script>

<style scoped>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.2s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>
