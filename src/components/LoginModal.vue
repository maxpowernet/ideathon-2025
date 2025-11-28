<template>
  <transition name="modal">
    <div 
      v-if="modelValue"
      class="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-4 bg-black/50 backdrop-blur-sm"
      @click.self="closeModal"
    >
      <div class="bg-white rounded-t-3xl sm:rounded-3xl w-full max-w-md max-h-[90vh] overflow-y-auto animate-slide-up">
        <!-- Header -->
        <div class="sticky top-0 bg-white border-b border-gray-100 px-6 py-4 rounded-t-3xl">
          <div class="flex items-center justify-between">
            <h2 class="text-xl font-bold text-cerrado-green">Bem-vindo!</h2>
            <button 
              @click="closeModal"
              class="p-2 hover:bg-gray-100 rounded-full transition-colors active:scale-95"
              aria-label="Fechar"
            >
              <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>

        <!-- Content -->
        <div class="p-6 space-y-6">
          <!-- User Type Selection -->
          <div class="space-y-3">
            <label class="text-sm font-medium text-gray-700">Você é:</label>
            <div class="grid grid-cols-2 gap-3">
              <button
                @click="userType = 'buyer'"
                class="p-4 rounded-xl border-2 transition-all active:scale-95"
                :class="userType === 'buyer' 
                  ? 'border-cerrado-green bg-cerrado-green/5' 
                  : 'border-gray-200 hover:border-gray-300'"
              >
                <svg class="w-8 h-8 mx-auto mb-2" :class="userType === 'buyer' ? 'text-cerrado-green' : 'text-gray-400'" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                </svg>
                <p class="font-semibold text-sm">Comprador</p>
              </button>
              
              <button
                @click="userType = 'producer'"
                class="p-4 rounded-xl border-2 transition-all active:scale-95"
                :class="userType === 'producer' 
                  ? 'border-cerrado-yellow bg-cerrado-yellow/5' 
                  : 'border-gray-200 hover:border-gray-300'"
              >
                <svg class="w-8 h-8 mx-auto mb-2" :class="userType === 'producer' ? 'text-cerrado-yellow' : 'text-gray-400'" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                </svg>
                <p class="font-semibold text-sm">Produtor</p>
              </button>
            </div>
          </div>

          <!-- Login Form -->
          <form @submit.prevent="handleLogin" class="space-y-4">
            <div>
              <label for="email" class="block text-sm font-medium text-gray-700 mb-2">
                E-mail
              </label>
              <input
                id="email"
                v-model="email"
                type="email"
                required
                class="input-field"
                placeholder="seu@email.com"
              />
            </div>

            <div>
              <label for="password" class="block text-sm font-medium text-gray-700 mb-2">
                Senha
              </label>
              <input
                id="password"
                v-model="password"
                type="password"
                required
                class="input-field"
                placeholder="••••••••"
              />
            </div>

            <button 
              type="submit"
              class="w-full"
              :class="userType === 'producer' ? 'btn-secondary' : 'btn-primary'"
            >
              Entrar
            </button>
          </form>

          <!-- Info -->
          <div class="text-center">
            <p class="text-sm text-gray-500">
              Primeira vez aqui? 
              <button class="text-cerrado-green font-semibold hover:underline">
                Criar conta
              </button>
            </p>
          </div>

          <!-- Educational Note -->
          <div class="bg-cerrado-sand/30 rounded-xl p-4 border border-cerrado-yellow/20">
            <p class="text-sm text-gray-600">
              <span class="font-semibold text-cerrado-earth">💡 Dica:</span> 
              {{ userType === 'producer' 
                ? 'Produtores podem publicar seus produtos e gerenciar vendas.' 
                : 'Compradores podem explorar produtos e gerar contratos de compra.'
              }}
            </p>
          </div>
        </div>
      </div>
    </div>
  </transition>
</template>

<script setup>
import { ref } from 'vue'
import { useAuthStore } from '@/composables/useAuth'
import { useToast } from '@/composables/useToast'
import { useRouter } from 'vue-router'

const props = defineProps({
  modelValue: Boolean,
})

const emit = defineEmits(['update:modelValue', 'close'])

const authStore = useAuthStore()
const toast = useToast()
const router = useRouter()

const userType = ref('buyer')
const email = ref('')
const password = ref('')

const closeModal = () => {
  emit('close')
  emit('update:modelValue', false)
}

const handleLogin = async () => {
  try {
    await authStore.login(email.value, password.value, userType.value)
    toast.success(`Bem-vindo, ${email.value.split('@')[0]}!`)
    closeModal()
    
    // Redirect to appropriate dashboard
    if (userType.value === 'producer') {
      router.push('/produtor')
    }
  } catch (error) {
    console.error('Login error:', error)
    toast.error('Erro ao fazer login. Tente novamente.')
  }
}
</script>

<style scoped>
.modal-enter-active,
.modal-leave-active {
  transition: opacity 0.3s ease;
}

.modal-enter-from,
.modal-leave-to {
  opacity: 0;
}

.modal-enter-active .animate-slide-up,
.modal-leave-active .animate-slide-up {
  transition: transform 0.3s ease;
}

.modal-enter-from .animate-slide-up {
  transform: translateY(100%);
}

.modal-leave-to .animate-slide-up {
  transform: translateY(100%);
}
</style>
