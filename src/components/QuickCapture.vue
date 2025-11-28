<template>
  <transition name="modal">
    <div 
      v-if="modelValue"
      class="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 bg-black/60 backdrop-blur-sm"
      @click.self="closeModal"
    >
      <div class="bg-white rounded-t-3xl sm:rounded-3xl w-full sm:max-w-lg max-h-[95vh] overflow-y-auto shadow-2xl">
        <!-- Header -->
        <div class="sticky top-0 bg-gradient-to-r from-cerrado-yellow to-cerrado-gold text-white px-6 py-4 rounded-t-3xl flex items-center justify-between">
          <div>
            <h2 class="text-xl font-bold">📸 Publicar Produto</h2>
            <p class="text-sm text-white/90">Cadastro rápido e fácil</p>
          </div>
          <button 
            @click="closeModal"
            class="p-2 hover:bg-white/20 rounded-full transition-colors active:scale-95"
            aria-label="Fechar"
          >
            <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <!-- Content -->
        <form @submit.prevent="handlePublish" class="p-6 space-y-6">
          <!-- Step Indicator -->
          <div class="flex items-center justify-between mb-4">
            <div 
              v-for="step in 5" 
              :key="step"
              class="flex-1 h-1.5 rounded-full mx-1 transition-colors"
              :class="currentStep >= step ? 'bg-cerrado-yellow' : 'bg-gray-200'"
            ></div>
          </div>

          <!-- Step 0: Audio WhatsApp (NEW) -->
          <div v-if="currentStep === 0" class="space-y-4 animate-fade-in">
            <div class="text-center mb-4">
              <h3 class="font-bold text-lg text-gray-800 mb-2">🎤 Cadastro por Áudio</h3>
              <p class="text-sm text-gray-600">Descreva seu produto por voz ou pule esta etapa</p>
            </div>

            <WhatsAppAudio 
              @transcribed="handleTranscription"
              @productExtracted="handleProductExtracted"
            />

            <div class="flex gap-3">
              <button 
                type="button"
                @click="skipAudio"
                class="btn-outline flex-1"
              >
                Pular Áudio →
              </button>
              <button 
                v-if="audioExtracted"
                type="button"
                @click="nextStep"
                class="btn-secondary flex-1"
              >
                Usar Dados da IA →
              </button>
            </div>

            <div class="p-3 bg-blue-50 rounded-lg border border-blue-200">
              <p class="text-xs text-blue-700">
                💡 <strong>Novo!</strong> Grave um áudio descrevendo o produto (nome, preço, quantidade) e nossa IA vai extrair automaticamente os dados.
              </p>
            </div>
          </div>

          <!-- Step 1: Photo -->
          <div v-if="currentStep === 1" class="space-y-4 animate-fade-in">
            <div class="text-center">
              <h3 class="font-bold text-lg text-gray-800 mb-2">1. Foto do Produto</h3>
              <p class="text-sm text-gray-600">Tire uma foto ou selecione da galeria</p>
            </div>

            <!-- Photo Preview/Capture -->
            <div class="relative">
              <div 
                v-if="!imagePreview"
                class="aspect-square rounded-2xl border-2 border-dashed border-cerrado-yellow/50 bg-cerrado-sand/20 flex flex-col items-center justify-center cursor-pointer hover:border-cerrado-yellow transition-colors"
                @click="triggerFileInput"
              >
                <svg class="w-16 h-16 text-cerrado-yellow mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
                <p class="text-gray-600 font-medium mb-1">Toque para capturar</p>
                <p class="text-sm text-gray-500">Câmera ou Galeria</p>
              </div>

              <div v-else class="relative aspect-square rounded-2xl overflow-hidden">
                <img :src="imagePreview" alt="Preview" class="w-full h-full object-cover" />
                <button 
                  type="button"
                  @click="clearImage"
                  class="absolute top-3 right-3 p-2 bg-red-500 text-white rounded-full shadow-lg hover:bg-red-600 transition-colors active:scale-95"
                >
                  <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>

              <input 
                ref="fileInput"
                type="file" 
                accept="image/*" 
                capture="environment"
                class="hidden"
                @change="handleFileSelect"
              />
            </div>

            <button 
              type="button"
              @click="nextStep"
              :disabled="!imagePreview"
              class="btn-secondary w-full"
              :class="{ 'opacity-50 cursor-not-allowed': !imagePreview }"
            >
              Continuar →
            </button>
          </div>

          <!-- Step 2: Category -->
          <div v-if="currentStep === 2" class="space-y-4 animate-fade-in">
            <div class="text-center mb-4">
              <h3 class="font-bold text-lg text-gray-800 mb-2">2. Categoria</h3>
              <p class="text-sm text-gray-600">Selecione o tipo de produto</p>
            </div>

            <div class="grid grid-cols-2 gap-3">
              <button
                v-for="category in categories"
                :key="category.id"
                type="button"
                @click="formData.category = category.id"
                class="p-5 rounded-xl border-2 transition-all active:scale-95"
                :class="formData.category === category.id 
                  ? 'border-cerrado-yellow bg-cerrado-yellow/10' 
                  : 'border-gray-200 hover:border-gray-300'"
              >
                <div class="text-4xl mb-2">{{ category.icon }}</div>
                <p class="font-semibold text-sm">{{ category.name }}</p>
              </button>
            </div>

            <div class="flex gap-3">
              <button type="button" @click="prevStep" class="btn-outline flex-1">
                ← Voltar
              </button>
              <button 
                type="button"
                @click="nextStep"
                :disabled="!formData.category"
                class="btn-secondary flex-1"
                :class="{ 'opacity-50 cursor-not-allowed': !formData.category }"
              >
                Continuar →
              </button>
            </div>
          </div>

          <!-- Step 3: Details -->
          <div v-if="currentStep === 3" class="space-y-4 animate-fade-in">
            <div class="text-center mb-4">
              <h3 class="font-bold text-lg text-gray-800 mb-2">3. Detalhes</h3>
              <p class="text-sm text-gray-600">Informações do produto</p>
            </div>

            <div>
              <label for="name" class="block text-sm font-medium text-gray-700 mb-2">
                Nome do Produto *
              </label>
              <input
                id="name"
                v-model="formData.name"
                type="text"
                required
                class="input-field"
                placeholder="Ex: Baru em Amêndoas"
              />
            </div>

            <div>
              <label for="description" class="block text-sm font-medium text-gray-700 mb-2">
                Descrição *
              </label>
              <textarea
                id="description"
                v-model="formData.description"
                rows="3"
                required
                class="input-field resize-none"
                placeholder="Descreva seu produto..."
              ></textarea>
            </div>

            <div class="grid grid-cols-2 gap-3">
              <div>
                <label for="price" class="block text-sm font-medium text-gray-700 mb-2">
                  Preço (R$) *
                </label>
                <input
                  id="price"
                  v-model.number="formData.price"
                  type="number"
                  step="0.01"
                  min="0"
                  required
                  class="input-field"
                  placeholder="0,00"
                />
              </div>
              <div>
                <label for="unit" class="block text-sm font-medium text-gray-700 mb-2">
                  Unidade *
                </label>
                <select
                  id="unit"
                  v-model="formData.unit"
                  required
                  class="input-field"
                >
                  <option value="">Selecione</option>
                  <option value="kg">Kg</option>
                  <option value="g">Gramas</option>
                  <option value="unidade">Unidade</option>
                  <option value="litro">Litro</option>
                  <option value="ml">ML</option>
                </select>
              </div>
            </div>

            <div class="flex gap-3">
              <button type="button" @click="prevStep" class="btn-outline flex-1">
                ← Voltar
              </button>
              <button 
                type="button"
                @click="nextStep"
                :disabled="!isStep3Valid"
                class="btn-secondary flex-1"
                :class="{ 'opacity-50 cursor-not-allowed': !isStep3Valid }"
              >
                Continuar →
              </button>
            </div>
          </div>

          <!-- Step 4: Preview & Publish -->
          <div v-if="currentStep === 4" class="space-y-4 animate-fade-in">
            <div class="text-center mb-4">
              <h3 class="font-bold text-lg text-gray-800 mb-2">5. Confirmar</h3>
              <p class="text-sm text-gray-600">Revise antes de publicar</p>
            </div>

            <!-- Preview Card -->
            <div class="card border-2 border-cerrado-yellow/30">
              <div class="aspect-square rounded-xl overflow-hidden bg-gray-100 mb-3">
                <img :src="imagePreview" :alt="formData.name" class="w-full h-full object-cover" />
              </div>
              
              <h3 class="font-bold text-lg mb-1">{{ formData.name }}</h3>
              <p class="text-sm text-gray-600 mb-3">{{ formData.description }}</p>
              
              <div class="flex items-center justify-between">
                <div>
                  <p class="text-2xl font-bold text-cerrado-green">R$ {{ formatPrice(formData.price) }}</p>
                  <p class="text-xs text-gray-500">{{ formData.unit }}</p>
                </div>
                <span class="chip text-xs">{{ getCategoryName(formData.category) }}</span>
              </div>
            </div>

            <div class="flex gap-3">
              <button type="button" @click="prevStep" class="btn-outline flex-1">
                ← Voltar
              </button>
              <button 
                type="submit"
                :disabled="publishing"
                class="btn-primary flex-1"
              >
                <span v-if="!publishing">🚀 Publicar</span>
                <span v-else class="flex items-center gap-2">
                  <svg class="animate-spin h-5 w-5" fill="none" viewBox="0 0 24 24">
                    <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                    <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Publicando...
                </span>
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  </transition>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useAuthStore } from '@/composables/useAuth'
import { useToast } from '@/composables/useToast'
import WhatsAppAudio from './WhatsAppAudio.vue'

const props = defineProps({
  modelValue: Boolean,
})

const emit = defineEmits(['update:modelValue', 'close', 'published'])

const auth = useAuthStore()
const toast = useToast()

const currentStep = ref(0)
const publishing = ref(false)
const fileInput = ref(null)
const imagePreview = ref(null)
const imageFile = ref(null)

const formData = ref({
  name: '',
  description: '',
  price: 0,
  unit: '',
  category: '',
})

const audioExtracted = ref(false)

const categories = [
  { id: 'fruit', name: 'Frutas', icon: '🍊' },
  { id: 'oil', name: 'Óleos', icon: '🫒' },
  { id: 'handicraft', name: 'Artesanato', icon: '🧺' },
  { id: 'honey', name: 'Mel', icon: '🍯' },
  { id: 'flour', name: 'Farinhas', icon: '🌾' },
  { id: 'other', name: 'Outros', icon: '📦' },
]

const isStep3Valid = computed(() => {
  return formData.value.name && 
         formData.value.description && 
         formData.value.price > 0 && 
         formData.value.unit
})

const triggerFileInput = () => {
  fileInput.value?.click()
}

const handleFileSelect = (event) => {
  const file = event.target.files[0]
  if (file) {
    imageFile.value = file
    const reader = new FileReader()
    reader.onload = (e) => {
      imagePreview.value = e.target.result
    }
    reader.readAsDataURL(file)
  }
}

const clearImage = () => {
  imagePreview.value = null
  imageFile.value = null
  if (fileInput.value) {
    fileInput.value.value = ''
  }
}

const nextStep = () => {
  if (currentStep.value < 4) {
    currentStep.value++
  }
}

const prevStep = () => {
  if (currentStep.value > 0) {
    currentStep.value--
  }
}

const formatPrice = (price) => {
  return price.toFixed(2).replace('.', ',')
}

const getCategoryName = (categoryId) => {
  return categories.find(c => c.id === categoryId)?.name || categoryId
}

const handlePublish = async () => {
  publishing.value = true

  try {
    // Simulate upload/save
    await new Promise(resolve => setTimeout(resolve, 1500))

    const newProduct = {
      id: Date.now().toString(),
      ...formData.value,
      image: imagePreview.value,
      origin: 'Gurupi/TO', // Could be from user profile
      producerName: auth.user?.name || 'Produtor',
      producerId: auth.user?.id,
      createdAt: new Date().toISOString(),
      nutritionalInfo: 'Informações nutricionais a serem adicionadas',
      story: 'História do produtor a ser adicionada',
      benefits: ['Benefício 1', 'Benefício 2', 'Benefício 3'],
    }

    // Enviar para o webhook N8N
    try {
      await fetch('https://n8n.jaderson.cloud/webhook-test/f6ddc488-8680-4351-84dd-d9e73b2d102d', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(newProduct)
      })
      console.log('Dados enviados para o webhook com sucesso')
    } catch (webhookError) {
      console.error('Erro ao enviar para webhook:', webhookError)
      // Não bloqueia a publicação se o webhook falhar
    }

    emit('published', newProduct)
    toast.success('🎉 Produto publicado com sucesso!')
    resetForm()
    closeModal()
  } catch (error) {
    toast.error('Erro ao publicar produto. Tente novamente.')
  } finally {
    publishing.value = false
  }
}

const resetForm = () => {
  currentStep.value = 0
  imagePreview.value = null
  imageFile.value = null
  audioExtracted.value = false
  formData.value = {
    name: '',
    description: '',
    price: 0,
    unit: '',
    category: '',
  }
}

const skipAudio = () => {
  audioExtracted.value = false
  nextStep()
}

const handleTranscription = (transcript) => {
  console.log('Áudio transcrito:', transcript)
}

const handleProductExtracted = (productInfo) => {
  // Preenche o formulário com os dados extraídos da IA
  formData.value.name = productInfo.name
  formData.value.description = productInfo.description
  formData.value.price = parseFloat(productInfo.price) || 0
  formData.value.category = getCategoryIdByName(productInfo.category)
  audioExtracted.value = true
}

const getCategoryIdByName = (categoryName) => {
  const map = {
    'Frutas': 'fruit',
    'Óleos': 'oil',
    'Mel': 'honey',
    'Farinhas': 'flour',
    'Artesanato': 'handicraft',
    'Insumos Agrícolas': 'other'
  }
  return map[categoryName] || 'other'
}

const closeModal = () => {
  resetForm()
  emit('close')
  emit('update:modelValue', false)
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
</style>
