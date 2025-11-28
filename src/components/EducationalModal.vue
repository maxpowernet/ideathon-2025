<template>
  <transition name="modal">
    <div 
      v-if="modelValue && product"
      class="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 bg-black/60 backdrop-blur-sm"
      @click.self="closeModal"
    >
      <div class="bg-white rounded-t-3xl sm:rounded-3xl w-full sm:max-w-2xl max-h-[95vh] overflow-y-auto shadow-2xl">
        <!-- Hero Image -->
        <div class="relative h-64 sm:h-80">
          <img 
            :src="product.image" 
            :alt="product.name"
            class="w-full h-full object-cover"
          />
          <div class="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent"></div>
          
          <!-- Close Button -->
          <button 
            @click="closeModal"
            class="absolute top-4 right-4 p-2 bg-white/95 backdrop-blur-sm rounded-full shadow-lg hover:bg-white transition-colors active:scale-95"
            aria-label="Fechar"
          >
            <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>

          <!-- Product Title -->
          <div class="absolute bottom-0 left-0 right-0 p-6 text-white">
            <div class="flex items-start justify-between gap-4">
              <div>
                <h2 class="text-2xl sm:text-3xl font-bold mb-2">{{ product.name }}</h2>
                <p class="text-white/90 flex items-center gap-2">
                  <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                    <path fill-rule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clip-rule="evenodd" />
                  </svg>
                  {{ product.origin }}
                </p>
              </div>
              <div class="text-right">
                <p class="text-3xl font-bold text-cerrado-yellow">R$ {{ formatPrice(product.price) }}</p>
                <p class="text-sm text-white/80">{{ product.unit }}</p>
              </div>
            </div>
          </div>
        </div>

        <!-- Content -->
        <div class="p-6 space-y-6">
          <!-- Tabs -->
          <div class="flex gap-2 border-b border-gray-200 overflow-x-auto scrollbar-hide">
            <button
              v-for="tab in tabs"
              :key="tab.id"
              @click="activeTab = tab.id"
              class="px-4 py-3 font-semibold whitespace-nowrap transition-colors relative"
              :class="activeTab === tab.id 
                ? 'text-cerrado-green' 
                : 'text-gray-500 hover:text-gray-700'"
            >
              {{ tab.icon }} {{ tab.label }}
              <div 
                v-if="activeTab === tab.id"
                class="absolute bottom-0 left-0 right-0 h-0.5 bg-cerrado-green"
              ></div>
            </button>
          </div>

          <!-- Tab Content -->
          <div class="min-h-[200px]">
            <!-- Saberes Tab -->
            <div v-if="activeTab === 'info'" class="space-y-4 animate-fade-in">
              <div>
                <h3 class="font-bold text-lg text-cerrado-green mb-2">💡 Sobre o Produto</h3>
                <p class="text-gray-700 leading-relaxed">{{ product.description }}</p>
              </div>

              <div class="bg-cerrado-sand/30 rounded-xl p-4 border-l-4 border-cerrado-yellow">
                <h4 class="font-semibold text-cerrado-earth mb-2">🌿 Informações Nutricionais</h4>
                <p class="text-gray-700">{{ product.nutritionalInfo }}</p>
              </div>

              <!-- Benefits -->
              <div>
                <h4 class="font-semibold text-gray-800 mb-3">✨ Benefícios</h4>
                <div class="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div 
                    v-for="(benefit, index) in product.benefits"
                    :key="index"
                    class="bg-cerrado-green/5 rounded-xl p-3 text-center border border-cerrado-green/20"
                  >
                    <p class="text-sm font-medium text-cerrado-green">{{ benefit }}</p>
                  </div>
                </div>
              </div>
            </div>

            <!-- Producer Story Tab -->
            <div v-if="activeTab === 'story'" class="space-y-4 animate-fade-in">
              <div class="flex items-start gap-4">
                <div class="w-16 h-16 rounded-full bg-gradient-to-br from-cerrado-earth to-cerrado-earth-light flex items-center justify-center text-white text-2xl font-bold flex-shrink-0">
                  {{ product.producerName.charAt(0) }}
                </div>
                <div>
                  <h3 class="font-bold text-lg text-gray-800">{{ product.producerName }}</h3>
                  <p class="text-sm text-gray-500">Produtor(a) da Sociobiodiversidade</p>
                  <p class="text-sm text-cerrado-green font-medium mt-1">📍 {{ product.origin }}</p>
                </div>
              </div>

              <div class="bg-white rounded-xl p-5 border-2 border-cerrado-sand">
                <p class="text-gray-700 leading-relaxed italic">
                  "{{ product.story }}"
                </p>
              </div>

              <!-- Selo de Origem -->
              <div class="bg-gradient-to-br from-cerrado-green to-cerrado-emerald rounded-xl p-6 text-white text-center">
                <svg class="w-16 h-16 mx-auto mb-3" fill="currentColor" viewBox="0 0 20 20">
                  <path fill-rule="evenodd" d="M6.267 3.455a3.066 3.066 0 001.745-.723 3.066 3.066 0 013.976 0 3.066 3.066 0 001.745.723 3.066 3.066 0 012.812 2.812c.051.643.304 1.254.723 1.745a3.066 3.066 0 010 3.976 3.066 3.066 0 00-.723 1.745 3.066 3.066 0 01-2.812 2.812 3.066 3.066 0 00-1.745.723 3.066 3.066 0 01-3.976 0 3.066 3.066 0 00-1.745-.723 3.066 3.066 0 01-2.812-2.812 3.066 3.066 0 00-.723-1.745 3.066 3.066 0 010-3.976 3.066 3.066 0 00.723-1.745 3.066 3.066 0 012.812-2.812zm7.44 5.252a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd" />
                </svg>
                <h4 class="font-bold text-xl mb-2">Selo de Origem Certificada</h4>
                <p class="text-white/90">Produto autêntico da Bioeconomia do Cerrado Tocantinense</p>
              </div>
            </div>

            <!-- Origin/Map Tab -->
            <div v-if="activeTab === 'origin'" class="space-y-4 animate-fade-in">
              <div class="bg-gray-100 rounded-xl h-64 flex items-center justify-center text-gray-400">
                <div class="text-center">
                  <svg class="w-16 h-16 mx-auto mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" />
                  </svg>
                  <p class="font-medium">Mapa Interativo</p>
                  <p class="text-sm">(Em desenvolvimento)</p>
                </div>
              </div>

              <div class="grid grid-cols-2 gap-4">
                <div class="bg-white rounded-xl p-4 border border-gray-200">
                  <p class="text-sm text-gray-500 mb-1">Região</p>
                  <p class="font-semibold text-gray-800">Sul do Tocantins</p>
                </div>
                <div class="bg-white rounded-xl p-4 border border-gray-200">
                  <p class="text-sm text-gray-500 mb-1">Bioma</p>
                  <p class="font-semibold text-gray-800">Cerrado</p>
                </div>
                <div class="bg-white rounded-xl p-4 border border-gray-200">
                  <p class="text-sm text-gray-500 mb-1">Município</p>
                  <p class="font-semibold text-gray-800">{{ product.origin }}</p>
                </div>
                <div class="bg-white rounded-xl p-4 border border-gray-200">
                  <p class="text-sm text-gray-500 mb-1">Tipo</p>
                  <p class="font-semibold text-gray-800 capitalize">{{ getCategoryName(product.category) }}</p>
                </div>
              </div>
            </div>
          </div>

          <!-- Action Buttons -->
          <div class="flex gap-3 pt-4 border-t border-gray-200">
            <button 
              @click="addToCartAndClose"
              class="btn-primary flex-1 flex items-center justify-center gap-2"
            >
              <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
              Adicionar ao Carrinho
            </button>
            <button 
              @click="shareProduct"
              class="btn-outline flex items-center justify-center gap-2 px-6"
            >
              <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
              </svg>
            </button>
          </div>
        </div>
      </div>
    </div>
  </transition>
</template>

<script setup>
import { ref } from 'vue'
import { useCart } from '@/composables/useCart'
import { useToast } from '@/composables/useToast'

const props = defineProps({
  modelValue: Boolean,
  product: {
    type: Object,
    default: null
  }
})

const emit = defineEmits(['update:modelValue', 'close'])

const cart = useCart()
const toast = useToast()
const activeTab = ref('info')

const tabs = [
  { id: 'info', label: 'Saberes', icon: '🌿' },
  { id: 'story', label: 'História', icon: '📖' },
  { id: 'origin', label: 'Origem', icon: '📍' },
]

const formatPrice = (price) => {
  return price.toFixed(2).replace('.', ',')
}

const getCategoryName = (category) => {
  const categories = {
    fruit: 'Fruta',
    oil: 'Óleo',
    handicraft: 'Artesanato',
    honey: 'Mel',
    flour: 'Farinha'
  }
  return categories[category] || category
}

const closeModal = () => {
  emit('close')
  emit('update:modelValue', false)
  activeTab.value = 'info'
}

const addToCartAndClose = () => {
  if (props.product) {
    cart.addItem(props.product)
    toast.success(`${props.product.name} adicionado ao carrinho!`)
    closeModal()
  }
}

const shareProduct = async () => {
  if (navigator.share && props.product) {
    try {
      await navigator.share({
        title: props.product.name,
        text: `Confira ${props.product.name} na Vitrine do Cerrado!`,
        url: window.location.href,
      })
    } catch (err) {
      console.log('Share cancelled or failed:', err)
    }
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

.modal-enter-active > div,
.modal-leave-active > div {
  transition: transform 0.3s ease;
}

.modal-enter-from > div {
  transform: translateY(100%);
}

@media (min-width: 640px) {
  .modal-enter-from > div {
    transform: scale(0.95);
  }
}

.modal-leave-to > div {
  transform: translateY(100%);
}

@media (min-width: 640px) {
  .modal-leave-to > div {
    transform: scale(0.95);
  }
}

.scrollbar-hide {
  -ms-overflow-style: none;
  scrollbar-width: none;
}

.scrollbar-hide::-webkit-scrollbar {
  display: none;
}
</style>
