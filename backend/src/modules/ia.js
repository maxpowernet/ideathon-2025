/**
 * Módulo de Visão Computacional (IA)
 * Classifica imagens de produtos do Cerrado
 */

// Produtos suportados (expandir conforme necessário)
const PRODUTOS_CONHECIDOS = [
  'baru', 'pequi', 'buriti', 'mel', 'capim-dourado', 'babaçu',
  'almesca', 'bacupari', 'murici', 'curriola', 'cagaita'
]

/**
 * Analisa a imagem e retorna identificação do produto
 * @param {string} imagemBase64 - Imagem em base64
 * @returns {Promise<Object>} - { produto, confianca, qualidade_aprox }
 */
export async function classificarImagem(imagemBase64) {
  // TODO: Integrar com Roboflow API ou modelo TensorFlow.js
  // Por enquanto, implementação mock para desenvolvimento
  
  // Simular delay de processamento
  await new Promise(resolve => setTimeout(resolve, 1500))
  
  // Mock: retorna produto aleatório com alta confiança
  const produtoAleatorio = PRODUTOS_CONHECIDOS[Math.floor(Math.random() * PRODUTOS_CONHECIDOS.length)]
  const confianca = 0.85 + (Math.random() * 0.14) // 0.85 - 0.99
  const qualidades = ['baixa', 'media', 'premium']
  const qualidade = qualidades[Math.floor(Math.random() * qualidades.length)]
  
  return {
    produto: produtoAleatorio,
    confianca: parseFloat(confianca.toFixed(2)),
    qualidade_aprox: qualidade,
    metadata: {
      timestamp: new Date().toISOString(),
      method: 'mock', // Trocar para 'roboflow' ou 'tensorflow' quando integrar
      imageSize: imagemBase64.length
    }
  }
}

/**
 * Validar imagem base64
 */
export function validarImagemBase64(imagemBase64) {
  if (!imagemBase64 || typeof imagemBase64 !== 'string') {
    return { valid: false, error: 'Imagem inválida' }
  }
  
  // Verificar se é base64 válido
  const base64Regex = /^data:image\/(png|jpeg|jpg|webp);base64,/
  if (!base64Regex.test(imagemBase64)) {
    return { valid: false, error: 'Formato de imagem não suportado. Use PNG, JPEG ou WebP' }
  }
  
  // Verificar tamanho (max 10MB)
  const sizeInBytes = (imagemBase64.length * 3) / 4
  const maxSize = 10 * 1024 * 1024 // 10MB
  if (sizeInBytes > maxSize) {
    return { valid: false, error: 'Imagem muito grande. Máximo: 10MB' }
  }
  
  return { valid: true }
}

/**
 * Integração futura com Roboflow
 * Descomentar e configurar quando tiver API key
 */
/*
import axios from 'axios'

async function classificarComRoboflow(imagemBase64) {
  const apiKey = process.env.ROBOFLOW_API_KEY
  const modelId = process.env.ROBOFLOW_MODEL_ID
  
  const response = await axios.post(
    `https://detect.roboflow.com/${modelId}?api_key=${apiKey}`,
    imagemBase64.replace(/^data:image\/\w+;base64,/, ''),
    { headers: { 'Content-Type': 'application/x-www-form-urlencoded' } }
  )
  
  return {
    produto: response.data.predictions[0]?.class,
    confianca: response.data.predictions[0]?.confidence,
    qualidade_aprox: estimarQualidade(response.data)
  }
}
*/
