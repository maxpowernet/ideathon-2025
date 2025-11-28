import { createRouter, createWebHistory } from 'vue-router'
import { useAuthStore } from '@/composables/useAuth'

// Views
import FeedPublico from '@/views/FeedPublico.vue'
import ProducerDash from '@/views/ProducerDash.vue'
import ProducerOrders from '@/views/ProducerOrders.vue'
import CartCheckout from '@/views/CartCheckout.vue'
import OrderHistory from '@/views/OrderHistory.vue'

const routes = [
  {
    path: '/',
    name: 'feed',
    component: FeedPublico,
    meta: { requiresAuth: false, title: 'Cerrado Certo Conectado' }
  },
  {
    path: '/produtor',
    name: 'producer',
    component: ProducerDash,
    meta: { requiresAuth: true, role: 'producer', title: 'Painel do Produtor' }
  },
  {
    path: '/produtor/pedidos',
    name: 'producer-orders',
    component: ProducerOrders,
    meta: { requiresAuth: true, role: 'producer', title: 'Pedidos Recebidos' }
  },
  {
    path: '/revendedor',
    name: 'reseller',
    component: FeedPublico,
    meta: { requiresAuth: true, role: 'reseller', title: 'Painel do Revendedor' }
  },
  {
    path: '/carrinho',
    name: 'cart',
    component: CartCheckout,
    meta: { requiresAuth: false, title: 'Finalizar Pedido' }
  },
  {
    path: '/pedidos',
    name: 'orders',
    component: OrderHistory,
    meta: { requiresAuth: true, title: 'Meus Pedidos' }
  },
]

const router = createRouter({
  history: createWebHistory(),
  routes,
  scrollBehavior(to, from, savedPosition) {
    if (savedPosition) {
      return savedPosition
    } else {
      return { top: 0, behavior: 'smooth' }
    }
  }
})

// Navigation guard for protected routes
router.beforeEach((to, from, next) => {
  const authStore = useAuthStore()
  
  // Update page title
  document.title = to.meta.title || 'Vitrine da Bioeconomia do Cerrado'
  
  // Check if route requires authentication
  if (to.meta.requiresAuth && !authStore.isAuthenticated) {
    // Redirect to home and show login prompt
    authStore.showLoginPrompt = true
    next({ name: 'home' })
  } else {
    next()
  }
})

export default router
