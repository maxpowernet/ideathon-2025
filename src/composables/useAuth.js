import { reactive, computed } from 'vue'

const state = reactive({
  user: null,
  isAuthenticated: false,
  showLoginPrompt: false,
})

export function useAuthStore() {
  const checkAuth = () => {
    // Check localStorage for existing session
    const savedUser = localStorage.getItem('user')
    if (savedUser) {
      state.user = JSON.parse(savedUser)
      state.isAuthenticated = true
    }
  }

  const login = async (email, password, type = 'buyer') => {
    // Simulate authentication - Replace with Firebase Auth
    const user = {
      id: Date.now().toString(),
      email,
      type, // 'producer' or 'buyer'
      name: email.split('@')[0],
      createdAt: new Date().toISOString(),
    }
    
    state.user = user
    state.isAuthenticated = true
    state.showLoginPrompt = false
    
    localStorage.setItem('user', JSON.stringify(user))
    return user
  }

  const logout = () => {
    state.user = null
    state.isAuthenticated = false
    localStorage.removeItem('user')
  }

  const isProducer = computed(() => state.user?.type === 'producer')
  const userRole = computed(() => state.user?.type || 'buyer')

  return {
    user: computed(() => state.user),
    isAuthenticated: computed(() => state.isAuthenticated),
    showLoginPrompt: computed({
      get: () => state.showLoginPrompt,
      set: (val) => { state.showLoginPrompt = val }
    }),
    checkAuth,
    login,
    logout,
    isProducer,
    userRole,
  }
}

export function useAuth() {
  return useAuthStore()
}
