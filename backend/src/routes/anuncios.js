import express from 'express'
import fs from 'fs/promises'
import path from 'path'
import { fileURLToPath } from 'url'
import { publicarEmCanais } from '../modules/distribuicao.js'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)
const router = express.Router()

const DATA_FILE = path.join(__dirname, '../../data/anuncios.json')

// Garantir que o arquivo existe
async function initDataFile() {
  try {
    await fs.access(DATA_FILE)
  } catch {
    await fs.writeFile(DATA_FILE, JSON.stringify([], null, 2))
  }
}

// Carregar anúncios
async function loadAnuncios() {
  await initDataFile()
  const data = await fs.readFile(DATA_FILE, 'utf-8')
  return JSON.parse(data)
}

// Salvar anúncios
async function saveAnuncios(anuncios) {
  await fs.writeFile(DATA_FILE, JSON.stringify(anuncios, null, 2))
}

/**
 * GET /api/anuncios
 * Lista todos os anúncios (com filtros opcionais)
 */
router.get('/', async (req, res) => {
  try {
    const anuncios = await loadAnuncios()
    const { produto, uf, categoria, status } = req.query
    
    let filtered = anuncios
    
    if (produto) {
      filtered = filtered.filter(a => 
        a.produto.toLowerCase().includes(produto.toLowerCase()) ||
        a.titulo.toLowerCase().includes(produto.toLowerCase())
      )
    }
    
    if (uf) {
      filtered = filtered.filter(a => a.localidade.includes(uf))
    }
    
    if (categoria) {
      filtered = filtered.filter(a => a.categoria === categoria)
    }
    
    if (status) {
      filtered = filtered.filter(a => a.status === status)
    }
    
    res.json({ anuncios: filtered, total: filtered.length })
  } catch (error) {
    console.error('Erro ao listar anúncios:', error)
    res.status(500).json({ error: 'Erro ao carregar anúncios' })
  }
})

/**
 * GET /api/anuncios/:id
 * Busca anúncio por ID
 */
router.get('/:id', async (req, res) => {
  try {
    const anuncios = await loadAnuncios()
    const anuncio = anuncios.find(a => a.id === req.params.id)
    
    if (!anuncio) {
      return res.status(404).json({ error: 'Anúncio não encontrado' })
    }
    
    res.json(anuncio)
  } catch (error) {
    console.error('Erro ao buscar anúncio:', error)
    res.status(500).json({ error: 'Erro ao buscar anúncio' })
  }
})

/**
 * POST /api/anuncios
 * Cria novo anúncio
 */
router.post('/', async (req, res) => {
  try {
    const {
      produtorId,
      produto,
      titulo,
      descricao,
      qualidade,
      quantidade,
      unidade,
      preco_unitario,
      localidade,
      categoria,
      imagens,
      contato_whatsapp,
      produtor_nome,
      canais
    } = req.body
    
    // Validar campos obrigatórios
    if (!produto || !titulo || !preco_unitario || !localidade) {
      return res.status(400).json({ 
        error: 'Campos obrigatórios: produto, titulo, preco_unitario, localidade' 
      })
    }
    
    const anuncios = await loadAnuncios()
    
    const novoAnuncio = {
      id: `anuncio_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      produtorId: produtorId || 'produtor_demo',
      produto,
      titulo,
      descricao: descricao || '',
      qualidade: qualidade || 'media',
      quantidade: quantidade || 1,
      unidade: unidade || 'kg',
      preco_unitario: parseFloat(preco_unitario),
      localidade,
      categoria: categoria || 'fruit',
      imagens: imagens || [],
      contato_whatsapp: contato_whatsapp || '',
      produtor_nome: produtor_nome || 'Produtor',
      status: 'ativo',
      canaisPublicados: [],
      criadoEm: new Date().toISOString(),
      atualizadoEm: new Date().toISOString()
    }
    
    anuncios.push(novoAnuncio)
    await saveAnuncios(anuncios)
    
    // Publicar em canais (se especificado)
    if (canais && canais.length > 0) {
      const resultados = await publicarEmCanais(novoAnuncio, canais)
      novoAnuncio.canaisPublicados = resultados
        .filter(r => r.status === 'sucesso')
        .map(r => r.canal)
      
      await saveAnuncios(anuncios)
    }
    
    res.status(201).json({
      anuncio: novoAnuncio,
      urlMarketplace: `${process.env.FRONTEND_URL || 'http://localhost:5173'}/produto/${novoAnuncio.id}`
    })
  } catch (error) {
    console.error('Erro ao criar anúncio:', error)
    res.status(500).json({ error: 'Erro ao criar anúncio' })
  }
})

/**
 * PUT /api/anuncios/:id
 * Atualiza anúncio
 */
router.put('/:id', async (req, res) => {
  try {
    const anuncios = await loadAnuncios()
    const index = anuncios.findIndex(a => a.id === req.params.id)
    
    if (index === -1) {
      return res.status(404).json({ error: 'Anúncio não encontrado' })
    }
    
    const anuncioAtualizado = {
      ...anuncios[index],
      ...req.body,
      id: req.params.id, // Não permitir alterar ID
      atualizadoEm: new Date().toISOString()
    }
    
    anuncios[index] = anuncioAtualizado
    await saveAnuncios(anuncios)
    
    res.json(anuncioAtualizado)
  } catch (error) {
    console.error('Erro ao atualizar anúncio:', error)
    res.status(500).json({ error: 'Erro ao atualizar anúncio' })
  }
})

/**
 * DELETE /api/anuncios/:id
 * Remove anúncio
 */
router.delete('/:id', async (req, res) => {
  try {
    const anuncios = await loadAnuncios()
    const filtered = anuncios.filter(a => a.id !== req.params.id)
    
    if (filtered.length === anuncios.length) {
      return res.status(404).json({ error: 'Anúncio não encontrado' })
    }
    
    await saveAnuncios(filtered)
    res.json({ success: true, message: 'Anúncio removido com sucesso' })
  } catch (error) {
    console.error('Erro ao remover anúncio:', error)
    res.status(500).json({ error: 'Erro ao remover anúncio' })
  }
})

export default router
