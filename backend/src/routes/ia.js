import express from 'express'
import { classificarImagem, validarImagemBase64 } from '../modules/ia.js'

const router = express.Router()

/**
 * POST /api/ia/classificar
 * Classifica imagem de produto
 */
router.post('/classificar', async (req, res) => {
  try {
    const { imagemBase64 } = req.body
    
    // Validar imagem
    const validacao = validarImagemBase64(imagemBase64)
    if (!validacao.valid) {
      return res.status(400).json({ error: validacao.error })
    }
    
    // Classificar
    const resultado = await classificarImagem(imagemBase64)
    
    res.json(resultado)
  } catch (error) {
    console.error('Erro ao classificar imagem:', error)
    res.status(500).json({ error: 'Erro ao processar imagem' })
  }
})

/**
 * GET /api/ia/produtos-suportados
 * Lista produtos que a IA reconhece
 */
router.get('/produtos-suportados', (req, res) => {
  const produtos = [
    'baru', 'pequi', 'buriti', 'mel', 'capim-dourado', 'babaçu',
    'almesca', 'bacupari', 'murici', 'curriola', 'cagaita'
  ]
  
  res.json({ produtos })
})

export default router
