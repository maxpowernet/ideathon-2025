<template>
  <div class="min-h-screen">
    <!-- Hero Section -->
    <section class="gradient-cerrado text-white py-12 px-4">
      <div class="container mx-auto max-w-4xl text-center space-y-4">
        <h1 class="text-3xl sm:text-4xl font-bold">
          🌿 Cerrado Certo Conectado
        </h1>
        <p class="text-lg sm:text-xl opacity-90">
          Conectando produtores do Sul do Tocantins aos compradores conscientes
        </p>
      </div>
    </section>

    <!-- Search & Filters Section -->
    <section class="sticky top-16 z-30 bg-white/95 backdrop-blur-sm shadow-sm py-4 px-4">
      <div class="container mx-auto max-w-6xl space-y-3">
        <!-- Search Bar -->
        <div class="relative">
          <div class="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
            <svg class="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>
          <input
            v-model="searchQuery"
            type="text"
            placeholder="Buscar produtos do Cerrado..."
            class="w-full pl-12 pr-4 py-3 bg-white rounded-full border-2 border-gray-200 focus:border-cerrado-green focus:outline-none transition-colors text-base"
          />
          <button
            v-if="searchQuery"
            @click="searchQuery = ''"
            class="absolute inset-y-0 right-0 pr-4 flex items-center"
          >
            <svg class="w-5 h-5 text-gray-400 hover:text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <!-- Filters -->
        <div class="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-hide">
          <button
            v-for="category in categories"
            :key="category.id"
            @click="selectedCategory = category.id"
            class="chip whitespace-nowrap"
            :class="{ 'active': selectedCategory === category.id }"
          >
            {{ category.icon }} {{ category.name }}
          </button>
        </div>
      </div>
    </section>

    <!-- Products Grid -->
    <section class="py-8 px-4">
      <div class="container mx-auto max-w-6xl">
        <!-- Loading State -->
        <div v-if="loading" class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <div v-for="n in 8" :key="n" class="card animate-pulse">
            <div class="aspect-square bg-gray-200 rounded-xl mb-3"></div>
            <div class="h-4 bg-gray-200 rounded mb-2"></div>
            <div class="h-3 bg-gray-200 rounded w-2/3"></div>
          </div>
        </div>

        <!-- Products -->
        <div v-else-if="filteredProducts.length > 0" class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <ProductCard 
            v-for="product in filteredProducts"
            :key="product.id"
            :product="product"
            @click="openEducationalModal"
            class="animate-fade-in"
          />
        </div>

        <!-- Empty State -->
        <div v-else class="text-center py-16">
          <svg class="w-24 h-24 mx-auto text-gray-300 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
          </svg>
          <h3 class="text-xl font-semibold text-gray-600 mb-2">Nenhum produto encontrado</h3>
          <p class="text-gray-500">Tente selecionar outra categoria</p>
        </div>
      </div>
    </section>

    <!-- Floating Action Button (Producer) -->
    <button 
      v-if="authStore.isProducer"
      @click="showQuickCapture = true"
      class="fab"
      aria-label="Vender produto"
    >
      <svg class="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
      </svg>
    </button>

    <!-- Educational Modal -->
    <EducationalModal 
      v-model="showEducationalModal"
      :product="selectedProduct"
      @close="showEducationalModal = false"
    />

    <!-- Quick Capture Modal -->
    <QuickCapture 
      v-model="showQuickCapture"
      @close="showQuickCapture = false"
      @published="handleProductPublished"
    />
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import ProductCard from '@/components/ProductCard.vue'
import EducationalModal from '@/components/EducationalModal.vue'
import QuickCapture from '@/components/QuickCapture.vue'
import { useAuthStore } from '@/composables/useAuth'

const authStore = useAuthStore()

const categories = [
  { id: 'all', name: 'Todos', icon: '🌟' },
  { id: 'fruit', name: 'Frutas', icon: '🍊' },
  { id: 'oil', name: 'Óleos', icon: '🫒' },
  { id: 'handicraft', name: 'Artesanato', icon: '🧺' },
  { id: 'honey', name: 'Mel', icon: '🍯' },
  { id: 'flour', name: 'Farinhas', icon: '🌾' },
]

const selectedCategory = ref('all')
const searchQuery = ref('')
const loading = ref(true)
const products = ref([])
const showEducationalModal = ref(false)
const showQuickCapture = ref(false)
const selectedProduct = ref(null)

// Mock products data
const mockProducts = [
  {
    id: '1',
    name: 'Baru em Amêndoas',
    description: 'Castanha do cerrado rica em proteínas e minerais',
    price: 28.50,
    unit: 'kg',
    category: 'fruit',
    image: 'https://images.unsplash.com/photo-1508747703725-719777637510?w=400',
    origin: 'Gurupi/TO',
    producerName: 'João Silva',
    producerId: 'prod1',
    nutritionalInfo: 'Rico em proteínas, fibras, zinco e vitamina E',
    story: 'Extraído de forma sustentável por comunidades tradicionais do cerrado tocantinense.',
    benefits: ['Fortalece o sistema imunológico', 'Alto valor proteico', 'Sustentável']
  },
  {
    id: '2',
    name: 'Óleo de Pequi Artesanal',
    description: 'Óleo puro extraído da polpa do pequi',
    price: 45.00,
    unit: '500ml',
    category: 'oil',
    image: 'https://images.unsplash.com/photo-1474979266404-7eaacbcd87c5?w=400',
    origin: 'Dueré/TO',
    producerName: 'Maria Santos',
    producerId: 'prod2',
    nutritionalInfo: 'Alto teor de vitamina A e ácidos graxos essenciais',
    story: 'Produzido artesanalmente por mulheres extrativistas da região.',
    benefits: ['Propriedades antioxidantes', 'Uso culinário e cosmético', 'Economia familiar']
  },
  {
    id: '3',
    name: 'Cesta de Capim Dourado',
    description: 'Artesanato tradicional com capim dourado do Jalapão',
    price: 120.00,
    unit: 'unidade',
    category: 'handicraft',
    image: 'https://images.unsplash.com/photo-1523293182086-7651a899d37f?w=400',
    origin: 'Porto Nacional/TO',
    producerName: 'Ana Costa',
    producerId: 'prod3',
    nutritionalInfo: 'Artesanato sustentável',
    story: 'Tradição centenária passada de geração em geração pelas artesãs do Jalapão.',
    benefits: ['Produto único', 'Comércio justo', 'Preservação cultural']
  },
  {
    id: '4',
    name: 'Mel de Abelha Nativa',
    description: 'Mel orgânico de abelhas sem ferrão',
    price: 65.00,
    unit: '250g',
    category: 'honey',
    image: 'https://images.unsplash.com/photo-1558642452-9d2a7deb7f62?w=400',
    origin: 'Alvorada/TO',
    producerName: 'Pedro Oliveira',
    producerId: 'prod4',
    nutritionalInfo: 'Propriedades medicinais e antibacterianas',
    story: 'Produzido por meliponicultores que preservam as abelhas nativas do cerrado.',
    benefits: ['Medicinal', 'Sustentável', 'Sabor único']
  },
  {
    id: '5',
    name: 'Farinha de Babaçu',
    description: 'Farinha nutritiva extraída do coco babaçu',
    price: 18.00,
    unit: '500g',
    category: 'flour',
    image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSa42Ki7TN780Au6xtGUIICIZ_3G8y-YqBEqw&s',
    origin: 'Formoso do Araguaia/TO',
    producerName: 'Cooperativa Babaçu Livre',
    producerId: 'coop1',
    nutritionalInfo: 'Rica em fibras e gorduras saudáveis',
    story: 'Produzida por quebradeiras de coco em regime de economia solidária.',
    benefits: ['Gluten-free', 'Versátil', 'Economia social']
  },
  {
    id: '6',
    name: 'Polpa de Buriti Congelada',
    description: 'Polpa pura de buriti, fruta símbolo do cerrado',
    price: 22.00,
    unit: 'kg',
    category: 'fruit',
    image: 'https://images.unsplash.com/photo-1519996529931-28324d5a630e?w=400',
    origin: 'Lagoa da Confusão/TO',
    producerName: 'Carlos Mendes',
    producerId: 'prod5',
    nutritionalInfo: 'Maior fonte natural de vitamina A',
    story: 'Colhido em áreas de preservação permanente, sem dano às palmeiras.',
    benefits: ['Super antioxidante', 'Sabor exótico', 'Baixo impacto ambiental']
  },
  {
    id: '7',
    name: 'Almesca',
    description: 'Fruto nativo do cerrado com polpa doce e aromática',
    price: 15.00,
    unit: 'kg',
    category: 'fruit',
    image: 'https://images.unsplash.com/photo-1601493700631-2b16ec4b4716?w=400',
    origin: 'Gurupi/TO',
    producerName: 'José Pereira',
    producerId: 'prod6',
    nutritionalInfo: 'Rico em vitamina C e antioxidantes',
    story: 'Coletada de forma sustentável por comunidades extrativistas locais.',
    benefits: ['Sabor único', 'Fonte de vitamina C', 'Extrativismo sustentável']
  },
  {
    id: '8',
    name: 'Buriti',
    description: 'Fruta do cerrado rica em betacaroteno',
    price: 20.00,
    unit: 'kg',
    category: 'fruit',
    image: 'https://images.unsplash.com/photo-1528821128474-27f963b062bf?w=400',
    origin: 'Dueré/TO',
    producerName: 'Francisca Lima',
    producerId: 'prod7',
    nutritionalInfo: 'Altíssimo teor de vitamina A e ômegas 3, 6 e 9',
    story: 'Colhida manualmente preservando as palmeiras centenárias do cerrado.',
    benefits: ['Super alimento', 'Óleo nobre', 'Preservação ambiental']
  },
  {
    id: '9',
    name: 'Bacupari',
    description: 'Fruto exótico do cerrado de sabor agridoce',
    price: 35.00,
    unit: 'kg',
    category: 'fruit',
    image: 'https://images.unsplash.com/photo-1577234286642-fc512a5f8f11?w=400',
    origin: 'Porto Nacional/TO',
    producerName: 'Manoel Rodrigues',
    producerId: 'prod8',
    nutritionalInfo: 'Rico em vitaminas do complexo B e minerais',
    story: 'Fruto raro coletado em pequenas quantidades por conhecedores do cerrado.',
    benefits: ['Sabor marcante', 'Raro e especial', 'Biodiversidade']
  },
  {
    id: '10',
    name: 'Murici',
    description: 'Pequena fruta amarela de aroma intenso e sabor marcante',
    price: 18.00,
    unit: 'kg',
    category: 'fruit',
    image: 'https://images.unsplash.com/photo-1590301157890-4810ed352733?w=400',
    origin: 'Alvorada/TO',
    producerName: 'Rita Souza',
    producerId: 'prod9',
    nutritionalInfo: 'Alto teor de vitamina C e fibras',
    story: 'Colhida à mão em áreas de cerrado preservado, ideal para sucos e doces.',
    benefits: ['Aroma único', 'Versátil', 'Tradicional']
  },
  {
    id: '11',
    name: 'Curriola',
    description: 'Fruta nativa do cerrado com polpa suculenta',
    price: 25.00,
    unit: 'kg',
    category: 'fruit',
    image: 'https://images.unsplash.com/photo-1560806887-1e4cd0b6cbd6?w=400',
    origin: 'Formoso do Araguaia/TO',
    producerName: 'Sebastião Martins',
    producerId: 'prod10',
    nutritionalInfo: 'Rica em fibras e compostos bioativos',
    story: 'Fruto tradicional coletado por gerações de extrativistas do sul do Tocantins.',
    benefits: ['Sabor refrescante', 'Propriedades nutricionais', 'Cultura local']
  },
  {
    id: '12',
    name: 'Cagaita',
    description: 'Fruta típica do cerrado de sabor ácido e refrescante',
    price: 12.00,
    unit: 'kg',
    category: 'fruit',
    image: 'https://www.cerratinga.org.br/site/wp-content/uploads/2021/09/cagaita-frutos-dodesign-s.jpg',
    origin: 'Gurupi/TO',
    producerName: 'Luiza Ferreira',
    producerId: 'prod11',
    nutritionalInfo: 'Rica em vitamina C e propriedades laxativas naturais',
    story: 'Colhida no auge da safra por famílias que conhecem profundamente o cerrado.',
    benefits: ['Sabor marcante', 'Propriedades digestivas', 'Tradicional do cerrado']
  },
]

const filteredProducts = computed(() => {
  let filtered = products.value

  // Filter by category
  if (selectedCategory.value !== 'all') {
    filtered = filtered.filter(p => p.category === selectedCategory.value)
  }

  // Filter by search query
  if (searchQuery.value.trim()) {
    const query = searchQuery.value.toLowerCase()
    filtered = filtered.filter(p => 
      p.name.toLowerCase().includes(query) || 
      p.description.toLowerCase().includes(query) ||
      p.producerName.toLowerCase().includes(query) ||
      p.origin.toLowerCase().includes(query)
    )
  }

  return filtered
})

onMounted(() => {
  // Simulate API call
  setTimeout(() => {
    products.value = mockProducts
    loading.value = false
  }, 800)
})

const openEducationalModal = (product) => {
  selectedProduct.value = product
  showEducationalModal.value = true
}

const handleProductPublished = (newProduct) => {
  products.value.unshift(newProduct)
  showQuickCapture.value = false
}
</script>

<style scoped>
.scrollbar-hide {
  -ms-overflow-style: none;
  scrollbar-width: none;
}

.scrollbar-hide::-webkit-scrollbar {
  display: none;
}
</style>
