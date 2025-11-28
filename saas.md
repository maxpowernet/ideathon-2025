# Cerrado Certo Conectado

> A inteligência que conecta produtor, comprador e floresta.

Plataforma digital **SaaS** conectada que une:
- **IA de visão computacional** (via WhatsApp)
- **Marketplace integrado**
- **Precificação dinâmica**
- **Distribuição omnicanal**
- **Comunidade de produtores**

Funcionalidade essencial (fluxo principal):  
**foto → IA identificação → preço sugerido → anúncio profissional → múltiplos canais → rede conectada.**

---

## Visão Geral do Protótipo

O protótipo do **Cerrado Certo Conectado** foca em oferecer, com o mínimo de fricção possível, um caminho completo para que um produtor rural consiga:

1. Registrar seu produto apenas tirando uma foto pelo WhatsApp.  
2. Ter o item reconhecido automaticamente por IA.  
3. Receber um **preço sugerido** com base em regras de mercado configuráveis.  
4. Gerar um **anúncio profissional** pronto para venda.  
5. Publicar esse anúncio em múltiplos canais (marketplace web + grupos de WhatsApp).  
6. Gerenciar pedidos, clientes e reputação em um **painel simples**.

---

## Arquitetura Lógica (MVP)

### Módulos Principais

1. **Módulo WhatsApp Bot (Interface do Produtor)**
   - Recebe mensagens e fotos do produtor.
   - Conduz o fluxo de conversa (menus e prompts).
   - Envia de volta: produto identificado, preço sugerido, status de publicação.

2. **Módulo de Visão Computacional (IA)**
   - Endpoint HTTP/REST que recebe imagem.
   - Classifica o produto (ex.: pequi, baru, mel, buriti, etc.).
   - Retorna:
     - `produto`
     - `confiança`
     - `qualidade_aprox` (ex.: “premium”, “médio”, “baixo”)
   - Para o MVP, pode usar modelo pré-treinado + dicionário de classes.

3. **Módulo de Precificação Dinâmica**
   - Recebe:
     - tipo de produto
     - qualidade aproximada
     - peso/quantidade estimada (ou informada)
   - Calcula preço sugerido com base em:
     - tabela de preços médios
     - fatores de ajuste (qualidade, safra, demanda)
   - Retorna:
     - `preco_sugerido_unidade`
     - `preco_total_sugerido`

4. **Módulo de Marketplace Web**
   - Lista anúncios aprovados.
   - Permite:
     - busca por produto / região
     - visualizar detalhes do produtor
     - solicitar compra (via formulário ou link direto para WhatsApp)
   - API para criação e atualização de anúncios.

5. **Módulo de Distribuição Omnicanal (Dispatcher)**
   - A partir de um anúncio aprovado, dispara publicação para:
     - marketplace web (via API interna)
     - grupos de WhatsApp (mensagens formatadas via bot)
     - outros canais (no futuro: Instagram, Telegram, etc.)
   - Centraliza logs de publicação.

6. **Módulo de Gestão / Painel do Produtor**
   - Interface web simples (login e senha).
   - Principais telas:
     - Meus Produtos / Meus Anúncios
     - Pedidos recebidos
     - Histórico de vendas
     - Feedback / avaliações
   - Usa a mesma API do backend.

---

## Fluxo do Usuário (Produtor)

1. **Início da Conversa**
   - Produtor adiciona o número oficial do Cerrado Certo Conectado no WhatsApp.
   - Envia um “Olá” ou clica em um link de convite.
   - Bot responde com mensagem de boas-vindas e opções:
     - `1 - Cadastrar novo produto`
     - `2 - Ver meus produtos`
     - `3 - Ajuda`

2. **Cadastro com Foto**
   - Ao escolher `1`, o bot pede:  
     “Envie uma foto clara do produto que deseja vender.”
   - Produtor envia a imagem.
   - Bot encaminha a imagem para o Módulo de Visão Computacional.

3. **Identificação via IA**
   - IA retorna algo como:
     ```
     {
       "produto": "pequi",
       "confianca": 0.93,
       "qualidade_aprox": "premium"
     }
     ```
   - Bot responde:
     > “Identifiquei **PEQUI (qualidade: premium)**. Está correto?  
     > 1 - Sim  
     > 2 - Não, quero corrigir”

4. **Confirmação e Dados Complementares**
   - Se o produtor confirmar, o bot pede:
     - quantidade (kg, unidades, litros)
     - localidade (município/região)
     - forma de entrega (a combinar / transportadora / retirada)
   - Exemplo:
     > “Quantos kg você quer anunciar?”

5. **Precificação Dinâmica**
   - Backend roda o Módulo de Precificação.
   - Exemplo de retorno:
     ```
     {
       "preco_sugerido_unidade": 48.00,
       "moeda": "BRL"
     }
     ```
   - Bot responde:
     > “Preço sugerido: **R$ 48,00/kg** com base nos valores atuais de mercado e qualidade do seu produto.  
     > Você aceita esse preço?  
     > 1 - Sim  
     > 2 - Quero ajustar”

6. **Geração do Anúncio**
   - Após aceitar/ajustar preço, o sistema:
     - Cria um registro de anúncio no banco de dados.
     - Gera um texto padrão com:
       - nome do produto
       - breve descrição
       - localidade
       - preço
       - contato WhatsApp do produtor
   - Exemplo de payload:
     ```
     {
       "titulo": "Pequi Silvestre Premium - 10kg",
       "descricao": "Pequi colhido no Sul do Tocantins, qualidade premium, ideal para polpas e culinária regional.",
       "preco_unitario": 48.00,
       "unidade": "kg",
       "quantidade": 10,
       "localidade": "Gurupi - TO",
       "contato_whatsapp": "+55XXXXXXXXXXX",
       "imagens": ["url_imagem_armazenada"]
     }
     ```

7. **Publicação em Múltiplos Canais**
   - Módulo de Distribuição:
     - Cria o anúncio no marketplace via API.
     - Envia mensagem formatada em grupos de WhatsApp de compradores:
       > “🌿 Novo produto disponível: Pequi Silvestre Premium – 10kg – R$ 48,00/kg – Gurupi/TO.  
       > Clique para falar com o produtor: [link WhatsApp]  
       > Veja mais detalhes no marketplace: [link anúncio]”
   - (Opcional) Envia para outros canais conectados.

8. **Gestão de Pedidos**
   - Interessados clicam:
     - no link do marketplace (formulário de interesse + contato)
     - ou no link do WhatsApp do produtor (conversa direta).
   - O produtor recebe notificações de interesse e pode marcar manualmente como:
     - em negociação
     - vendido
   - Em versões futuras: fluxo de pagamento integrado.

---

## Modelagem de Dados (Visão Simplificada)

### Entidade `Produtor`

Produtor {
id: string
nome: string
whatsapp: string
municipio: string
uf: string
dataCadastro: Date
rating?: number
}

text

### Entidade `Anuncio`

Anuncio {
id: string
produtorId: string
produto: string
qualidade: 'baixa' | 'media' | 'premium'
quantidade: number
unidade: 'kg' | 'un' | 'l'
precoUnitario: number
moeda: 'BRL'
localidade: string
status: 'rascunho' | 'ativo' | 'vendido' | 'inativo'
canaisPublicados: string[] // ['marketplace', 'whatsapp_grupos']
imagens: string[]
criadoEm: Date
}

text

### Entidade `PrecoReferencia`

PrecoReferencia {
id: string
produto: string
precoMedio: number
fonte: string
atualizadoEm: Date
}

text

---

## Endpoints (Sugestão)

### 1. IA – Classificação de Imagem

`POST /api/ia/classificar`

Request:
{
"imagemBase64": "..."
}

Response:
{
"produto": "pequi",
"confianca": 0.93,
"qualidade_aprox": "premium"
}

text

### 2. Precificação

`POST /api/preco/sugerir`

Request:
{
"produto": "pequi",
"qualidade": "premium",
"quantidade": 10,
"unidade": "kg",
"regiao": "Gurupi-TO"
}

Response:
{
"preco_sugerido_unidade": 48.0,
"moeda": "BRL"
}

text

### 3. Criar Anúncio

`POST /api/anuncios`

Request:
{
"produtorId": "abc123",
"produto": "pequi",
"qualidade": "premium",
"quantidade": 10,
"unidade": "kg",
"precoUnitario": 48.0,
"localidade": "Gurupi - TO",
"imagens": ["https://.../pequi.jpg"]
}

Response:
{
"id": "anuncio123",
"urlMarketplace": "https://cerrado-certo.com/anuncio/anuncio123"
}

text

### 4. Listar Anúncios (Marketplace)

`GET /api/anuncios?produto=pequi&uf=TO`

---

## Tecnologias Sugeridas (para Vibe Coding / PoC)

- **Backend/API:** Node.js (Express ou Fastify)
- **Banco de Dados:** PostgreSQL ou SQLite (para protótipo)
- **IA (PoC):**
  - Serviço externo de visão computacional (ex.: Roboflow API)  
  - Ou modelo simples hospedado em um micro-serviço Python
- **Bot WhatsApp:**
  - API oficial via Meta/Twilio
  - Biblioteca de orquestração (ex.: `venom-bot` ou wrappers equivalentes)
- **Frontend (Marketplace + Painel):**
  - React + Vite / Next.js
  - TailwindCSS para estilização
- **Infraestrutura:**
  - Deploy simples em Railway/Render/Heroku
  - Armazenamento de imagens em S3 compatível (ex.: Cloudflare R2)

---

## Roadmap de Protótipo (versão Vibe Coding)

1. **Semana 1**
   - Setup do repositório.
   - Criar API de `Anuncio` (CRUD básico).
   - Marketplace simples em React listando anúncios.

2. **Semana 2**
   - Integrar bot de WhatsApp (fluxo texto simples).
   - Endpoints stub de IA e preço (mock retorna dados fixos).

3. **Semana 3**
   - Conectar fluxo completo: WhatsApp → API → marketplace.
   - Persistir anúncios e exibir no frontend.

4. **Semana 4**
   - Ajustes de UX, validações, logs.
   - Preparar demo: criar 2–3 produtores fictícios e anúncios reais.

---

## Resumo

O protótipo do **Cerrado Certo Conectado** implementa, de forma enxuta e funcional, o coração da solução:

- **Entrada simples:** foto via WhatsApp.  
- **Cérebro:** IA + precificação.  
- **Saída:** anúncio pronto em diversos canais e rede de compradores.  

Este markdown serve como documentação viva para desenvolvimento colaborativo em plataformas de **vibe coding / code-collab**, permitindo que outras pessoas entendam rapidamente o que o sistema faz, como se organiza e quais partes podem ser implementadas ou melhoradas.