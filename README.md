# 🌿 Vitrine da Bioeconomia do Cerrado

**MVP Marketplace Digital - Ideathon FAPTgulhas UniSaberes 2025**

Plataforma digital que conecta produtores da sociobiodiversidade do Sul do Tocantins diretamente a compradores, formalizando a cadeia produtiva através de tecnologia acessível e mobile-first.

---

## ✨ Funcionalidades Principais

### 🛍️ Para Compradores
- **Catálogo Educativo**: Explore produtos do Cerrado com informações nutricionais, história dos produtores e selos de origem
- **Busca em Tempo Real**: Campo de busca inteligente que filtra produtos por nome, descrição, produtor ou localidade
- **Filtros Inteligentes**: Navegação por categorias (Frutas, Óleos, Artesanato, Mel, Farinhas, Insumos Agrícolas)
- **Carrinho de Compras**: Sistema completo com gestão de quantidades
- **Modo Revendedor**: Acesso a descontos por volume (10% acima de 10 unidades, 20% acima de 50, 30% acima de 100)
- **Geração Automática de Contratos**: Documentos DOCX formais com todos os detalhes do pedido
- **Compartilhamento Mobile**: Envie contratos via WhatsApp ou E-mail diretamente do smartphone com botões nativos
- **Histórico de Pedidos**: Acesse todos os contratos gerados
- **Notificações Toast**: Feedback visual instantâneo para todas as ações
- **Painel de Revendedor**: Acesse produtos e insumos com descontos em volume

### 🌱 Para Produtores
- **Quick Capture por Áudio**: Cadastro relâmpago descrevendo produtos por voz (Web Speech API)
- **IA para Extração de Dados**: Transcrição automática e extração de nome, preço, categoria e quantidade
- **Câmera do Celular**: Upload de foto ou captura ao vivo (4 etapas totais)
- **Painel do Produtor**: Gerencie seus produtos publicados com estatísticas
- **Pedidos Recebidos**: Visualize e gerencie pedidos que contêm seus produtos
- **Gestão de Status**: Aceite pedidos, marque como "em preparo" ou "concluído"
- **Contato Direto**: Botão para contatar compradores via compartilhamento nativo
- **Processo em 5 Etapas**:
  1. Áudio WhatsApp (opcional - transcrição automática)
  2. Foto (câmera ou galeria)
  3. Categoria
  4. Detalhes (nome, descrição, preço)
  5. Preview e publicação

### 🚜 Para Revendedores/Fornecedores
- **Painel de Insumos Agrícolas**: Acesso a sementes, adubos orgânicos, ferramentas e embalagens
- **Compras em Volume**: Desconto automático por quantidade de itens
- **Economia Circular**: Produtores compram insumos e revendem produtos finais
- **Categorias de Insumos**: Sementes, Adubos Orgânicos, Ferramentas, Embalagens
- **Produtos Certificados**: Insumos orgânicos e sustentáveis

### 🎨 Design Mobile-First
- Interface otimizada para smartphones
- Botões com tamanho mínimo de toque (48px)
- Paleta de cores inspirada no Cerrado
- Animações suaves e responsivas
- Toast notifications com ícones coloridos
- Modo visitante (navegação sem login)

---

## 🚀 Tecnologias Utilizadas

- **Vue 3** (Composition API)
- **Vue Router** (navegação SPA com role guards)
- **Tailwind CSS** (estilização moderna e responsiva)
- **Vite** (build tool ultrarrápido)
- **docx** (geração de contratos em DOCX)
- **file-saver** (download de arquivos)
- **Web Speech API** (reconhecimento de voz PT-BR - navegadores Chromium)
- **Web Share API** (compartilhamento nativo de arquivos)

### Integrações Planejadas (Pós-MVP)
- **WhatsApp Business API** (Twilio) para mensagens e áudios
- **Google Cloud Speech-to-Text** (transcrição profissional PT-BR)
- **Firebase** (Auth, Firestore, Storage, Cloud Functions)

### Paleta de Cores Cerrado
- Verde Esmeralda: `#10b981`
- Verde Escuro: `#059669`
- Amarelo Pequi: `#fbbf24`
- Dourado: `#f59e0b`
- Tom Terra: `#92400e`
- Tons complementares de areia e marrom

---

## 📦 Instalação e Execução

### Pré-requisitos
- Node.js 18+ instalado
- npm ou yarn

### Passos

1. **Instalar dependências**
```powershell
npm install
```

2. **Iniciar servidor de desenvolvimento**
```powershell
npm run dev
```

3. **Acessar a aplicação**
   - Abra o navegador em `http://localhost:3000`
   - Para testar em dispositivo móvel na mesma rede, use o IP local exibido no terminal

4. **Build para produção**
```powershell
npm run build
```

5. **Preview da build**
```powershell
npm run preview
```

---

## 📂 Estrutura do Projeto

```
src/
├── components/
│   ├── HeaderBar.vue           # Cabeçalho com logo, carrinho e login
│   ├── LoginModal.vue          # Modal de autenticação
│   ├── ProductCard.vue         # Card de produto no catálogo
│   ├── EducationalModal.vue    # Modal "Saberes do Cerrado"
│   ├── QuickCapture.vue        # Cadastro rápido de produtos (com áudio)
│   ├── WhatsAppAudio.vue       # Captura e transcrição de áudio
│   ├── RevendaPanel.vue        # Painel revendedores/insumos com descontos
│   ├── DocxGenerator.vue       # Geração de contratos DOCX
│   └── ToastContainer.vue      # Sistema de notificações toast
├── views/
│   ├── FeedPublico.vue         # Home - Catálogo público com busca
│   ├── ProducerDash.vue        # Painel do produtor
│   ├── ProducerOrders.vue      # Pedidos recebidos pelo produtor
│   ├── CartCheckout.vue        # Carrinho com modo revendedor e desconto
│   └── OrderHistory.vue        # Histórico de pedidos
├── composables/
│   ├── useAuth.js              # State de autenticação e roles
│   ├── useCart.js              # State do carrinho com descontos
│   ├── useToast.js             # Sistema de notificações
│   ├── useWhatsApp.js          # Integração WhatsApp (Twilio mock)
│   └── useSpeech.js            # Speech-to-text PT-BR
├── router/
│   └── index.js                # Configuração de rotas com role guards
├── styles/
│   └── index.css               # Estilos globais + Tailwind
├── App.vue                     # Componente raiz
└── main.js                     # Entry point
```

---

## 🎯 Diferenciais do MVP

### 1. **Login Opcional (Modo Visitante)**
   - Usuários podem explorar todo o catálogo sem criar conta
   - Login só é solicitado na conversão (publicar produto ou finalizar pedido)

### 2. **Busca Inteligente em Tempo Real**
   - Filtra produtos por nome, descrição, produtor e localidade
   - Interface limpa com ícone de busca e botão de limpar
   - Combinável com filtros de categoria

### 3. **Sistema de Notificações Toast**
   - Feedback visual para todas as ações importantes
   - 4 tipos: Sucesso (verde), Erro (vermelho), Aviso (amarelo), Info (azul)
   - Auto-dismiss configurável
   - Animações suaves de entrada/saída

### 4. **Educação Integrada**
   - Modal "Saberes do Cerrado" com:
     - Informações nutricionais
     - História do produtor
     - Benefícios do produto
     - Selo de origem certificada

### 5. **Geração Automática de Contratos**
   - Documentos DOCX profissionais gerados localmente
   - Inclui:
     - Dados do comprador e produtores
     - Lista detalhada de itens
     - Valores e totais
     - Termo de compromisso sustentável
     - Espaço para assinaturas

### 6. **Compartilhamento WhatsApp Nativo**
   - Botões para compartilhar contratos via WhatsApp e E-mail
   - Usa Web Share API para máxima compatibilidade
   - Deep links para WhatsApp (wa.me)
   - Mensagens pré-formatadas com dados do pedido

### 7. **Gestão de Pedidos para Produtores**
   - View dedicada mostrando pedidos recebidos
   - Filtro automático de pedidos que contêm produtos do produtor
   - Sistema de status (Pendente → Em Preparo → Concluído)
   - Estatísticas em tempo real
   - Botão de contato direto com comprador

### 8. **Quick Capture com IA para Áudio**
   - 🎤 Gravação de voz via Web Speech API (PT-BR)
   - 📎 Upload de áudio (WhatsApp, Telegram, etc.)
   - 🤖 Extração automática de:
     - Nome do produto
     - Categoria (IA reconhece: Frutas, Óleos, Mel, etc.)
     - Preço e quantidade
     - Descrição completa
   - Suporta expressões de fala como "5 quilos", "vinte reais", "pequi", etc.

### 9. **Painel Revendedor com Economia Circular**
   - Acesso a catálogo de insumos agrícolas certificados
   - Sementes, adubos orgânicos, ferramentas e embalagens
   - Desconto automático por volume:
     - 10+ unidades: 10% OFF
     - 50+ unidades: 20% OFF
     - 100+ unidades: 30% OFF
   - Produtores compram insumos para melhorar produção
   - Revendedores compram em volume para distribuir

### 10. **Mobile-First com Cerrado Design System**
   - Todas as interações otimizadas para toque
   - Paleta de cores regional
   - Animações leves e performáticas
   - Notificações não intrusivas
   - Responsivo em todos os tamanhos

---

## 🌍 Contexto do Projeto

**Região**: Sul do Tocantins  
**Bioma**: Cerrado  
**Objetivo**: Formalizar a cadeia produtiva da sociobiodiversidade através de tecnologia acessível, conectando extrativistas e agricultores familiares aos mercados consumidores conscientes.

### Impacto Social
- Valorização dos produtores locais
- Preservação do bioma Cerrado
- Economia solidária e comércio justo
- Resgate de saberes tradicionais

---

## 🔧 Próximos Passos (Pós-MVP)

- [ ] Integração completa com Firebase (Auth, Firestore, Storage)
- [ ] Integração com WhatsApp Business API (Twilio)
- [ ] Google Cloud Speech-to-Text para transcrição profissional
- [ ] Mapa interativo com Leaflet.js mostrando localização dos produtores
- [ ] Sistema de avaliações e reviews
- [ ] Chat integrado entre compradores e produtores
- [ ] Painel de analytics para produtores
- [ ] Sistema de notificações push
- [ ] Versão PWA (Progressive Web App) instalável
- [ ] Integração com sistemas de pagamento (Stripe, Mercado Pago)
- [ ] QR codes para rastreabilidade de produtos

---

## 👥 Contribuindo

Este projeto foi desenvolvido para o **Ideathon FAPTgulhas UniSaberes 2025** com foco em soluções inovadoras para a bioeconomia do Cerrado tocantinense.

---

## 📄 Licença

Desenvolvido como MVP para o Ideathon 2025 - Vitrine da Bioeconomia do Cerrado

---

## 🎨 Screenshots

> **Nota**: Para melhor experiência, teste a aplicação em um dispositivo móvel ou usando o modo responsivo do navegador (F12 → Toggle Device Toolbar)

### Principais Telas:
- **Home**: Catálogo com busca e filtros, notificações toast
- **Modal Educativo**: "Saberes do Cerrado" com 3 abas (Saberes, História, Origem)
- **Quick Capture**: Cadastro em 5 etapas (Áudio opcional, Foto, Categoria, Detalhes, Preview)
- **WhatsApp Audio**: Gravação de voz + transcrição IA + extração de dados
- **Carrinho**: Modo revendedor com descontos automáticos, compartilhamento WhatsApp
- **Painel do Produtor**: Gestão de produtos e notificações
- **Painel Revendedor**: Acesso a insumos agrícolas com desconto por volume
- **Pedidos**: Visualização e gestão de status

---

**Desenvolvido com 💚 para o Cerrado Tocantinense**
