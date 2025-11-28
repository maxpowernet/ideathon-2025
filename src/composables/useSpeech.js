import { ref, computed } from 'vue'

// Speech-to-Text usando Web Speech API (navegadores Chromium)
// Para produção com Google Cloud Speech-to-Text, substituir pela API REST

const speechState = ref({
  isListening: false,
  isSupported: typeof window !== 'undefined' && ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window),
  transcript: '',
  interimTranscript: '',
  confidence: 0,
  language: 'pt-BR',
  error: null
})

let recognition = null

export function useSpeech() {
  const isListening = computed(() => speechState.value.isListening)
  const isSupported = computed(() => speechState.value.isSupported)
  const transcript = computed(() => speechState.value.transcript)
  const interimTranscript = computed(() => speechState.value.interimTranscript)
  const confidence = computed(() => speechState.value.confidence)
  const error = computed(() => speechState.value.error)
  
  // Inicializa reconhecimento de voz
  const initRecognition = () => {
    if (!speechState.value.isSupported) {
      console.warn('[Speech] Web Speech API não suportada neste navegador')
      return null
    }
    
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition
    recognition = new SpeechRecognition()
    
    recognition.lang = speechState.value.language
    recognition.continuous = false // Para em silêncio
    recognition.interimResults = true // Resultados parciais
    recognition.maxAlternatives = 1
    
    recognition.onstart = () => {
      speechState.value.isListening = true
      speechState.value.error = null
      console.log('[Speech] Iniciou escuta')
    }
    
    recognition.onresult = (event) => {
      let interim = ''
      let final = ''
      
      for (let i = event.resultIndex; i < event.results.length; i++) {
        const result = event.results[i]
        if (result.isFinal) {
          final += result[0].transcript
          speechState.value.confidence = result[0].confidence
        } else {
          interim += result[0].transcript
        }
      }
      
      if (final) {
        speechState.value.transcript = final.trim()
      }
      speechState.value.interimTranscript = interim.trim()
      
      console.log('[Speech] Transcrito:', { final, interim })
    }
    
    recognition.onerror = (event) => {
      speechState.value.error = event.error
      speechState.value.isListening = false
      console.error('[Speech] Erro:', event.error)
    }
    
    recognition.onend = () => {
      speechState.value.isListening = false
      console.log('[Speech] Finalizou escuta')
    }
    
    return recognition
  }
  
  // Inicia captura de voz
  const startListening = () => {
    if (!recognition) {
      initRecognition()
    }
    
    if (!recognition) {
      return { success: false, error: 'API não suportada' }
    }
    
    try {
      speechState.value.transcript = ''
      speechState.value.interimTranscript = ''
      speechState.value.error = null
      recognition.start()
      return { success: true }
    } catch (error) {
      console.error('[Speech] Erro ao iniciar:', error)
      return { success: false, error: error.message }
    }
  }
  
  // Para captura de voz
  const stopListening = () => {
    if (recognition && speechState.value.isListening) {
      recognition.stop()
    }
  }
  
  // Cancela captura
  const abort = () => {
    if (recognition) {
      recognition.abort()
      speechState.value.isListening = false
    }
  }
  
  // Transcreve áudio de arquivo (mock - em produção usar Google Cloud)
  const transcribeAudioFile = async (audioBlob) => {
    try {
      console.log('[Speech Mock] Transcrevendo arquivo de áudio...', audioBlob)
      
      // Em produção, usar Google Cloud Speech-to-Text:
      // 1. Converter audioBlob para base64 ou upload
      // 2. Chamar API: https://cloud.google.com/speech-to-text/docs/reference/rest/v1/speech/recognize
      // 3. Processar resultado
      
      // Mock: simula transcrição de exemplos comuns do Cerrado
      const mockTranscriptions = [
        'Baru torrado, cinco quilos, vinte reais o quilo, colhido ontem na fazenda',
        'Óleo de pequi artesanal, dez frascos de duzentos ml, quinze reais cada',
        'Mel de abelha nativa, potes de um quilo, trinta reais, produção orgânica',
        'Buriti desidratado, três quilos, doze reais o quilo, sem agrotóxico',
        'Farinha de jatobá, cinco pacotes de quinhentos gramas, dezoito reais cada'
      ]
      
      await new Promise(resolve => setTimeout(resolve, 2000)) // Simula processamento
      
      const randomTranscript = mockTranscriptions[Math.floor(Math.random() * mockTranscriptions.length)]
      
      return {
        success: true,
        transcript: randomTranscript,
        confidence: 0.92,
        language: 'pt-BR'
      }
    } catch (error) {
      console.error('[Speech] Erro ao transcrever arquivo:', error)
      return {
        success: false,
        error: error.message
      }
    }
  }
  
  // Extrai informações estruturadas do texto transcrito (IA simulada)
  const extractProductInfo = (transcriptText) => {
    const text = transcriptText.toLowerCase()
    
    // Regex patterns para extração
    const productInfo = {
      name: '',
      category: '',
      price: '',
      quantity: '',
      description: transcriptText
    }
    
    // Detecta categoria por palavra-chave
    const categories = {
      'Frutas': ['baru', 'pequi', 'buriti', 'jatobá', 'cagaita', 'mangaba'],
      'Óleos': ['óleo', 'azeite'],
      'Mel': ['mel', 'abelha'],
      'Farinhas': ['farinha'],
      'Artesanato': ['artesanato', 'cesta', 'bolsa', 'capim dourado'],
      'Insumos Agrícolas': ['adubo', 'fertilizante', 'semente', 'muda']
    }
    
    for (const [category, keywords] of Object.entries(categories)) {
      if (keywords.some(keyword => text.includes(keyword))) {
        productInfo.category = category
        // Extrai nome do produto (primeira palavra-chave encontrada)
        const foundKeyword = keywords.find(k => text.includes(k))
        productInfo.name = foundKeyword.charAt(0).toUpperCase() + foundKeyword.slice(1)
        break
      }
    }
    
    // Extrai preço (padrões: "X reais", "R$ X", "X por quilo")
    const pricePatterns = [
      /(\d+)\s*reais/i,
      /r\$\s*(\d+)/i,
      /(\d+)\s*por\s+quilo/i,
      /(\d+)\s*o\s+quilo/i,
      /(\d+)\s*cada/i
    ]
    
    for (const pattern of pricePatterns) {
      const match = text.match(pattern)
      if (match) {
        productInfo.price = match[1]
        break
      }
    }
    
    // Extrai quantidade (padrões: "X quilos", "X unidades", "X frascos")
    const quantityPatterns = [
      /(\d+)\s*(quilos|kg|gramas|g)/i,
      /(\d+)\s*(unidades|frascos|potes|pacotes)/i,
      /(\d+)\s*ml/i
    ]
    
    for (const pattern of quantityPatterns) {
      const match = text.match(pattern)
      if (match) {
        productInfo.quantity = `${match[1]} ${match[2]}`
        break
      }
    }
    
    // Se não encontrou nome, tenta primeira palavra capitalizada
    if (!productInfo.name) {
      const words = transcriptText.split(' ')
      productInfo.name = words[0].charAt(0).toUpperCase() + words[0].slice(1)
    }
    
    // Categoria padrão se não detectada
    if (!productInfo.category) {
      productInfo.category = 'Frutas'
    }
    
    console.log('[Speech] Informações extraídas:', productInfo)
    
    return productInfo
  }
  
  // Altera idioma
  const setLanguage = (lang) => {
    speechState.value.language = lang
    if (recognition) {
      recognition.lang = lang
    }
  }
  
  // Reseta estado
  const reset = () => {
    speechState.value.transcript = ''
    speechState.value.interimTranscript = ''
    speechState.value.confidence = 0
    speechState.value.error = null
  }
  
  return {
    // Estado
    isListening,
    isSupported,
    transcript,
    interimTranscript,
    confidence,
    error,
    
    // Controle de reconhecimento ao vivo
    startListening,
    stopListening,
    abort,
    
    // Transcrição de arquivo
    transcribeAudioFile,
    extractProductInfo,
    
    // Configuração
    setLanguage,
    reset
  }
}
