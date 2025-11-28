import express from 'express'
import cors from 'cors'
import dotenv from 'dotenv'
import iaRoutes from './routes/ia.js'
import precoRoutes from './routes/preco.js'
import anunciosRoutes from './routes/anuncios.js'
import uploadRoutes from './routes/upload.js'

dotenv.config()

const app = express()
const PORT = process.env.PORT || 3001

// Middleware
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:5173',
  credentials: true
}))
app.use(express.json({ limit: '10mb' }))
app.use(express.urlencoded({ extended: true, limit: '10mb' }))

// Servir arquivos estáticos (uploads)
app.use('/uploads', express.static('uploads'))

// Routes
app.use('/api/ia', iaRoutes)
app.use('/api/preco', precoRoutes)
app.use('/api/anuncios', anunciosRoutes)
app.use('/api/upload', uploadRoutes)

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'OK', timestamp: new Date().toISOString() })
})

// 404
app.use((req, res) => {
  res.status(404).json({ error: 'Endpoint não encontrado' })
})

// Error handler
app.use((err, req, res, next) => {
  console.error(err.stack)
  res.status(500).json({ 
    error: 'Erro interno do servidor',
    message: process.env.NODE_ENV === 'development' ? err.message : undefined
  })
})

app.listen(PORT, () => {
  console.log(`🌿 Cerrado Certo API rodando em http://localhost:${PORT}`)
  console.log(`📝 Ambiente: ${process.env.NODE_ENV || 'development'}`)
})
