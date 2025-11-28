<template>
  <div class="min-h-screen bg-gray-50 pb-20">
    <!-- Header -->
    <div class="gradient-cerrado text-white py-8 px-4">
      <div class="container mx-auto max-w-4xl">
        <h1 class="text-2xl font-bold mb-2">🌱 Painel do Produtor</h1>
        <p class="text-white/90">Gerencie seus produtos</p>
      </div>
    </div>

    <div class="container mx-auto max-w-4xl px-4 py-8">
      <!-- Stats Cards -->
      <div class="grid grid-cols-2 gap-4 mb-8">
        <div class="card bg-white">
          <div class="flex items-center gap-3">
            <div class="w-12 h-12 rounded-full bg-cerrado-green/10 flex items-center justify-center">
              <svg class="w-6 h-6 text-cerrado-green" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
              </svg>
            </div>
            <div>
              <p class="text-2xl font-bold text-gray-800">{{ myProducts.length }}</p>
              <p class="text-sm text-gray-500">Produtos</p>
            </div>
          </div>
        </div>

        <router-link to="/produtor/pedidos" class="card bg-white hover:shadow-lg transition-shadow">
          <div class="flex items-center gap-3">
            <div class="w-12 h-12 rounded-full bg-cerrado-yellow/10 flex items-center justify-center">
              <svg class="w-6 h-6 text-cerrado-yellow" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
              </svg>
            </div>
            <div>
              <p class="text-2xl font-bold text-gray-800">{{ activeProducts }}</p>
              <p class="text-sm text-gray-500">Pedidos →</p>
            </div>
          </div>
        </router-link>
      </div>

      <!-- Quick Actions -->
      <div class="mb-8">
        <h2 class="text-lg font-bold text-gray-800 mb-4">Ações Rápidas</h2>
        <button 
          @click="showQuickCapture = true"
          class="btn-secondary w-full flex items-center justify-center gap-2"
        >
          <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
          </svg>
          Publicar Novo Produto
        </button>
      </div>

      <!-- Products List -->
      <div class="space-y-4">
        <div class="flex items-center justify-between mb-4">
          <h2 class="text-lg font-bold text-gray-800">Meus Produtos</h2>
          <button class="text-sm text-cerrado-green font-semibold hover:underline">
            Ver Todos
          </button>
        </div>

        <!-- Empty State -->
        <div v-if="myProducts.length === 0" class="text-center py-16 card">
          <svg class="w-20 h-20 mx-auto text-gray-300 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
          </svg>
          <h3 class="text-xl font-semibold text-gray-600 mb-2">Nenhum produto cadastrado</h3>
          <p class="text-gray-500 mb-6">Comece publicando seu primeiro produto</p>
          <button @click="showQuickCapture = true" class="btn-primary">
            📸 Publicar Produto
          </button>
        </div>

        <!-- Products Grid -->
        <div v-else class="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div 
            v-for="product in myProducts" 
            :key="product.id"
            class="card animate-fade-in"
          >
            <div class="aspect-video rounded-xl overflow-hidden bg-gray-100 mb-3">
              <img 
                :src="product.image" 
                :alt="product.name"
                class="w-full h-full object-cover"
              />
            </div>
            
            <h3 class="font-bold text-gray-800 mb-1">{{ product.name }}</h3>
            <p class="text-sm text-gray-600 mb-3 line-clamp-2">{{ product.description }}</p>
            
            <div class="flex items-center justify-between">
              <div>
                <p class="text-lg font-bold text-cerrado-green">R$ {{ formatPrice(product.price) }}</p>
                <p class="text-xs text-gray-500">{{ product.unit }}</p>
              </div>
              <button class="p-2 hover:bg-gray-100 rounded-lg transition-colors">
                <svg class="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z" />
                </svg>
              </button>
            </div>
          </div>
        </div>
      </div>

      <!-- Educational Box -->
      <div class="mt-8 bg-gradient-to-br from-cerrado-green to-cerrado-emerald rounded-2xl p-6 text-white">
        <h3 class="text-xl font-bold mb-3">💡 Dica do Produtor</h3>
        <p class="text-white/90 leading-relaxed">
          Fotos de qualidade e descrições detalhadas aumentam suas vendas. Destaque a origem e os benefícios dos seus produtos do Cerrado!
        </p>
      </div>
    </div>

    <!-- Quick Capture Modal -->
    <QuickCapture 
      v-model="showQuickCapture"
      @close="showQuickCapture = false"
      @published="handleProductPublished"
    />
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useAuthStore } from '@/composables/useAuth'
import QuickCapture from '@/components/QuickCapture.vue'

const authStore = useAuthStore()
const showQuickCapture = ref(false)
const myProducts = ref([])

const activeProducts = computed(() => {
  return myProducts.value.length
})

onMounted(() => {
  loadMyProducts()
})

const loadMyProducts = () => {
  // In a real app, this would filter by producerId from Firestore
  // For now, we'll load from localStorage
  const savedProducts = localStorage.getItem('myProducts')
  if (savedProducts) {
    myProducts.value = JSON.parse(savedProducts)
  }
}

const handleProductPublished = (newProduct) => {
  myProducts.value.unshift(newProduct)
  localStorage.setItem('myProducts', JSON.stringify(myProducts.value))
  showQuickCapture.value = false
}

const formatPrice = (price) => {
  return price.toFixed(2).replace('.', ',')
}
</script>

<style scoped>
.line-clamp-2 {
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}
</style>
