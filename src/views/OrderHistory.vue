<template>
  <div class="min-h-screen bg-gray-50 pb-20">
    <!-- Header -->
    <div class="gradient-cerrado text-white py-8 px-4">
      <div class="container mx-auto max-w-4xl">
        <h1 class="text-2xl font-bold mb-2">📦 Meus Pedidos</h1>
        <p class="text-white/90">Histórico de contratos gerados</p>
      </div>
    </div>

    <div class="container mx-auto max-w-4xl px-4 py-8">
      <!-- Empty State -->
      <div v-if="orders.length === 0" class="text-center py-16">
        <svg class="w-24 h-24 mx-auto text-gray-300 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
        </svg>
        <h2 class="text-xl font-semibold text-gray-600 mb-2">Nenhum pedido realizado</h2>
        <p class="text-gray-500 mb-6">Seus contratos aparecerão aqui</p>
        <router-link to="/" class="btn-primary inline-block">
          Explorar Produtos
        </router-link>
      </div>

      <!-- Orders List -->
      <div v-else class="space-y-4">
        <div 
          v-for="order in orders" 
          :key="order.orderNumber"
          class="card hover:shadow-lg transition-shadow animate-fade-in"
        >
          <div class="flex items-start justify-between gap-4 mb-4">
            <div>
              <h3 class="font-bold text-lg text-gray-800 mb-1">
                Pedido {{ order.orderNumber }}
              </h3>
              <p class="text-sm text-gray-500">{{ order.date }}</p>
            </div>
            <div class="text-right">
              <p class="text-2xl font-bold text-cerrado-green">
                R$ {{ formatPrice(order.totalPrice) }}
              </p>
              <p class="text-xs text-gray-500">{{ order.itemsCount }} {{ order.itemsCount === 1 ? 'item' : 'itens' }}</p>
            </div>
          </div>

          <!-- Producers -->
          <div class="mb-4">
            <p class="text-sm font-medium text-gray-700 mb-2">Produtores:</p>
            <div class="flex flex-wrap gap-2">
              <span 
                v-for="(producer, index) in order.producers" 
                :key="index"
                class="chip text-xs"
              >
                {{ producer }}
              </span>
            </div>
          </div>

          <!-- Buyer -->
          <div class="border-t border-gray-200 pt-4">
            <p class="text-sm text-gray-600">
              <span class="font-medium">Comprador:</span> {{ order.buyerName }}
            </p>
          </div>

          <!-- Action -->
          <div class="mt-4 flex gap-2">
            <button 
              @click="viewDetails(order)"
              class="btn-outline flex-1 text-sm py-2"
            >
              Ver Detalhes
            </button>
            <button 
              @click="shareOrder(order)"
              class="btn-secondary flex-1 text-sm py-2 flex items-center justify-center gap-2"
            >
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
              </svg>
              Compartilhar
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'

const orders = ref([])

onMounted(() => {
  loadOrders()
})

const loadOrders = () => {
  const history = localStorage.getItem('orderHistory')
  if (history) {
    orders.value = JSON.parse(history)
  }
}

const formatPrice = (price) => {
  return price.toFixed(2).replace('.', ',')
}

const viewDetails = (order) => {
  alert(`Detalhes do pedido ${order.orderNumber}\n\nEm uma versão completa, aqui seria exibido um modal com todos os detalhes do pedido.`)
}

const shareOrder = async (order) => {
  const message = `📄 Pedido ${order.orderNumber}
📅 Data: ${order.date}
👤 Comprador: ${order.buyerName}
💰 Total: R$ ${formatPrice(order.totalPrice)}
🌿 Produtores: ${order.producers.join(', ')}

Vitrine da Bioeconomia do Cerrado`

  if (navigator.share) {
    try {
      await navigator.share({
        title: `Pedido ${order.orderNumber}`,
        text: message,
      })
    } catch (err) {
      console.log('Share cancelled:', err)
    }
  } else {
    // Fallback - copy to clipboard
    navigator.clipboard.writeText(message)
    alert('Informações copiadas para a área de transferência!')
  }
}
</script>
