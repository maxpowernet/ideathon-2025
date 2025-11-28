# Projeto: Vitrine da Bioeconomia do Cerrado - MVP Marketplace Digital
**Ideathon FAPTgulhas UniSaberes 2025**

## 1. Visão Geral e Arquitetura
**Objetivo:** Conectar produtores da sociobiodiversidade do Sul do Tocantins diretamente a compradores, formalizando a cadeia produtiva através de tecnologia acessível.

### Tech Stack
- **Front-end:** Vue 3 (Composition API) + Vue Router.
- **Estilos:** Tailwind CSS (Interface moderna, limpa e responsiva).
- **Documentos:** Biblioteca `docx` (ou `docxtemplater`) no front-end para geração de contratos/pedidos offline.
- **Backend/Dados:** Firebase (Auth, Firestore, Storage) ou Mock API para validação rápida no evento.

### Diretrizes de UX (User Experience)
- **Login Opcional (Modo Visitante):** O usuário pode explorar todo o catálogo e o mapa sem criar conta. O login só é solicitado no momento da conversão (Publicar Produto ou Fechar Pedido).
- **Mobile-First:** Interface pensada para uso em campo, com botões grandes e navegação por toque.
- **Identidade Visual:** Cores inspiradas no Cerrado (Verde Esmeralda, Amarelo Pequi, Tons de Terra).

---

## 2. Funcionalidades Principais do MVP

### A. Cadastro Relâmpago (Quick Capture) - *Foco no Produtor*
*Para inclusão digital de extrativistas e agricultores familiares.*

- **Interface:** Botão flutuante ou de destaque "Vender Agora".
- **Fluxo:**
  1. **Câmera/Upload:** Abre a câmera nativa para foto do produto.
  2. **Descrição Ágil:** Campo de texto simples (ou opção de gravar áudio convertendo para texto, se houver tempo de implementar API de speech-to-text; caso contrário, focar em Inputs grandes).
  3. **Categorização Automática:** Seleção rápida (Ex: Fruto, Óleo, Artesanato).
  4. **Preview:** Mostra como o card vai ficar.
  5. **Publicar:** Salva no banco e disponibiliza imediatamente.

### B. Catálogo e Educação (Vitrine) - *Foco no Comprador*
*Atende ao critério de "Mérito" e "Educação" do regulamento.*

- **Layout:** Grade de cards responsivos.
- **Filtros:** Chips no topo (Ex: "Baru", "Pequi", "Buriti", "Capim Dourado").
- **Card Educativo (Diferencial):**
  - Ao clicar no produto, além do preço, exibe um modal **"Saberes do Cerrado"**:
    - Benefícios nutricionais/uso.
    - História do produtor (Storytelling regional).
    - Selo de origem (ex: "Produzido em Gurupi").

### C. Fluxo de Pedido com "Automatic DOCX"
*Atende à necessidade de formalização e histórico.*

- **Carrinho:** Adição simples de itens.
- **Checkout:**
  - Resumo do pedido.
  - Botão **"Finalizar e Gerar Contrato"**.
- **Automação (Recurso Chave):**
  - Ao confirmar, o app gera **localmente** um arquivo `.docx` formatado contendo:
    - Dados do Comprador e Vendedor.
    - Lista de itens e valores.
    - Termo de compromisso de compra sustentável.
  - **Ação Final:** Abre o menu de compartilhamento do celular para enviar o `.docx` via E-mail ou WhatsApp para o produtor.
  - **Histórico:** Salva o registro na aba "Meus Documentos".

### D. Mapa da Biodiversidade (Visualização)
- Mapa interativo (pode ser imagem estática com pins CSS para MVP ou Leaflet.js).
- Mostra a distribuição dos produtores na região Sul do Tocantins.
- Clicar no pin leva ao perfil do produtor.

---

## 3. Estrutura de Componentes Sugerida (Vue 3)

```text
src/
├── components/
│   ├── HeaderBar.vue       (Logo + Carrinho + Status Login)
│   ├── ProductCard.vue     (Visualização do item)
│   ├── EducationalModal.vue (Modal com detalhes e info nutricional)
│   ├── QuickCapture.vue    (Formulário com Câmera e Upload)
│   └── DocxGenerator.vue   (Lógica invisível de geração do arquivo)
├── views/
│   ├── FeedPublico.vue     (Home - Acessível sem login)
│   ├── ProducerDash.vue    (Área logada do produtor)
│   ├── CartCheckout.vue    (Finalização e Geração de DOCX)
│   └── OrderHistory.vue    (Histórico de pedidos/docs gerados)
└── App.vue