import express from 'express'
import multer from 'multer'
import path from 'path'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)
const router = express.Router()

// Configurar storage do Multer
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/')
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9)
    cb(null, 'produto-' + uniqueSuffix + path.extname(file.originalname))
  }
})

const upload = multer({
  storage,
  limits: { fileSize: 10 * 1024 * 1024 }, // 10MB
  fileFilter: (req, file, cb) => {
    const allowedTypes = /jpeg|jpg|png|webp/
    const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase())
    const mimetype = allowedTypes.test(file.mimetype)
    
    if (mimetype && extname) {
      return cb(null, true)
    }
    cb(new Error('Apenas imagens (JPEG, PNG, WebP) são permitidas'))
  }
})

/**
 * POST /api/upload/imagem
 * Upload de imagem de produto
 */
router.post('/imagem', upload.single('imagem'), (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'Nenhuma imagem enviada' })
    }
    
    const imageUrl = `${req.protocol}://${req.get('host')}/uploads/${req.file.filename}`
    
    res.json({
      success: true,
      url: imageUrl,
      filename: req.file.filename,
      size: req.file.size,
      mimetype: req.file.mimetype
    })
  } catch (error) {
    console.error('Erro no upload:', error)
    res.status(500).json({ error: 'Erro ao fazer upload da imagem' })
  }
})

/**
 * POST /api/upload/multiplas
 * Upload de múltiplas imagens
 */
router.post('/multiplas', upload.array('imagens', 5), (req, res) => {
  try {
    if (!req.files || req.files.length === 0) {
      return res.status(400).json({ error: 'Nenhuma imagem enviada' })
    }
    
    const urls = req.files.map(file => ({
      url: `${req.protocol}://${req.get('host')}/uploads/${file.filename}`,
      filename: file.filename,
      size: file.size
    }))
    
    res.json({
      success: true,
      imagens: urls,
      total: urls.length
    })
  } catch (error) {
    console.error('Erro no upload múltiplo:', error)
    res.status(500).json({ error: 'Erro ao fazer upload das imagens' })
  }
})

export default router
