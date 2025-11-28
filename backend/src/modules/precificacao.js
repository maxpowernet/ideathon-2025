/**
 * Módulo de Precificação Dinâmica
 * Sugere preços baseados em produto, qualidade e região
 */

// Tabela de preços de referência (valores médios em R$ por kg/unidade)
const PRECOS_REFERENCIA = {
  'baru': { base: 28.50, unidade: 'kg', range: [25, 35] },
  'pequi': { base: 48.00, unidade: 'kg', range: [40, 60] },
  'buriti': { base: 22.00, unidade: 'kg', range: [18, 28] },
  'mel': { base: 65.00, unidade: '250g', range: [50, 80] },
  'capim-dourado': { base: 120.00, unidade: 'unidade', range: [80, 180] },
  'babaçu': { base: 18.00, unidade: '500g', range: [15, 25] },
  'almesca': { base: 15.00, unidade: 'kg', range: [12, 20] },
  'bacupari': { base: 35.00, unidade: 'kg', range: [28, 45] },
  'murici': { base: 18.00, unidade: 'kg', range: [15, 22] },
  'curriola': { base: 25.00, unidade: 'kg', range: [20, 32] },
  'cagaita': { base: 12.00, unidade: 'kg', range: [10, 16] }
}

// Multiplicadores de qualidade
const MULTIPLICADORES_QUALIDADE = {
  'baixa': 0.75,
  'media': 1.0,
  'premium': 1.35
}

// Ajustes regionais (Sul do Tocantins)
const AJUSTES_REGIONAIS = {
  'Gurupi-TO': 1.0,
  'Dueré-TO': 0.95,
  'Porto Nacional-TO': 1.05,
  'Alvorada-TO': 0.98,
  'Formoso do Araguaia-TO': 0.93,
  'Lagoa da Confusão-TO': 0.92,
  'default': 1.0
}

/**
 * Calcula preço sugerido para um produto
 * @param {Object} params - { produto, qualidade, quantidade, unidade, regiao }
 * @returns {Object} - { preco_sugerido_unidade, preco_total, moeda, detalhes }
 */
export function sugerirPreco({ produto, qualidade = 'media', quantidade = 1, unidade, regiao = 'default' }) {
  // Normalizar produto (lowercase, sem acentos)
  const produtoNorm = produto.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '')
  
  // Buscar preço base
  const precoRef = PRECOS_REFERENCIA[produtoNorm]
  if (!precoRef) {
    throw new Error(`Produto "${produto}" não encontrado na tabela de preços`)
  }
  
  // Aplicar multiplicador de qualidade
  const multQualidade = MULTIPLICADORES_QUALIDADE[qualidade] || 1.0
  
  // Aplicar ajuste regional
  const ajusteRegional = AJUSTES_REGIONAIS[regiao] || AJUSTES_REGIONAIS['default']
  
  // Calcular preço sugerido
  const precoBase = precoRef.base
  const precoSugerido = precoBase * multQualidade * ajusteRegional
  
  // Garantir que está dentro do range
  const [min, max] = precoRef.range
  const precoFinal = Math.max(min, Math.min(max, precoSugerido))
  
  const precoTotal = precoFinal * quantidade
  
  return {
    preco_sugerido_unidade: parseFloat(precoFinal.toFixed(2)),
    preco_total: parseFloat(precoTotal.toFixed(2)),
    moeda: 'BRL',
    unidade: unidade || precoRef.unidade,
    detalhes: {
      preco_base: precoBase,
      qualidade,
      multiplicador_qualidade: multQualidade,
      ajuste_regional: ajusteRegional,
      regiao,
      quantidade,
      range_mercado: precoRef.range
    }
  }
}

/**
 * Lista todos os produtos com preços de referência
 */
export function listarPrecosReferencia() {
  return Object.entries(PRECOS_REFERENCIA).map(([produto, info]) => ({
    produto,
    preco_base: info.base,
    unidade: info.unidade,
    range: info.range
  }))
}

/**
 * Atualizar preço de referência (admin)
 */
export function atualizarPrecoReferencia(produto, novoPreco, novaUnidade) {
  const produtoNorm = produto.toLowerCase()
  
  if (!PRECOS_REFERENCIA[produtoNorm]) {
    throw new Error(`Produto "${produto}" não encontrado`)
  }
  
  PRECOS_REFERENCIA[produtoNorm].base = novoPreco
  if (novaUnidade) {
    PRECOS_REFERENCIA[produtoNorm].unidade = novaUnidade
  }
  
  return {
    success: true,
    produto: produtoNorm,
    novo_preco: novoPreco,
    unidade: PRECOS_REFERENCIA[produtoNorm].unidade
  }
}
