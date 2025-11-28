import express from 'express'
import { sugerirPreco, listarPrecosReferencia } from '../modules/precificacao.js'

const router = express.Router()

/**
 * POST /api/preco/sugerir
 * Sugere preço para um produto
 */
router.post('/sugerir', (req, res) => {
  try {
    const { produto, qualidade, quantidade, unidade, regiao } = req.body
    
    // Validar campos obrigatórios
    if (!produto) {
      return res.status(400).json({ error: 'Campo "produto" é obrigatório' })
    }
    
    const resultado = sugerirPreco({
      produto,
      qualidade: qualidade || 'media',
      quantidade: quantidade || 1,
      unidade,
      regiao
    })
    
    res.json(resultado)
  } catch (error) {
    console.error('Erro ao sugerir preço:', error)
    res.status(400).json({ error: error.message })
  }
})

/**
 * GET /api/preco/referencias
 * Lista todos os preços de referência
 */
router.get('/referencias', (req, res) => {
  try {
    const precos = listarPrecosReferencia()
    res.json({ precos })
  } catch (error) {
    console.error('Erro ao listar preços:', error)
    res.status(500).json({ error: 'Erro ao listar preços de referência' })
  }
})

export default router
