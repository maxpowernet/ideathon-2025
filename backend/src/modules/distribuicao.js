/**
 * Módulo de Distribuição Omnicanal
 * Dispara publicações em múltiplos canais
 */

/**
 * Formata anúncio para diferentes canais
 */
export function formatarParaCanal(anuncio, canal) {
  const formatadores = {
    marketplace: formatarMarketplace,
    whatsapp: formatarWhatsApp,
    instagram: formatarInstagram,
    telegram: formatarTelegram
  }
  
  const formatador = formatadores[canal]
  if (!formatador) {
    throw new Error(`Canal "${canal}" não suportado`)
  }
  
  return formatador(anuncio)
}

/**
 * Formato para marketplace web (já implementado no frontend)
 */
function formatarMarketplace(anuncio) {
  return {
    id: anuncio.id,
    name: anuncio.titulo,
    description: anuncio.descricao,
    price: anuncio.preco_unitario,
    unit: anuncio.unidade,
    category: anuncio.categoria || 'fruit',
    image: anuncio.imagens[0] || '',
    origin: anuncio.localidade,
    producerName: anuncio.produtor_nome,
    producerId: anuncio.produtorId,
    nutritionalInfo: anuncio.info_nutricional || '',
    story: anuncio.historia || '',
    benefits: anuncio.beneficios || []
  }
}

/**
 * Formato para WhatsApp (mensagem de texto)
 */
function formatarWhatsApp(anuncio) {
  const emoji = getEmojiPorCategoria(anuncio.categoria)
  
  return {
    tipo: 'texto',
    mensagem: `${emoji} *Novo Produto Disponível!*

📦 ${anuncio.titulo}
💰 R$ ${anuncio.preco_unitario.toFixed(2)}/${anuncio.unidade}
📍 ${anuncio.localidade}
👨‍🌾 Produtor: ${anuncio.produtor_nome}

${anuncio.descricao}

🌿 Clique para falar com o produtor:
${gerarLinkWhatsApp(anuncio.contato_whatsapp, anuncio.titulo)}

🔗 Ver mais detalhes:
${process.env.FRONTEND_URL}/produto/${anuncio.id}`,
    imagem: anuncio.imagens[0] || null
  }
}

/**
 * Formato para Instagram (caption)
 */
function formatarInstagram(anuncio) {
  const hashtags = gerarHashtags(anuncio)
  
  return {
    tipo: 'post',
    caption: `${anuncio.titulo} 🌿

${anuncio.descricao}

💰 R$ ${anuncio.preco_unitario.toFixed(2)}/${anuncio.unidade}
📍 ${anuncio.localidade}

${hashtags}

🔗 Link na bio`,
    imagem: anuncio.imagens[0] || null
  }
}

/**
 * Formato para Telegram
 */
function formatarTelegram(anuncio) {
  return {
    tipo: 'mensagem',
    texto: `🌿 <b>${anuncio.titulo}</b>

${anuncio.descricao}

💰 <b>R$ ${anuncio.preco_unitario.toFixed(2)}/${anuncio.unidade}</b>
📍 ${anuncio.localidade}
👨‍🌾 ${anuncio.produtor_nome}

<a href="${process.env.FRONTEND_URL}/produto/${anuncio.id}">Ver detalhes</a>`,
    parse_mode: 'HTML',
    imagem: anuncio.imagens[0] || null
  }
}

/**
 * Publica em múltiplos canais
 */
export async function publicarEmCanais(anuncio, canais = ['marketplace']) {
  const resultados = []
  
  for (const canal of canais) {
    try {
      const conteudo = formatarParaCanal(anuncio, canal)
      
      // TODO: Implementar envio real para cada canal
      // Por enquanto, apenas simula publicação
      const resultado = await simularPublicacao(canal, conteudo)
      
      resultados.push({
        canal,
        status: 'sucesso',
        conteudo,
        timestamp: new Date().toISOString(),
        ...resultado
      })
    } catch (error) {
      resultados.push({
        canal,
        status: 'erro',
        erro: error.message,
        timestamp: new Date().toISOString()
      })
    }
  }
  
  return resultados
}

/**
 * Simula publicação (substituir por integração real)
 */
async function simularPublicacao(canal, conteudo) {
  await new Promise(resolve => setTimeout(resolve, 500))
  
  return {
    publicado: true,
    url: `${process.env.FRONTEND_URL}/anuncio/${Math.random().toString(36).substr(2, 9)}`
  }
}

/**
 * Helpers
 */
function getEmojiPorCategoria(categoria) {
  const emojis = {
    fruit: '🍊',
    oil: '🫒',
    handicraft: '🧺',
    honey: '🍯',
    flour: '🌾'
  }
  return emojis[categoria] || '🌿'
}

function gerarLinkWhatsApp(numero, produto) {
  const mensagem = encodeURIComponent(`Olá! Tenho interesse no produto: ${produto}`)
  return `https://wa.me/${numero.replace(/\D/g, '')}?text=${mensagem}`
}

function gerarHashtags(anuncio) {
  const tags = [
    '#CerradoBrasileiro',
    '#Bioeconomia',
    '#ProdutosNativos',
    '#Tocantins',
    '#ComercioJusto',
    '#Sustentabilidade'
  ]
  
  if (anuncio.categoria) {
    tags.push(`#${anuncio.categoria}`)
  }
  
  return tags.join(' ')
}
