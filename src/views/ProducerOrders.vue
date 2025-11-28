<template>
  <div class="min-h-screen bg-gray-50 pb-20">
    <!-- Header -->
    <div class="gradient-cerrado text-white py-8 px-4">
      <div class="container mx-auto max-w-4xl">
        <h1 class="text-2xl font-bold mb-2">📥 Pedidos Recebidos</h1>
        <p class="text-white/90">Pedidos que incluem seus produtos</p>
      </div>
    </div>

    <div class="container mx-auto max-w-4xl px-4 py-8">
      <!-- Stats -->
      <div class="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-8">
        <div class="card bg-white text-center">
          <p class="text-3xl font-bold text-cerrado-green mb-1">{{ totalOrders }}</p>
          <p class="text-xs text-gray-500">Total de Pedidos</p>
        </div>
        <div class="card bg-white text-center">
          <p class="text-3xl font-bold text-cerrado-yellow mb-1">{{ pendingOrders }}</p>
          <p class="text-xs text-gray-500">Pendentes</p>
        </div>
        <div class="card bg-white text-center">
          <p class="text-3xl font-bold text-blue-500 mb-1">{{ processingOrders }}</p>
          <p class="text-xs text-gray-500">Em Preparo</p>
        </div>
        <div class="card bg-white text-center">
          <p class="text-3xl font-bold text-gray-400 mb-1">{{ completedOrders }}</p>
          <p class="text-xs text-gray-500">Concluídos</p>
        </div>
      </div>

      <!-- Empty State -->
      <div v-if="receivedOrders.length === 0" class="text-center py-16">
        <svg class="w-24 h-24 mx-auto text-gray-300 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
        </svg>
        <h2 class="text-xl font-semibold text-gray-600 mb-2">Nenhum pedido recebido</h2>
        <p class="text-gray-500">Quando compradores adquirirem seus produtos, eles aparecerão aqui</p>
      </div>

      <!-- Orders List -->
      <div v-else class="space-y-4">
        <div 
          v-for="order in receivedOrders" 
          :key="order.orderNumber"
          class="card hover:shadow-lg transition-shadow animate-fade-in"
        >
          <!-- Order Header -->
          <div class="flex items-start justify-between gap-4 mb-4 pb-4 border-b border-gray-200">
            <div class="flex-1">
              <div class="flex items-center gap-2 mb-2">
                <h3 class="font-bold text-lg text-gray-800">
                  Pedido {{ order.orderNumber }}
                </h3>
                <span 
                  class="px-3 py-1 rounded-full text-xs font-semibold"
                  :class="getStatusClass(order.status)"
                >
                  {{ getStatusLabel(order.status) }}
                </span>
              </div>
              <p class="text-sm text-gray-500">📅 {{ order.date }}</p>
              <p class="text-sm text-gray-600 mt-1">
                <span class="font-medium">Comprador:</span> {{ order.buyerName }}
              </p>
            </div>
            <div class="text-right">
              <p class="text-sm text-gray-500 mb-1">Seus produtos</p>
              <p class="text-2xl font-bold text-cerrado-green">
                R$ {{ formatPrice(order.myProductsTotal) }}
              </p>
            </div>
          </div>

          <!-- My Products in this Order -->
          <div class="space-y-3 mb-4">
            <h4 class="font-semibold text-gray-700 text-sm">Seus produtos neste pedido:</h4>
            <div 
              v-for="item in order.myProducts" 
              :key="item.productId"
              class="flex items-center gap-3 bg-cerrado-sand/20 rounded-lg p-3"
            >
              <div class="w-16 h-16 rounded-lg bg-gray-100 overflow-hidden flex-shrink-0">
                <img 
                  :src="item.image || placeholderImage" 
                  :alt="item.name"
                  class="w-full h-full object-cover"
                />
              </div>
              <div class="flex-1 min-w-0">
                <p class="font-semibold text-gray-800 truncate">{{ item.name }}</p>
                <p class="text-sm text-gray-600">
                  {{ item.quantity }} {{ item.unit }} × R$ {{ formatPrice(item.price) }}
                </p>
              </div>
              <div class="text-right">
                <p class="font-bold text-cerrado-green">
                  R$ {{ formatPrice(item.quantity * item.price) }}
                </p>
              </div>
            </div>
          </div>

          <!-- Actions -->
          <div class="flex gap-2">
            <button 
              @click="updateOrderStatus(order, 'processing')"
              v-if="order.status === 'pending'"
              class="btn-primary flex-1 text-sm py-2"
            >
              ✓ Aceitar Pedido
            </button>
            <button 
              @click="updateOrderStatus(order, 'completed')"
              v-if="order.status === 'processing'"
              class="btn-secondary flex-1 text-sm py-2"
            >
              📦 Marcar como Concluído
            </button>
            <button 
              @click="contactBuyer(order)"
              class="btn-outline flex-1 text-sm py-2 flex items-center justify-center gap-2"
            >
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
              </svg>
              Contatar
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useAuthStore } from '@/composables/useAuth'
import { useToast } from '@/composables/useToast'

const authStore = useAuthStore()
const toast = useToast()

const receivedOrders = ref([])

const placeholderImage = 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="400" height="400"%3E%3Crect fill="%23f3f4f6" width="400" height="400"/%3E%3Ctext fill="%239ca3af" font-family="sans-serif" font-size="20" dy="10.5" font-weight="bold" x="50%25" y="50%25" text-anchor="middle"%3EProduto%3C/text%3E%3C/svg%3E'

const totalOrders = computed(() => receivedOrders.value.length)
const pendingOrders = computed(() => receivedOrders.value.filter(o => o.status === 'pending').length)
const processingOrders = computed(() => receivedOrders.value.filter(o => o.status === 'processing').length)
const completedOrders = computed(() => receivedOrders.value.filter(o => o.status === 'completed').length)

onMounted(() => {
  loadReceivedOrders()
})

const loadReceivedOrders = () => {
  // Get all orders from history
  const allOrders = JSON.parse(localStorage.getItem('orderHistory') || '[]')
  
  // Get my products
  const myProducts = JSON.parse(localStorage.getItem('myProducts') || '[]')
  const myProductIds = myProducts.map(p => p.id)
  
  // Filter orders that contain my products and enrich with product details
  receivedOrders.value = allOrders
    .map(order => {
      // Mock: reconstruct cart items (in real app, would be stored with order)
      // For demo, we'll create mock items based on order data
      const mockItems = generateMockOrderItems(order)
      
      const myProductsInOrder = mockItems.filter(item => 
        myProductIds.includes(item.productId)
      )
      
      if (myProductsInOrder.length === 0) return null
      
      const myProductsTotal = myProductsInOrder.reduce((sum, item) => 
        sum + (item.price * item.quantity), 0
      )
      
      return {
        ...order,
        myProducts: myProductsInOrder,
        myProductsTotal,
        status: order.status || 'pending' // Add status if not exists
      }
    })
    .filter(order => order !== null)
}

const generateMockOrderItems = (order) => {
  // Mock function - in real app, items would be stored with the order
  // For demo, create 1-3 random items
  const myProducts = JSON.parse(localStorage.getItem('myProducts') || '[]')
  if (myProducts.length === 0) return []
  
  const numItems = Math.floor(Math.random() * 3) + 1
  const items = []
  
  for (let i = 0; i < numItems && i < myProducts.length; i++) {
    const product = myProducts[i]
    items.push({
      productId: product.id,
      name: product.name,
      price: product.price,
      quantity: Math.floor(Math.random() * 5) + 1,
      unit: product.unit,
      image: product.image
    })
  }
  
  return items
}

const formatPrice = (price) => {
  return price.toFixed(2).replace('.', ',')
}

const getStatusClass = (status) => {
  const classes = {
    pending: 'bg-cerrado-yellow/20 text-cerrado-earth',
    processing: 'bg-blue-100 text-blue-700',
    completed: 'bg-gray-100 text-gray-600'
  }
  return classes[status] || classes.pending
}

const getStatusLabel = (status) => {
  const labels = {
    pending: '⏳ Pendente',
    processing: '🔄 Em Preparo',
    completed: '✅ Concluído'
  }
  return labels[status] || status
}

const updateOrderStatus = (order, newStatus) => {
  order.status = newStatus
  
  // Update in localStorage
  const allOrders = JSON.parse(localStorage.getItem('orderHistory') || '[]')
  const orderIndex = allOrders.findIndex(o => o.orderNumber === order.orderNumber)
  if (orderIndex > -1) {
    allOrders[orderIndex].status = newStatus
    localStorage.setItem('orderHistory', JSON.stringify(allOrders))
  }
  
  const messages = {
    processing: 'Pedido aceito! O comprador será notificado.',
    completed: 'Pedido marcado como concluído!'
  }
  
  toast.success(messages[newStatus] || 'Status atualizado')
}

const contactBuyer = (order) => {
  const message = `Olá ${order.buyerName}! Sobre o pedido ${order.orderNumber}...`
  
  if (navigator.share) {
    navigator.share({
      title: `Pedido ${order.orderNumber}`,
      text: message
    }).catch(() => {})
  } else {
    navigator.clipboard.writeText(message)
    toast.info('Mensagem copiada para a área de transferência')
  }
}
</script>
