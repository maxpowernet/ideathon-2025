# 🌿 Cerrado Certo - Backend API

Backend Node.js para o marketplace de bioeconomia do Cerrado.

## 🚀 Funcionalidades Implementadas

### ✅ Módulos Principais

1. **IA de Visão Computacional** (`/api/ia`)
   - `POST /api/ia/classificar` - Classifica imagem de produto
   - `GET /api/ia/produtos-suportados` - Lista produtos reconhecíveis
   - Mock inicial (pronto para integração com Roboflow)

2. **Precificação Dinâmica** (`/api/preco`)
   - `POST /api/preco/sugerir` - Sugere preço baseado em produto, qualidade e região
   - `GET /api/preco/referencias` - Lista preços de referência
   - Algoritmo com ajustes de qualidade e região

3. **CRUD de Anúncios** (`/api/anuncios`)
   - `GET /api/anuncios` - Lista todos (com filtros)
   - `GET /api/anuncios/:id` - Busca por ID
   - `POST /api/anuncios` - Cria novo anúncio
   - `PUT /api/anuncios/:id` - Atualiza anúncio
   - `DELETE /api/anuncios/:id` - Remove anúncio
   - Persistência em JSON (pronto para PostgreSQL/Firebase)

4. **Upload de Imagens** (`/api/upload`)
   - `POST /api/upload/imagem` - Upload simples
   - `POST /api/upload/multiplas` - Upload múltiplo
   - Storage local (pronto para S3/Cloudflare R2)

5. **Distribuição Omnicanal** (módulo interno)
   - Formatação para: marketplace, WhatsApp, Instagram, Telegram
   - Sistema de dispatcher automático
   - Logs de publicação por canal

## 📦 Instalação

```powershell
cd backend
npm install
```

## ⚙️ Configuração

Copie `.env.example` para `.env` e configure:

```env
PORT=3001
NODE_ENV=development
FRONTEND_URL=http://localhost:5173
```

## 🏃 Executar

### Desenvolvimento (com auto-reload)
```powershell
npm run dev
```

### Produção
```powershell
npm start
```

## 📡 Endpoints Principais

### IA - Classificação de Imagem
```http
POST /api/ia/classificar
Content-Type: application/json

{
  "imagemBase64": "data:image/jpeg;base64,..."
}
```

**Resposta:**
```json
{
  "produto": "pequi",
  "confianca": 0.93,
  "qualidade_aprox": "premium",
  "metadata": {
    "timestamp": "2025-11-28T...",
    "method": "mock"
  }
}
```

### Precificação Dinâmica
```http
POST /api/preco/sugerir
Content-Type: application/json

{
  "produto": "pequi",
  "qualidade": "premium",
  "quantidade": 10,
  "unidade": "kg",
  "regiao": "Gurupi-TO"
}
```

**Resposta:**
```json
{
  "preco_sugerido_unidade": 64.80,
  "preco_total": 648.00,
  "moeda": "BRL",
  "unidade": "kg",
  "detalhes": {
    "preco_base": 48.00,
    "qualidade": "premium",
    "multiplicador_qualidade": 1.35,
    "ajuste_regional": 1.0
  }
}
```

### Criar Anúncio
```http
POST /api/anuncios
Content-Type: application/json

{
  "produtorId": "prod123",
  "produto": "pequi",
  "titulo": "Pequi Silvestre Premium",
  "descricao": "Pequi colhido no cerrado tocantinense",
  "qualidade": "premium",
  "quantidade": 10,
  "unidade": "kg",
  "preco_unitario": 48.00,
  "localidade": "Gurupi - TO",
  "categoria": "fruit",
  "imagens": ["http://..."],
  "contato_whatsapp": "+5563999999999",
  "produtor_nome": "João Silva",
  "canais": ["marketplace", "whatsapp"]
}
```

### Upload de Imagem
```http
POST /api/upload/imagem
Content-Type: multipart/form-data

imagem: [arquivo]
```

## 🔄 Integrações Futuras

### Roboflow (IA de Visão)
Descomentar código em `src/modules/ia.js` e configurar:
```env
ROBOFLOW_API_KEY=sua_chave
ROBOFLOW_MODEL_ID=seu_modelo
```

### Cloudflare R2 / AWS S3
Configurar em `.env`:
```env
S3_ACCESS_KEY=...
S3_SECRET_KEY=...
S3_BUCKET_NAME=...
```

### Firebase / PostgreSQL
Substituir `data/anuncios.json` por banco real.

## 📂 Estrutura

```
backend/
├── src/
│   ├── modules/         # Lógica de negócio
│   │   ├── ia.js
│   │   ├── precificacao.js
│   │   └── distribuicao.js
│   ├── routes/          # Endpoints da API
│   │   ├── ia.js
│   │   ├── preco.js
│   │   ├── anuncios.js
│   │   └── upload.js
│   └── server.js        # Servidor Express
├── data/                # Persistência JSON
├── uploads/             # Imagens enviadas
└── package.json
```

## 🧪 Testar API

```powershell
# Health check
curl http://localhost:3001/health

# Listar preços de referência
curl http://localhost:3001/api/preco/referencias

# Sugerir preço
curl -X POST http://localhost:3001/api/preco/sugerir `
  -H "Content-Type: application/json" `
  -d '{"produto":"baru","qualidade":"premium","quantidade":5}'
```

## 🎯 Próximos Passos

- [ ] Integrar Roboflow API
- [ ] Migrar para PostgreSQL/Firebase
- [ ] Implementar autenticação JWT
- [ ] Adicionar testes automatizados
- [ ] Deploy em Railway/Render
- [ ] Configurar CI/CD
