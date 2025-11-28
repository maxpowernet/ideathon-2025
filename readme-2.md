🌿 Vitrine da Bioeconomia do Cerrado
MVP Marketplace Digital - Ideathon FAPTgulhas UniSaberes 2025

Plataforma digital que conecta produtores, revendedores e fornecedores de insumos da sociobiodiversidade do Sul do Tocantins diretamente a compradores, formalizando toda a cadeia produtiva através de tecnologia acessível, mobile-first e integração WhatsApp com cadastro por áudio e contratos automatizados.

✨ Funcionalidades Principais
🛍️ Para Compradores
Catálogo Educativo: Explore produtos e insumos do Cerrado com informações nutricionais, história dos produtores e selos de origem

Filtros Inteligentes: Navegação por categorias (Frutas, Óleos, Artesanato, Mel, Farinhas, Insumos Agrícolas)

Carrinho de Compras: Sistema completo com gestão de quantidades e modo revendedor com descontos por volume

Geração Automática de Contratos: Documentos DOCX formais com todos os detalhes do pedido, termo sustentável e assinaturas digitais

Compartilhamento Mobile: Envie contratos via WhatsApp ou E-mail diretamente do smartphone com botão de aprovação

Histórico de Pedidos: Acesse todos os contratos gerados e consulte disponibilidade por mensagem WhatsApp

Consulta por Voz/Texto: Envie mensagem no WhatsApp para catálogo personalizado de produtos e insumos disponíveis

🌱 Para Produtores
Quick Capture por Áudio WhatsApp: Cadastro relâmpago de produtos e insumos enviando áudio com descrição (transcrição automática via IA)

Painel do Produtor: Gerencie seus produtos, insumos e revendas publicados com notificações WhatsApp

Processo em 4 Etapas:

Áudio WhatsApp (descreva produto/insumo, preço, quantidade)

Categoria automática (IA reconhece Frutas, Insumos, etc.)

Detalhes confirmados (nome, descrição, preço extraídos do áudio)

Preview e publicação com foto opcional

🎨 Design Mobile-First
Interface otimizada para smartphones e integração nativa WhatsApp

Botões com tamanho mínimo de toque (48px)

Paleta de cores inspirada no Cerrado

Animações suaves e responsivas

Modo visitante (navegação sem login) + Bot WhatsApp sem cadastro

🚀 Tecnologias Utilizadas
Vue 3 (Composition API)

Vue Router (navegação SPA)

Tailwind CSS (estilização moderna e responsiva)

Vite (build tool ultrarrápido)

docx (geração de contratos em DOCX)

file-saver (download de arquivos)

WhatsApp Business API (via Twilio) para mensagens, áudios e contratos

Google Speech-to-Text (transcrição áudios PT-BR)

Firebase (Auth, Firestore, Storage, Functions)

Paleta de Cores Cerrado
Verde Esmeralda: #10b981

Verde Escuro: #059669

Amarelo Pequi: #fbbf24

Dourado: #f59e0b

Tom Terra: #92400e

Tons complementares de areia e marrom

📦 Instalação e Execução
Pré-requisitos
Node.js 18+ instalado

npm ou yarn

Chave WhatsApp Business API (Twilio Sandbox para testes)

Passos
Instalar dependências

powershell
npm install
Iniciar servidor de desenvolvimento

powershell
npm run dev
Acessar a aplicação

Abra o navegador em http://localhost:3000

Para testar em dispositivo móvel na mesma rede, use o IP local exibido no terminal

Configure WhatsApp: Envie "JOIN sandbox" para número Twilio de teste

Build para produção

powershell
npm run build
Preview da build

powershell
npm run preview
📂 Estrutura do Projeto
text
src/
├── components/
│   ├── HeaderBar.vue           # Cabeçalho com logo, carrinho e login
│   ├── LoginModal.vue          # Modal de autenticação
│   ├── ProductCard.vue         # Card de produto no catálogo
│   ├── EducationalModal.vue    # Modal "Saberes do Cerrado"
│   ├── QuickCapture.vue        # Cadastro rápido de produtos
│   ├── WhatsAppAudio.vue       # Captura e envio áudio WhatsApp
│   ├── RevendaPanel.vue        # Painel revendedores/insumos
│   └── DocxGenerator.vue       # Geração de contratos DOCX
├── views/
│   ├── FeedPublico.vue         # Home - Catálogo público
│   ├── ProducerDash.vue        # Painel do produtor
│   ├── CartCheckout.vue        # Carrinho e finalização
│   └── OrderHistory.vue        # Histórico de pedidos
├── composables/
│   ├── useAuth.js              # State de autenticação
│   ├── useCart.js              # State do carrinho
│   ├── useWhatsApp.js          # Integração WhatsApp API
│   └── useSpeech.js            # Speech-to-text processing
├── router/
│   └── index.js                # Configuração de rotas
├── styles/
│   └── index.css               # Estilos globais + Tailwind
├── App.vue                     # Componente raiz
└── main.js                     # Entry point
🎯 Diferenciais do MVP
1. Login Opcional (Modo Visitante)
Usuários podem explorar todo o catálogo sem criar conta

Login só é solicitado na conversão (publicar produto ou finalizar pedido)

2. Educação Integrada
Modal "Saberes do Cerrado" com:

Informações nutricionais

História do produtor

Benefícios do produto

Selo de origem certificada

3. Geração Automática de Contratos
Documentos DOCX profissionais gerados localmente e enviados WhatsApp

Inclui:

Dados do comprador e produtores

Lista detalhada de itens

Valores e totais

Termo de compromisso sustentável

Espaço para assinaturas digitais

4. Cadastro por Áudio WhatsApp (Revolução Inclusiva)
Interface voz para produtores com baixa literacia digital

IA transcreve áudio → extrai dados → publica automaticamente

Funciona offline (áudio armazenado, processado ao conectar)

5. Mobile-First com WhatsApp Nativo
Todas as interações otimizadas para toque e conversa

Paleta de cores regional

Animações leves e performáticas

95% dos brasileiros já usam WhatsApp diariamente

6. Mercado Completo (Produtos + Insumos + Revenda)
Produtos Cerrado + insumos agrícolas + cadeia revendedora

Economia circular: produtores compram insumos, vendem produtos

Formalização completa da bioeconomia local

🌍 Contexto do Projeto
Região: Sul do Tocantins
Bioma: Cerrado
Objetivo: Formalizar a cadeia produtiva da sociobiodiversidade através de tecnologia acessível via WhatsApp, conectando extrativistas, agricultores familiares e revendedores aos mercados consumidores conscientes.

Impacto Social
Valorização dos produtores locais via voz (inclusão total)

Preservação do bioma Cerrado com rastreabilidade

Economia solidária e comércio justo automatizado

Resgate de saberes tradicionais com educação digital

🔧 Próximos Passos (Pós-MVP)
 Integração completa com Firebase (Auth, Firestore, Storage)

 Mapa interativo com Leaflet.js mostrando localização dos produtores

 Speech-to-text para descrição de produtos por áudio

 Sistema de avaliações e reviews

 Chat integrado entre compradores e produtores

 Painel de analytics para produtores

 Sistema de notificações push

 Versão PWA (Progressive Web App) instalável

👥 Contribuindo
Este projeto foi desenvolvido para o Ideathon FAPTgulhas UniSaberes 2025 com foco em soluções inovadoras para a bioeconomia do Cerrado tocantinense.​

📄 Licença
Desenvolvido como MVP para o Ideathon 2025 - Vitrine da Bioeconomia do Cerrado

🎨 Screenshots
Nota: Para melhor experiência, teste a aplicação em um dispositivo móvel ou usando o modo responsivo do navegador (F12 → Toggle Device Toolbar)

Principais Telas:
Home: Catálogo com filtros e cards educativos

Modal Educativo: "Saberes do Cerrado" com 3 abas (Saberes, História, Origem)

Quick Capture WhatsApp: Cadastro por áudio com preview IA

Carrinho: Finalização com geração DOCX via WhatsApp

Painel do Produtor: Gestão de produtos e notificações

Desenvolvido com 💚 para o Cerrado Tocantinense