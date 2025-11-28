import { ref, computed } from 'vue'

// Mock WhatsApp Business API Integration (Twilio)
// Para produção, substituir por chamadas reais à API do Twilio

const whatsappState = ref({
  isConnected: false,
  sandboxNumber: '+14155238886', // Twilio Sandbox number (exemplo)
  userNumber: null,
  conversationHistory: []
})

export function useWhatsApp() {
  const isConnected = computed(() => whatsappState.value.isConnected)
  const sandboxNumber = computed(() => whatsappState.value.sandboxNumber)
  
  // Simula envio de mensagem WhatsApp
  const sendMessage = async (to, message) => {
    try {
      console.log('[WhatsApp Mock] Enviando mensagem:', { to, message })
      
      // Em produção, usar Twilio API:
      // const response = await fetch('https://api.twilio.com/2010-04-01/Accounts/{AccountSid}/Messages.json', {
      //   method: 'POST',
      //   headers: {
      //     'Authorization': 'Basic ' + btoa(TWILIO_ACCOUNT_SID + ':' + TWILIO_AUTH_TOKEN),
      //     'Content-Type': 'application/x-www-form-urlencoded'
      //   },
      //   body: new URLSearchParams({
      //     From: 'whatsapp:' + sandboxNumber.value,
      //     To: 'whatsapp:' + to,
      //     Body: message
      //   })
      // })
      
      // Mock delay
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      whatsappState.value.conversationHistory.push({
        id: Date.now(),
        timestamp: new Date().toISOString(),
        from: sandboxNumber.value,
        to,
        message,
        status: 'sent'
      })
      
      return { success: true, messageId: Date.now() }
    } catch (error) {
      console.error('[WhatsApp] Erro ao enviar mensagem:', error)
      return { success: false, error: error.message }
    }
  }
  
  // Envia documento DOCX via WhatsApp
  const sendDocument = async (to, documentBlob, filename) => {
    try {
      console.log('[WhatsApp Mock] Enviando documento:', { to, filename })
      
      // Em produção, fazer upload do arquivo e usar Twilio Media API
      // 1. Upload para servidor ou Firebase Storage
      // 2. Obter URL pública
      // 3. Enviar via Twilio com MediaUrl
      
      await new Promise(resolve => setTimeout(resolve, 1500))
      
      whatsappState.value.conversationHistory.push({
        id: Date.now(),
        timestamp: new Date().toISOString(),
        from: sandboxNumber.value,
        to,
        message: `📄 Documento: ${filename}`,
        mediaType: 'document',
        status: 'sent'
      })
      
      return { success: true, messageId: Date.now() }
    } catch (error) {
      console.error('[WhatsApp] Erro ao enviar documento:', error)
      return { success: false, error: error.message }
    }
  }
  
  // Recebe mensagens WhatsApp (webhook simulation)
  const receiveMessage = (from, message) => {
    whatsappState.value.conversationHistory.push({
      id: Date.now(),
      timestamp: new Date().toISOString(),
      from,
      to: sandboxNumber.value,
      message,
      status: 'received'
    })
    
    // Processar comandos do catálogo
    return processCatalogQuery(message)
  }
  
  // Processa consultas de catálogo por texto
  const processCatalogQuery = (query) => {
    const products = JSON.parse(localStorage.getItem('products') || '[]')
    const lowerQuery = query.toLowerCase()
    
    // Busca produtos por palavra-chave
    const results = products.filter(p => 
      p.name.toLowerCase().includes(lowerQuery) ||
      p.description.toLowerCase().includes(lowerQuery) ||
      p.category.toLowerCase().includes(lowerQuery)
    )
    
    if (results.length === 0) {
      return {
        message: '🌿 Não encontramos produtos com essa descrição. Tente: baru, pequi, buriti, mel, óleo.',
        products: []
      }
    }
    
    const responseText = `🌿 *Encontramos ${results.length} produto(s):*\n\n` +
      results.slice(0, 5).map((p, i) => 
        `${i + 1}. *${p.name}* - R$ ${p.price}\n   ${p.description}\n   📍 ${p.origin}`
      ).join('\n\n')
    
    return {
      message: responseText,
      products: results
    }
  }
  
  // Conecta ao Twilio Sandbox
  const connectSandbox = async (userPhoneNumber) => {
    try {
      console.log('[WhatsApp Mock] Conectando ao sandbox:', userPhoneNumber)
      
      // Simula envio de código "join sandbox"
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      whatsappState.value.isConnected = true
      whatsappState.value.userNumber = userPhoneNumber
      
      return { 
        success: true, 
        message: 'Conectado! Envie "join sandbox" para o número do Twilio.' 
      }
    } catch (error) {
      return { success: false, error: error.message }
    }
  }
  
  // Desconecta
  const disconnect = () => {
    whatsappState.value.isConnected = false
    whatsappState.value.userNumber = null
  }
  
  // Abre WhatsApp nativo do celular (deep link)
  const openWhatsAppChat = (phoneNumber, prefilledText = '') => {
    const cleanNumber = phoneNumber.replace(/\D/g, '')
    const encodedText = encodeURIComponent(prefilledText)
    const url = `https://wa.me/${cleanNumber}?text=${encodedText}`
    
    window.open(url, '_blank')
  }
  
  // Compartilha via WhatsApp usando Web Share API
  const shareViaWhatsApp = async (text, file = null) => {
    try {
      if (navigator.share && file) {
        // Web Share API Level 2 (suporta arquivos)
        await navigator.share({
          title: 'Contrato - Cerrado Certo Conectado',
          text: text,
          files: [file]
        })
        return { success: true }
      } else if (navigator.share) {
        // Apenas texto
        await navigator.share({
          title: 'Cerrado Certo Conectado',
          text: text
        })
        return { success: true }
      } else {
        // Fallback: abre WhatsApp Web
        openWhatsAppChat('', text)
        return { success: true, fallback: true }
      }
    } catch (error) {
      if (error.name === 'AbortError') {
        return { success: false, cancelled: true }
      }
      console.error('[WhatsApp] Erro ao compartilhar:', error)
      return { success: false, error: error.message }
    }
  }
  
  // Histórico de mensagens
  const getConversationHistory = computed(() => 
    whatsappState.value.conversationHistory
  )
  
  // Limpa histórico
  const clearHistory = () => {
    whatsappState.value.conversationHistory = []
  }
  
  return {
    // Estado
    isConnected,
    sandboxNumber,
    
    // Métodos de mensagem
    sendMessage,
    sendDocument,
    receiveMessage,
    processCatalogQuery,
    
    // Conexão
    connectSandbox,
    disconnect,
    
    // Compartilhamento
    openWhatsAppChat,
    shareViaWhatsApp,
    
    // Histórico
    getConversationHistory,
    clearHistory
  }
}
