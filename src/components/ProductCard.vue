<template>
  <div class="card group cursor-pointer overflow-hidden" @click="$emit('click', product)">
    <!-- Image -->
    <div class="relative aspect-square rounded-xl overflow-hidden bg-gray-100 mb-3">
      <img 
        :src="product.image || placeholderImage" 
        :alt="product.name"
        class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
      />
      
      <!-- Origin Badge -->
      <div class="absolute top-2 right-2 bg-white/95 backdrop-blur-sm px-3 py-1 rounded-full shadow-sm">
        <p class="text-xs font-semibold text-cerrado-green flex items-center gap-1">
          <svg class="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
            <path fill-rule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clip-rule="evenodd" />
          </svg>
          {{ product.origin }}
        </p>
      </div>

      <!-- Category Tag -->
      <div class="absolute bottom-2 left-2">
        <span class="chip text-xs">
          {{ product.category }}
        </span>
      </div>
    </div>

    <!-- Content -->
    <div class="space-y-2">
      <h3 class="font-bold text-lg text-gray-800 line-clamp-2">
        {{ product.name }}
      </h3>
      
      <p class="text-sm text-gray-600 line-clamp-2">
        {{ product.description }}
      </p>

      <!-- Producer Info -->
      <div class="flex items-center gap-2 text-xs text-gray-500">
        <div class="w-6 h-6 rounded-full bg-cerrado-earth/10 flex items-center justify-center">
          <svg class="w-4 h-4 text-cerrado-earth" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
          </svg>
        </div>
        <span class="truncate">{{ product.producerName }}</span>
      </div>

      <!-- Price and Action -->
      <div class="flex items-center justify-between pt-2">
        <div>
          <p class="text-2xl font-bold text-cerrado-green">
            R$ {{ formatPrice(product.price) }}
          </p>
          <p class="text-xs text-gray-500">{{ product.unit }}</p>
        </div>

        <button 
          @click.stop="addToCart"
          class="p-3 bg-cerrado-green text-white rounded-xl hover:bg-cerrado-emerald transition-colors active:scale-95 shadow-card"
          aria-label="Adicionar ao carrinho"
        >
          <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
          </svg>
        </button>
      </div>
    </div>

    <!-- Educational Indicator -->
    <div class="mt-3 flex items-center gap-1 text-cerrado-yellow text-xs font-medium">
      <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
        <path d="M9 4.804A7.968 7.968 0 005.5 4c-1.255 0-2.443.29-3.5.804v10A7.969 7.969 0 015.5 14c1.669 0 3.218.51 4.5 1.385A7.962 7.962 0 0114.5 14c1.255 0 2.443.29 3.5.804v-10A7.968 7.968 0 0014.5 4c-1.255 0-2.443.29-3.5.804V12a1 1 0 11-2 0V4.804z" />
      </svg>
      <span>Toque para conhecer os saberes</span>
    </div>
  </div>
</template>

<script setup>
import { useCart } from '@/composables/useCart'
import { useToast } from '@/composables/useToast'

const props = defineProps({
  product: {
    type: Object,
    required: true,
  }
})

defineEmits(['click'])

const cart = useCart()
const toast = useToast()

const placeholderImage = 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="400" height="400"%3E%3Crect fill="%23f3f4f6" width="400" height="400"/%3E%3Ctext fill="%239ca3af" font-family="sans-serif" font-size="20" dy="10.5" font-weight="bold" x="50%25" y="50%25" text-anchor="middle"%3EProduto%3C/text%3E%3C/svg%3E'

const formatPrice = (price) => {
  return price.toFixed(2).replace('.', ',')
}

const addToCart = () => {
  cart.addItem(props.product)
  toast.success(`${props.product.name} adicionado ao carrinho!`)
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
