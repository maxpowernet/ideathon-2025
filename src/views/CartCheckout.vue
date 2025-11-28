<template>
  <div class="min-h-screen bg-gray-50 pb-20">
    <!-- Header -->
    <div class="gradient-cerrado text-white py-8 px-4">
      <div class="container mx-auto max-w-4xl">
        <h1 class="text-2xl font-bold mb-2">🛒 Carrinho de Compras</h1>
        <p class="text-white/90">Revise seus itens e finalize o pedido</p>
      </div>
    </div>

    <div class="container mx-auto max-w-4xl px-4 py-8">
      <!-- Empty Cart -->
      <div v-if="cart.items.value.length === 0" class="text-center py-16">
        <svg class="w-24 h-24 mx-auto text-gray-300 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
        </svg>
        <h2 class="text-xl font-semibold text-gray-600 mb-2">Seu carrinho está vazio</h2>
        <p class="text-gray-500 mb-6">Adicione produtos para continuar</p>
        <router-link to="/" class="btn-primary inline-block">
          Explorar Produtos
        </router-link>
      </div>

      <!-- Cart Items -->
      <div v-else class="space-y-6">
        <!-- Items List -->
        <div class="space-y-4">
          <h2 class="text-lg font-bold text-gray-800">Itens do Pedido</h2>
          
          <div 
            v-for="item in cart.items.value" 
            :key="item.product.id"
            class="card flex gap-4 animate-fade-in"
          >
            <!-- Product Image -->
            <div class="w-24 h-24 flex-shrink-0 rounded-xl overflow-hidden bg-gray-100">
              <img 
                :src="item.product.image" 
                :alt="item.product.name"
                class="w-full h-full object-cover"
              />
            </div>

            <!-- Product Info -->
            <div class="flex-1 min-w-0">
              <h3 class="font-semibold text-gray-800 truncate">{{ item.product.name }}</h3>
              <p class="text-sm text-gray-500 mb-2">{{ item.product.producerName }}</p>
              
              <div class="flex items-center gap-3">
                <p class="text-lg font-bold text-cerrado-green">
                  R$ {{ formatPrice(item.product.price) }}
                </p>
                <span class="text-xs text-gray-500">{{ item.product.unit }}</span>
              </div>
            </div>

            <!-- Quantity Controls -->
            <div class="flex flex-col items-end justify-between">
              <button 
                @click="cart.removeItem(item.product.id)"
                class="p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors active:scale-95"
                aria-label="Remover item"
              >
                <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                </svg>
              </button>

              <div class="flex items-center gap-2 bg-gray-100 rounded-lg">
                <button 
                  @click="cart.updateQuantity(item.product.id, item.quantity - 1)"
                  class="p-2 hover:bg-gray-200 rounded-lg transition-colors active:scale-95"
                  :disabled="item.quantity <= 1"
                >
                  <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20 12H4" />
                  </svg>
                </button>
                <span class="w-8 text-center font-semibold">{{ item.quantity }}</span>
                <button 
                  @click="cart.updateQuantity(item.product.id, item.quantity + 1)"
                  class="p-2 hover:bg-gray-200 rounded-lg transition-colors active:scale-95"
                >
                  <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
                  </svg>
                </button>
              </div>
            </div>
          </div>
        </div>

        <!-- Summary -->
        <div class="card bg-cerrado-sand/30 border-2 border-cerrado-yellow/30">
          <div class="flex items-center justify-between mb-4">
            <h3 class="font-bold text-lg text-gray-800">Resumo do Pedido</h3>
            <div class="flex items-center gap-2">
              <label class="text-sm text-gray-600">Modo:</label>
              <select
                v-model="buyerMode"
                @change="setBuyerMode"
                class="text-sm font-semibold px-3 py-1 rounded-lg border border-gray-300 bg-white"
              >
                <option value="consumer">Consumidor</option>
                <option value="reseller">Revendedor</option>
              </select>
            </div>
          </div>
          
          <div class="space-y-3 mb-4">
            <div class="flex justify-between text-gray-600">
              <span>Subtotal ({{ cart.totalItems.value }} {{ cart.totalItems.value === 1 ? 'item' : 'itens' }})</span>
              <span class="font-semibold">R$ {{ formatPrice(cart.subtotal.value) }}</span>
            </div>

            <!-- Volume Discount (Reseller Mode) -->
            <div v-if="buyerMode === 'reseller' && cart.getVolumeDiscount() > 0" class="flex justify-between text-green-600 font-semibold">
              <span>Desconto por Volume ({{ cart.getVolumeDiscount() }}%)</span>
              <span>- R$ {{ formatPrice(cart.discountAmount.value) }}</span>
            </div>

            <div class="flex justify-between text-gray-600">
              <span>Taxa de entrega</span>
              <span class="font-semibold text-cerrado-green">A combinar</span>
            </div>
            <hr class="border-gray-300" />
            <div class="flex justify-between text-xl font-bold text-cerrado-green">
              <span>Total</span>
              <span>R$ {{ formatPrice(cart.totalPrice.value) }}</span>
            </div>
          </div>

          <!-- Reseller Info Box -->
          <div v-if="buyerMode === 'reseller'" class="mb-4 p-3 bg-amber-50 border border-amber-200 rounded-lg">
            <div class="flex gap-2">
              <svg class="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                <path fill-rule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clip-rule="evenodd"/>
              </svg>
              <div>
                <p class="text-sm font-bold text-amber-800">Modo Revendedor Ativo</p>
                <p class="text-xs text-amber-700 mt-1">
                  Você receberá automaticamente <strong>{{ cart.getVolumeDiscount() }}% de desconto</strong> por compras acima de {{ cart.getVolumeDiscount() === 10 ? '10' : cart.getVolumeDiscount() === 20 ? '50' : '100' }} unidades.
                </p>
              </div>
            </div>
          </div>

          <!-- Buyer Info Form -->
          <div class="space-y-4 pt-4 border-t border-gray-300">
            <h4 class="font-semibold text-gray-800">Informações de Contato</h4>
            
            <div>
              <label for="buyerName" class="block text-sm font-medium text-gray-700 mb-2">
                Nome Completo *
              </label>
              <input
                id="buyerName"
                v-model="buyerInfo.name"
                type="text"
                required
                class="input-field"
                placeholder="Seu nome"
              />
            </div>

            <div>
              <label for="buyerPhone" class="block text-sm font-medium text-gray-700 mb-2">
                Telefone/WhatsApp *
              </label>
              <input
                id="buyerPhone"
                v-model="buyerInfo.phone"
                type="tel"
                required
                class="input-field"
                placeholder="(63) 99999-9999"
              />
            </div>

            <div>
              <label for="buyerEmail" class="block text-sm font-medium text-gray-700 mb-2">
                E-mail
              </label>
              <input
                id="buyerEmail"
                v-model="buyerInfo.email"
                type="email"
                class="input-field"
                placeholder="seu@email.com"
              />
            </div>

            <div>
              <label for="notes" class="block text-sm font-medium text-gray-700 mb-2">
                Observações
              </label>
              <textarea
                id="notes"
                v-model="buyerInfo.notes"
                rows="3"
                class="input-field resize-none"
                placeholder="Adicione observações sobre o pedido..."
              ></textarea>
            </div>
          </div>

          <!-- Generate Contract Button -->
          <button 
            @click="handleGenerateContract"
            :disabled="!isFormValid || generating"
            class="btn-primary w-full mt-6 flex items-center justify-center gap-2"
            :class="{ 'opacity-50 cursor-not-allowed': !isFormValid || generating }"
          >
            <svg v-if="!generating" class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
            <svg v-else class="animate-spin h-5 w-5" fill="none" viewBox="0 0 24 24">
              <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
              <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            <span>{{ generating ? 'Gerando Contrato...' : '📄 Finalizar e Gerar Contrato' }}</span>
          </button>

          <!-- Share Buttons -->
          <div v-if="contractGenerated" class="grid grid-cols-2 gap-3 mt-4">
            <button
              @click="shareViaWhatsApp"
              class="py-3 px-4 bg-green-500 hover:bg-green-600 text-white rounded-lg font-semibold flex items-center justify-center gap-2 transition-colors active:scale-95"
            >
              <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"/>
              </svg>
              WhatsApp
            </button>
            <button
              @click="shareViaEmail"
              class="py-3 px-4 bg-blue-500 hover:bg-blue-600 text-white rounded-lg font-semibold flex items-center justify-center gap-2 transition-colors active:scale-95"
            >
              <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
              E-mail
            </button>
          </div>

          <p class="text-xs text-gray-500 text-center mt-3">
            O contrato em DOCX será gerado e você poderá compartilhar com os produtores via WhatsApp ou E-mail
          </p>
        </div>
      </div>
    </div>

    <!-- DOCX Generator Component -->
    <DocxGenerator 
      ref="docxGenerator"
      :cart-items="cart.items.value"
      :buyer-info="buyerInfo"
      :total-price="cart.totalPrice.value"
      @generated="handleContractGenerated"
    />
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useCart } from '@/composables/useCart'
import { useToast } from '@/composables/useToast'
import { useRouter } from 'vue-router'
import DocxGenerator from '@/components/DocxGenerator.vue'

const cart = useCart()
const toast = useToast()
const router = useRouter()
const docxGenerator = ref(null)
const generating = ref(false)
const contractGenerated = ref(false)
const buyerMode = ref('consumer')

const buyerInfo = ref({
  name: '',
  phone: '',
  email: '',
  notes: '',
})

const isFormValid = computed(() => {
  return buyerInfo.value.name.trim() && 
         buyerInfo.value.phone.trim() &&
         cart.items.value.length > 0
})

const formatPrice = (price) => {
  return price.toFixed(2).replace('.', ',')
}

const handleGenerateContract = async () => {
  if (!isFormValid.value) return
  
  generating.value = true
  
  try {
    await docxGenerator.value.generate()
  } catch (error) {
    console.error('Error generating contract:', error)
    alert('Erro ao gerar contrato. Tente novamente.')
  } finally {
    generating.value = false
  }
}

const handleContractGenerated = () => {
  // Clear cart and redirect to orders
  contractGenerated.value = true
  toast.success('✅ Contrato gerado com sucesso! Você pode compartilhar agora.')
  
  setTimeout(() => {
    cart.clearCart()
    router.push('/pedidos')
  }, 3000)
}

const shareViaWhatsApp = () => {
  docxGenerator.value.shareViaWhatsApp()
}

const shareViaEmail = () => {
  docxGenerator.value.shareViaEmail()
}

const setBuyerMode = () => {
  cart.setBuyerType(buyerMode.value)
}
</script>
