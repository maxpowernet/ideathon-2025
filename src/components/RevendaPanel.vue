<template>
  <div class="bg-white rounded-xl shadow-lg overflow-hidden">
    <!-- Cabeçalho -->
    <div class="bg-gradient-to-r from-amber-500 to-yellow-600 p-6 text-white">
      <div class="flex items-center justify-between">
        <div class="flex items-center gap-3">
          <div class="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center backdrop-blur-sm">
            <svg class="w-7 h-7" fill="currentColor" viewBox="0 0 20 20">
              <path d="M3 1a1 1 0 000 2h1.22l.305 1.222a.997.997 0 00.01.042l1.358 5.43-.893.892C3.74 11.846 4.632 14 6.414 14H15a1 1 0 000-2H6.414l1-1H14a1 1 0 00.894-.553l3-6A1 1 0 0017 3H6.28l-.31-1.243A1 1 0 005 1H3zM16 16.5a1.5 1.5 0 11-3 0 1.5 1.5 0 013 0zM6.5 18a1.5 1.5 0 100-3 1.5 1.5 0 000 3z"/>
            </svg>
          </div>
          <div>
            <h2 class="text-xl font-bold">Painel Revendedor</h2>
            <p class="text-sm text-white/80">Compras em Volume + Insumos Agrícolas</p>
          </div>
        </div>
        <button
          @click="$emit('close')"
          class="w-8 h-8 rounded-full bg-white/20 hover:bg-white/30 flex items-center justify-center transition-colors"
        >
          <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/>
          </svg>
        </button>
      </div>
    </div>

    <!-- Abas -->
    <div class="border-b border-gray-200">
      <div class="flex">
        <button
          @click="activeTab = 'produtos'"
          class="flex-1 py-3 px-4 font-semibold transition-colors border-b-2"
          :class="activeTab === 'produtos' 
            ? 'border-amber-500 text-amber-600 bg-amber-50' 
            : 'border-transparent text-gray-600 hover:text-gray-800 hover:bg-gray-50'"
        >
          🌿 Produtos do Cerrado
        </button>
        <button
          @click="activeTab = 'insumos'"
          class="flex-1 py-3 px-4 font-semibold transition-colors border-b-2"
          :class="activeTab === 'insumos' 
            ? 'border-amber-500 text-amber-600 bg-amber-50' 
            : 'border-transparent text-gray-600 hover:text-gray-800 hover:bg-gray-50'"
        >
          🚜 Insumos Agrícolas
        </button>
      </div>
    </div>

    <!-- Conteúdo Produtos do Cerrado -->
    <div v-if="activeTab === 'produtos'" class="p-6">
      <div class="mb-4 p-4 bg-amber-50 border border-amber-200 rounded-lg">
        <div class="flex items-start gap-3">
          <svg class="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
            <path fill-rule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clip-rule="evenodd"/>
          </svg>
          <div>
            <h3 class="font-bold text-amber-800 mb-1">Descontos por Volume</h3>
            <p class="text-sm text-amber-700">
              Compras acima de 10 unidades: <strong>10% OFF</strong><br>
              Compras acima de 50 unidades: <strong>20% OFF</strong><br>
              Compras acima de 100 unidades: <strong>30% OFF</strong>
            </p>
          </div>
        </div>
      </div>

      <!-- Estatísticas -->
      <div class="grid grid-cols-2 gap-4 mb-6">
        <div class="bg-green-50 rounded-lg p-4 border border-green-200">
          <p class="text-xs text-green-600 font-semibold mb-1">Total Economizado</p>
          <p class="text-2xl font-bold text-green-700">R$ {{ totalSavings.toFixed(2) }}</p>
        </div>
        <div class="bg-blue-50 rounded-lg p-4 border border-blue-200">
          <p class="text-xs text-blue-600 font-semibold mb-1">Desconto Ativo</p>
          <p class="text-2xl font-bold text-blue-700">{{ currentDiscount }}%</p>
        </div>
      </div>

      <!-- Lista de produtos com quantidade para revenda -->
      <div class="space-y-3">
        <h3 class="font-bold text-gray-800 mb-2">Adicionar ao Pedido em Volume:</h3>
        
        <div
          v-for="product in cerradoProducts"
          :key="product.id"
          class="p-4 border border-gray-200 rounded-lg hover:border-amber-400 transition-colors"
        >
          <div class="flex items-start gap-3">
            <img
              :src="product.image"
              :alt="product.name"
              class="w-16 h-16 object-cover rounded-lg flex-shrink-0"
            />
            <div class="flex-1 min-w-0">
              <h4 class="font-semibold text-gray-800 truncate">{{ product.name }}</h4>
              <p class="text-sm text-gray-600">{{ product.producer }}</p>
              <p class="text-sm font-bold text-green-600 mt-1">R$ {{ product.price }}</p>
            </div>
            <div class="flex items-center gap-2">
              <button
                @click="decreaseQuantity(product.id)"
                class="w-8 h-8 rounded-full bg-gray-200 hover:bg-gray-300 flex items-center justify-center font-bold"
              >
                -
              </button>
              <input
                type="number"
                v-model.number="quantities[product.id]"
                min="0"
                class="w-16 text-center border border-gray-300 rounded py-1 font-semibold"
              />
              <button
                @click="increaseQuantity(product.id)"
                class="w-8 h-8 rounded-full bg-amber-500 hover:bg-amber-600 text-white flex items-center justify-center font-bold"
              >
                +
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Conteúdo Insumos Agrícolas -->
    <div v-if="activeTab === 'insumos'" class="p-6">
      <div class="mb-4 p-4 bg-green-50 border border-green-200 rounded-lg">
        <div class="flex items-start gap-3">
          <svg class="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
            <path fill-rule="evenodd" d="M6.267 3.455a3.066 3.066 0 001.745-.723 3.066 3.066 0 013.976 0 3.066 3.066 0 001.745.723 3.066 3.066 0 012.812 2.812c.051.643.304 1.254.723 1.745a3.066 3.066 0 010 3.976 3.066 3.066 0 00-.723 1.745 3.066 3.066 0 01-2.812 2.812 3.066 3.066 0 00-1.745.723 3.066 3.066 0 01-3.976 0 3.066 3.066 0 00-1.745-.723 3.066 3.066 0 01-2.812-2.812 3.066 3.066 0 00-.723-1.745 3.066 3.066 0 010-3.976 3.066 3.066 0 00.723-1.745 3.066 3.066 0 012.812-2.812zm7.44 5.252a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd"/>
          </svg>
          <div>
            <h3 class="font-bold text-green-800 mb-1">Economia Circular</h3>
            <p class="text-sm text-green-700">
              Produtores podem comprar insumos orgânicos certificados para melhorar sua produção sustentável.
            </p>
          </div>
        </div>
      </div>

      <!-- Categorias de Insumos -->
      <div class="mb-4 flex flex-wrap gap-2">
        <button
          v-for="cat in insumoCategories"
          :key="cat"
          @click="selectedInsumoCategory = cat"
          class="px-4 py-2 rounded-full font-semibold transition-colors"
          :class="selectedInsumoCategory === cat
            ? 'bg-green-500 text-white'
            : 'bg-gray-100 text-gray-700 hover:bg-gray-200'"
        >
          {{ cat }}
        </button>
      </div>

      <!-- Lista de insumos -->
      <div class="space-y-3">
        <div
          v-for="insumo in filteredInsumos"
          :key="insumo.id"
          class="p-4 border border-gray-200 rounded-lg hover:border-green-400 transition-colors"
        >
          <div class="flex items-start gap-3">
            <div class="w-16 h-16 bg-green-100 rounded-lg flex items-center justify-center flex-shrink-0">
              <span class="text-3xl">{{ insumo.icon }}</span>
            </div>
            <div class="flex-1 min-w-0">
              <h4 class="font-semibold text-gray-800">{{ insumo.name }}</h4>
              <p class="text-xs text-gray-600 mb-1">{{ insumo.description }}</p>
              <div class="flex items-center gap-2">
                <span class="text-sm font-bold text-green-600">R$ {{ insumo.price }}</span>
                <span class="text-xs text-gray-500">/ {{ insumo.unit }}</span>
                <span v-if="insumo.organic" class="text-xs bg-green-100 text-green-700 px-2 py-0.5 rounded-full font-semibold">
                  🌱 Orgânico
                </span>
              </div>
            </div>
            <div class="flex items-center gap-2">
              <button
                @click="decreaseInsumoQuantity(insumo.id)"
                class="w-8 h-8 rounded-full bg-gray-200 hover:bg-gray-300 flex items-center justify-center font-bold"
              >
                -
              </button>
              <input
                type="number"
                v-model.number="insumoQuantities[insumo.id]"
                min="0"
                class="w-16 text-center border border-gray-300 rounded py-1 font-semibold"
              />
              <button
                @click="increaseInsumoQuantity(insumo.id)"
                class="w-8 h-8 rounded-full bg-green-500 hover:bg-green-600 text-white flex items-center justify-center font-bold"
              >
                +
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Rodapé com totais -->
    <div class="border-t border-gray-200 p-6 bg-gray-50">
      <div class="flex items-center justify-between mb-3">
        <span class="text-sm text-gray-600">Subtotal:</span>
        <span class="font-semibold text-gray-800">R$ {{ subtotal.toFixed(2) }}</span>
      </div>
      <div v-if="currentDiscount > 0" class="flex items-center justify-between mb-3 text-green-600">
        <span class="text-sm font-semibold">Desconto ({{ currentDiscount }}%):</span>
        <span class="font-bold">- R$ {{ totalSavings.toFixed(2) }}</span>
      </div>
      <div class="flex items-center justify-between mb-4 pt-3 border-t border-gray-300">
        <span class="text-lg font-bold text-gray-800">Total:</span>
        <span class="text-2xl font-bold text-amber-600">R$ {{ total.toFixed(2) }}</span>
      </div>
      <button
        @click="addAllToCart"
        :disabled="totalItems === 0"
        class="w-full py-3 bg-amber-500 hover:bg-amber-600 disabled:bg-gray-300 text-white font-bold rounded-xl transition-colors flex items-center justify-center gap-2"
      >
        <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
          <path d="M3 1a1 1 0 000 2h1.22l.305 1.222a.997.997 0 00.01.042l1.358 5.43-.893.892C3.74 11.846 4.632 14 6.414 14H15a1 1 0 000-2H6.414l1-1H14a1 1 0 00.894-.553l3-6A1 1 0 0017 3H6.28l-.31-1.243A1 1 0 005 1H3zM16 16.5a1.5 1.5 0 11-3 0 1.5 1.5 0 013 0zM6.5 18a1.5 1.5 0 100-3 1.5 1.5 0 000 3z"/>
        </svg>
        Adicionar {{ totalItems }} itens ao Carrinho
      </button>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useCart } from '../composables/useCart'
import { useToast } from '../composables/useToast'

const emit = defineEmits(['close'])

const cart = useCart()
const toast = useToast()

// Estado
const activeTab = ref('produtos')
const selectedInsumoCategory = ref('Todos')
const quantities = ref({})
const insumoQuantities = ref({})

// Produtos do Cerrado (mock)
const cerradoProducts = ref([
  { id: 1, name: 'Baru Torrado', price: 18, image: 'https://images.unsplash.com/photo-1608797178974-15b35a64ede9?w=200', producer: 'Fazenda Santa Cruz' },
  { id: 2, name: 'Óleo de Pequi', price: 25, image: 'https://images.unsplash.com/photo-1474979266404-7eaacbcd87c5?w=200', producer: 'Cooperativa Cerrado Vivo' },
  { id: 3, name: 'Mel de Jataí', price: 35, image: 'https://images.unsplash.com/photo-1587049352846-4a222e784acc?w=200', producer: 'Apiário Sol Nascente' },
  { id: 4, name: 'Buriti Desidratado', price: 12, image: 'https://images.unsplash.com/photo-1598632640487-6ea4a4e8b963?w=200', producer: 'Associação Buriti de Ouro' }
])

// Categorias de insumos
const insumoCategories = ref(['Todos', 'Sementes', 'Adubos Orgânicos', 'Ferramentas', 'Embalagens'])

// Insumos agrícolas (mock)
const insumos = ref([
  { id: 101, name: 'Sementes de Baru Certificadas', price: 45, unit: 'kg', icon: '🌱', category: 'Sementes', description: 'Sementes selecionadas de baru', organic: true },
  { id: 102, name: 'Adubo Orgânico Bokashi', price: 28, unit: 'saca 20kg', icon: '🌿', category: 'Adubos Orgânicos', description: 'Fertilizante orgânico fermentado', organic: true },
  { id: 103, name: 'Composto Orgânico', price: 15, unit: 'saca 25kg', icon: '♻️', category: 'Adubos Orgânicos', description: 'Compostagem certificada', organic: true },
  { id: 104, name: 'Sementes de Pequi', price: 60, unit: 'kg', icon: '🌱', category: 'Sementes', description: 'Mudas de pequi nativo', organic: true },
  { id: 105, name: 'Enxada Profissional', price: 38, unit: 'unidade', icon: '🔨', category: 'Ferramentas', description: 'Aço carbono tratado', organic: false },
  { id: 106, name: 'Sacos de Juta Biodegradáveis', price: 22, unit: 'pacote 50un', icon: '📦', category: 'Embalagens', description: 'Embalagem sustentável', organic: true }
])

// Computeds
const filteredInsumos = computed(() => {
  if (selectedInsumoCategory.value === 'Todos') return insumos.value
  return insumos.value.filter(i => i.category === selectedInsumoCategory.value)
})

const totalItems = computed(() => {
  const prodQty = Object.values(quantities.value).reduce((sum, q) => sum + (q || 0), 0)
  const insumoQty = Object.values(insumoQuantities.value).reduce((sum, q) => sum + (q || 0), 0)
  return prodQty + insumoQty
})

const subtotal = computed(() => {
  let sum = 0
  
  // Produtos do Cerrado
  cerradoProducts.value.forEach(p => {
    const qty = quantities.value[p.id] || 0
    sum += p.price * qty
  })
  
  // Insumos
  insumos.value.forEach(i => {
    const qty = insumoQuantities.value[i.id] || 0
    sum += i.price * qty
  })
  
  return sum
})

const currentDiscount = computed(() => {
  if (totalItems.value >= 100) return 30
  if (totalItems.value >= 50) return 20
  if (totalItems.value >= 10) return 10
  return 0
})

const totalSavings = computed(() => {
  return subtotal.value * (currentDiscount.value / 100)
})

const total = computed(() => {
  return subtotal.value - totalSavings.value
})

// Métodos
const increaseQuantity = (id) => {
  quantities.value[id] = (quantities.value[id] || 0) + 1
}

const decreaseQuantity = (id) => {
  if (quantities.value[id] > 0) {
    quantities.value[id]--
  }
}

const increaseInsumoQuantity = (id) => {
  insumoQuantities.value[id] = (insumoQuantities.value[id] || 0) + 1
}

const decreaseInsumoQuantity = (id) => {
  if (insumoQuantities.value[id] > 0) {
    insumoQuantities.value[id]--
  }
}

const addAllToCart = () => {
  let itemsAdded = 0
  
  // Adiciona produtos do Cerrado
  cerradoProducts.value.forEach(product => {
    const qty = quantities.value[product.id] || 0
    if (qty > 0) {
      // Adiciona cada unidade individualmente ao carrinho
      for (let i = 0; i < qty; i++) {
        cart.addItem(product)
      }
      itemsAdded += qty
    }
  })
  
  // Adiciona insumos
  insumos.value.forEach(insumo => {
    const qty = insumoQuantities.value[insumo.id] || 0
    if (qty > 0) {
      const insumoProduct = {
        ...insumo,
        category: 'Insumos Agrícolas',
        description: insumo.description,
        origin: 'Fornecedor Certificado',
        image: `https://via.placeholder.com/200?text=${insumo.icon}`
      }
      
      for (let i = 0; i < qty; i++) {
        cart.addItem(insumoProduct)
      }
      itemsAdded += qty
    }
  })
  
  if (itemsAdded > 0) {
    const discount = currentDiscount.value
    toast.success(
      `${itemsAdded} itens adicionados ao carrinho!${discount > 0 ? ` Desconto de ${discount}% aplicado! 🎉` : ''}`
    )
    
    // Limpa quantidades
    quantities.value = {}
    insumoQuantities.value = {}
    
    emit('close')
  }
}
</script>
