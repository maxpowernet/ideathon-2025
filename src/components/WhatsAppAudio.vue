<template>
  <div class="bg-white rounded-xl shadow-lg p-6 max-w-md mx-auto">
    <!-- Cabeçalho -->
    <div class="flex items-center gap-3 mb-6">
      <div class="w-12 h-12 bg-green-500 rounded-full flex items-center justify-center">
        <svg class="w-7 h-7 text-white" fill="currentColor" viewBox="0 0 24 24">
          <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"/>
        </svg>
      </div>
      <div>
        <h3 class="text-lg font-bold text-gray-800">Cadastro por Áudio</h3>
        <p class="text-sm text-gray-600">WhatsApp + IA</p>
      </div>
    </div>

    <!-- Status -->
    <div v-if="error" class="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg">
      <p class="text-sm text-red-700">{{ error }}</p>
    </div>

    <div v-if="!speechSupported" class="mb-4 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
      <p class="text-sm text-yellow-800">
        ⚠️ Seu navegador não suporta gravação de áudio ao vivo. Use o upload de arquivo.
      </p>
    </div>

    <!-- Método 1: Gravação ao vivo (Web Speech API) -->
    <div v-if="speechSupported" class="mb-6">
      <h4 class="text-sm font-semibold text-gray-700 mb-3">🎤 Opção 1: Gravar agora</h4>
      
      <button
        @click="toggleLiveRecording"
        :disabled="processing"
        class="w-full py-4 rounded-xl font-semibold transition-all duration-300 flex items-center justify-center gap-3"
        :class="isListening 
          ? 'bg-red-500 hover:bg-red-600 text-white shadow-lg scale-105' 
          : 'bg-green-500 hover:bg-green-600 text-white shadow-md hover:shadow-lg'"
      >
        <svg v-if="!isListening" class="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
          <path fill-rule="evenodd" d="M7 4a3 3 0 016 0v4a3 3 0 11-6 0V4zm4 10.93A7.001 7.001 0 0017 8a1 1 0 10-2 0A5 5 0 015 8a1 1 0 00-2 0 7.001 7.001 0 006 6.93V17H6a1 1 0 100 2h8a1 1 0 100-2h-3v-2.07z" clip-rule="evenodd"/>
        </svg>
        <svg v-else class="w-6 h-6 animate-pulse" fill="currentColor" viewBox="0 0 20 20">
          <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8 7a1 1 0 00-1 1v4a1 1 0 001 1h4a1 1 0 001-1V8a1 1 0 00-1-1H8z" clip-rule="evenodd"/>
        </svg>
        {{ isListening ? 'Gravando... Clique para parar' : 'Iniciar Gravação' }}
      </button>

      <!-- Transcrição em tempo real -->
      <div v-if="interimTranscript || liveTranscript" class="mt-3 p-4 bg-gray-50 rounded-lg border border-gray-200">
        <p class="text-xs text-gray-500 mb-1">Transcrevendo...</p>
        <p class="text-sm text-gray-700">{{ interimTranscript || liveTranscript }}</p>
      </div>
    </div>

    <!-- Método 2: Upload de áudio (WhatsApp) -->
    <div class="mb-6">
      <h4 class="text-sm font-semibold text-gray-700 mb-3">📎 Opção 2: Enviar áudio do WhatsApp</h4>
      
      <label class="block w-full py-4 px-4 bg-emerald-50 hover:bg-emerald-100 border-2 border-dashed border-emerald-300 rounded-xl cursor-pointer transition-colors">
        <div class="flex items-center justify-center gap-2 text-emerald-700 font-medium">
          <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"/>
          </svg>
          Upload de Áudio (.ogg, .mp3, .m4a)
        </div>
        <input
          type="file"
          @change="handleAudioUpload"
          accept="audio/*,.ogg,.mp3,.m4a,.opus"
          class="hidden"
          :disabled="processing"
        />
      </label>

      <p class="text-xs text-gray-500 mt-2 text-center">
        💡 Grave um áudio no WhatsApp e faça upload aqui
      </p>
    </div>

    <!-- Player de áudio -->
    <div v-if="audioUrl" class="mb-6 p-4 bg-gray-50 rounded-lg">
      <p class="text-xs text-gray-600 mb-2">Áudio carregado:</p>
      <audio :src="audioUrl" controls class="w-full"></audio>
      
      <button
        @click="transcribeUploadedAudio"
        :disabled="processing || transcribed"
        class="mt-3 w-full py-2 bg-blue-500 hover:bg-blue-600 disabled:bg-gray-300 text-white rounded-lg font-medium transition-colors"
      >
        {{ processing ? 'Transcrevendo...' : transcribed ? '✓ Transcrito' : '🤖 Transcrever com IA' }}
      </button>
    </div>

    <!-- Resultado da transcrição -->
    <div v-if="finalTranscript" class="mb-6">
      <div class="p-4 bg-green-50 border border-green-200 rounded-lg">
        <div class="flex items-start gap-2 mb-2">
          <svg class="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
            <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd"/>
          </svg>
          <div class="flex-1">
            <p class="text-xs font-semibold text-green-800 mb-1">Transcrição (Confiança: {{ Math.round(transcriptConfidence * 100) }}%)</p>
            <p class="text-sm text-gray-800">{{ finalTranscript }}</p>
          </div>
        </div>
        
        <button
          @click="extractAndEmit"
          class="mt-3 w-full py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg font-semibold transition-colors"
        >
          ✨ Extrair Informações do Produto
        </button>
      </div>
    </div>

    <!-- Informações extraídas -->
    <div v-if="extractedInfo" class="p-4 bg-emerald-50 border-2 border-emerald-300 rounded-lg">
      <h4 class="text-sm font-bold text-emerald-800 mb-3 flex items-center gap-2">
        <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
          <path d="M9 2a1 1 0 000 2h2a1 1 0 100-2H9z"/>
          <path fill-rule="evenodd" d="M4 5a2 2 0 012-2 3 3 0 003 3h2a3 3 0 003-3 2 2 0 012 2v11a2 2 0 01-2 2H6a2 2 0 01-2-2V5zm3 4a1 1 0 000 2h.01a1 1 0 100-2H7zm3 0a1 1 0 000 2h3a1 1 0 100-2h-3zm-3 4a1 1 0 100 2h.01a1 1 0 100-2H7zm3 0a1 1 0 100 2h3a1 1 0 100-2h-3z" clip-rule="evenodd"/>
        </svg>
        IA Extraiu:
      </h4>
      
      <div class="space-y-2 text-sm">
        <div><span class="font-semibold">Produto:</span> {{ extractedInfo.name }}</div>
        <div><span class="font-semibold">Categoria:</span> {{ extractedInfo.category }}</div>
        <div v-if="extractedInfo.price"><span class="font-semibold">Preço:</span> R$ {{ extractedInfo.price }}</div>
        <div v-if="extractedInfo.quantity"><span class="font-semibold">Quantidade:</span> {{ extractedInfo.quantity }}</div>
        <div class="pt-2 border-t border-emerald-200">
          <span class="font-semibold">Descrição:</span>
          <p class="text-gray-700 mt-1">{{ extractedInfo.description }}</p>
        </div>
      </div>
    </div>

    <!-- Instruções -->
    <div class="mt-6 p-4 bg-blue-50 rounded-lg border border-blue-200">
      <p class="text-xs font-semibold text-blue-800 mb-2">💡 Dica de uso:</p>
      <ol class="text-xs text-blue-700 space-y-1 list-decimal list-inside">
        <li>Descreva o produto, preço e quantidade</li>
        <li>Exemplo: "Baru torrado, 5 quilos, 20 reais o quilo"</li>
        <li>A IA vai extrair automaticamente os dados</li>
        <li>Confira as informações e prossiga no cadastro</li>
      </ol>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onUnmounted } from 'vue'
import { useSpeech } from '../composables/useSpeech'

const emit = defineEmits(['transcribed', 'productExtracted'])

// Composable de Speech
const speech = useSpeech()

// Estado local
const audioFile = ref(null)
const audioUrl = ref(null)
const processing = ref(false)
const transcribed = ref(false)
const error = ref(null)
const finalTranscript = ref('')
const liveTranscript = ref('')
const transcriptConfidence = ref(0)
const extractedInfo = ref(null)

// Computed
const speechSupported = computed(() => speech.isSupported.value)
const isListening = computed(() => speech.isListening.value)
const interimTranscript = computed(() => speech.interimTranscript.value)

// Gravação ao vivo (Web Speech API)
const toggleLiveRecording = () => {
  if (isListening.value) {
    speech.stopListening()
    // Captura o resultado final
    setTimeout(() => {
      if (speech.transcript.value) {
        finalTranscript.value = speech.transcript.value
        transcriptConfidence.value = speech.confidence.value
        emit('transcribed', speech.transcript.value)
      }
    }, 500)
  } else {
    error.value = null
    speech.reset()
    finalTranscript.value = ''
    extractedInfo.value = null
    const result = speech.startListening()
    if (!result.success) {
      error.value = result.error
    }
  }
}

// Upload de áudio
const handleAudioUpload = async (event) => {
  const file = event.target.files[0]
  if (!file) return

  error.value = null
  transcribed.value = false
  finalTranscript.value = ''
  extractedInfo.value = null

  // Valida tipo
  if (!file.type.startsWith('audio/')) {
    error.value = 'Por favor, selecione um arquivo de áudio válido'
    return
  }

  audioFile.value = file
  audioUrl.value = URL.createObjectURL(file)
}

// Transcreve áudio enviado
const transcribeUploadedAudio = async () => {
  if (!audioFile.value) return

  processing.value = true
  error.value = null

  try {
    const result = await speech.transcribeAudioFile(audioFile.value)

    if (result.success) {
      finalTranscript.value = result.transcript
      transcriptConfidence.value = result.confidence
      transcribed.value = true
      emit('transcribed', result.transcript)
    } else {
      error.value = result.error || 'Erro ao transcrever áudio'
    }
  } catch (err) {
    error.value = 'Erro inesperado ao processar áudio'
    console.error(err)
  } finally {
    processing.value = false
  }
}

// Extrai informações do produto
const extractAndEmit = () => {
  if (!finalTranscript.value) return

  const info = speech.extractProductInfo(finalTranscript.value)
  extractedInfo.value = info

  emit('productExtracted', info)
}

// Cleanup
onUnmounted(() => {
  if (audioUrl.value) {
    URL.revokeObjectURL(audioUrl.value)
  }
  speech.abort()
})
</script>

<style scoped>
audio {
  height: 40px;
}

audio::-webkit-media-controls-panel {
  background-color: #f3f4f6;
}
</style>
