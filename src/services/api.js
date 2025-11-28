/**
 * Cliente da API do Backend
 */

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001/api'

class ApiClient {
  constructor(baseURL) {
    this.baseURL = baseURL
  }

  async request(endpoint, options = {}) {
    const url = `${this.baseURL}${endpoint}`
    const config = {
      headers: {
        'Content-Type': 'application/json',
        ...options.headers
      },
      ...options
    }

    try {
      const response = await fetch(url, config)
      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Erro na requisição')
      }

      return data
    } catch (error) {
      console.error(`API Error (${endpoint}):`, error)
      throw error
    }
  }

  // IA - Visão Computacional
  async classificarImagem(imagemBase64) {
    return this.request('/ia/classificar', {
      method: 'POST',
      body: JSON.stringify({ imagemBase64 })
    })
  }

  async getProdutosSuportados() {
    return this.request('/ia/produtos-suportados')
  }

  // Precificação
  async sugerirPreco({ produto, qualidade, quantidade, unidade, regiao }) {
    return this.request('/preco/sugerir', {
      method: 'POST',
      body: JSON.stringify({ produto, qualidade, quantidade, unidade, regiao })
    })
  }

  async getPrecosReferencia() {
    return this.request('/preco/referencias')
  }

  // Anúncios
  async getAnuncios(filtros = {}) {
    const params = new URLSearchParams(filtros)
    return this.request(`/anuncios?${params}`)
  }

  async getAnuncio(id) {
    return this.request(`/anuncios/${id}`)
  }

  async criarAnuncio(dados) {
    return this.request('/anuncios', {
      method: 'POST',
      body: JSON.stringify(dados)
    })
  }

  async atualizarAnuncio(id, dados) {
    return this.request(`/anuncios/${id}`, {
      method: 'PUT',
      body: JSON.stringify(dados)
    })
  }

  async deletarAnuncio(id) {
    return this.request(`/anuncios/${id}`, {
      method: 'DELETE'
    })
  }

  // Upload de Imagens
  async uploadImagem(file) {
    const formData = new FormData()
    formData.append('imagem', file)

    return fetch(`${this.baseURL}/upload/imagem`, {
      method: 'POST',
      body: formData
    }).then(res => res.json())
  }

  async uploadMultiplasImagens(files) {
    const formData = new FormData()
    files.forEach(file => formData.append('imagens', file))

    return fetch(`${this.baseURL}/upload/multiplas`, {
      method: 'POST',
      body: formData
    }).then(res => res.json())
  }

  // Converter imagem para base64
  fileToBase64(file) {
    return new Promise((resolve, reject) => {
      const reader = new FileReader()
      reader.readAsDataURL(file)
      reader.onload = () => resolve(reader.result)
      reader.onerror = error => reject(error)
    })
  }
}

export const api = new ApiClient(API_BASE_URL)
export default api
