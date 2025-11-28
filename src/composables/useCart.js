import { reactive, computed } from 'vue'

const state = reactive({
  items: [],
  buyerType: 'consumer', // 'consumer' or 'reseller'
})

export function useCart() {
  const addItem = (product, quantity = 1) => {
    const existingItem = state.items.find(item => item.product.id === product.id)
    
    if (existingItem) {
      existingItem.quantity += quantity
    } else {
      state.items.push({
        product,
        quantity,
        addedAt: new Date().toISOString(),
      })
    }

    // Persist to localStorage
    localStorage.setItem('cart', JSON.stringify(state.items))
  }

  const removeItem = (productId) => {
    state.items = state.items.filter(item => item.product.id !== productId)
    localStorage.setItem('cart', JSON.stringify(state.items))
  }

  const updateQuantity = (productId, quantity) => {
    const item = state.items.find(item => item.product.id === productId)
    if (item) {
      item.quantity = quantity
      if (quantity <= 0) {
        removeItem(productId)
      } else {
        localStorage.setItem('cart', JSON.stringify(state.items))
      }
    }
  }

  const clearCart = () => {
    state.items = []
    localStorage.removeItem('cart')
  }

  const loadCart = () => {
    const savedCart = localStorage.getItem('cart')
    if (savedCart) {
      state.items = JSON.parse(savedCart)
    }
  }

  const setBuyerType = (type) => {
    state.buyerType = type // 'consumer' or 'reseller'
    localStorage.setItem('buyerType', type)
  }

  const loadBuyerType = () => {
    const saved = localStorage.getItem('buyerType')
    if (saved) {
      state.buyerType = saved
    }
  }

  // Calcula desconto por volume (apenas para mode revendedor)
  const getVolumeDiscount = () => {
    if (state.buyerType !== 'reseller') return 0

    const total = totalItems.value
    if (total >= 100) return 30
    if (total >= 50) return 20
    if (total >= 10) return 10
    return 0
  }

  const totalItems = computed(() => {
    return state.items.reduce((sum, item) => sum + item.quantity, 0)
  })

  const subtotal = computed(() => {
    return state.items.reduce((sum, item) => {
      return sum + (item.product.price * item.quantity)
    }, 0)
  })

  const discountAmount = computed(() => {
    const discount = getVolumeDiscount()
    return subtotal.value * (discount / 100)
  })

  const totalPrice = computed(() => {
    return subtotal.value - discountAmount.value
  })

  return {
    items: computed(() => state.items),
    buyerType: computed(() => state.buyerType),
    addItem,
    removeItem,
    updateQuantity,
    clearCart,
    loadCart,
    setBuyerType,
    loadBuyerType,
    getVolumeDiscount,
    totalItems,
    subtotal,
    discountAmount,
    totalPrice,
  }
}
