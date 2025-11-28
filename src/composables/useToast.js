import { reactive } from 'vue'

const state = reactive({
  toasts: []
})

let nextId = 0

export function useToast() {
  const addToast = (message, type = 'info', duration = 3000) => {
    const id = nextId++
    const toast = {
      id,
      message,
      type, // 'success', 'error', 'info', 'warning'
      duration
    }
    
    state.toasts.push(toast)
    
    if (duration > 0) {
      setTimeout(() => {
        removeToast(id)
      }, duration)
    }
    
    return id
  }
  
  const removeToast = (id) => {
    const index = state.toasts.findIndex(t => t.id === id)
    if (index > -1) {
      state.toasts.splice(index, 1)
    }
  }
  
  const success = (message, duration) => addToast(message, 'success', duration)
  const error = (message, duration) => addToast(message, 'error', duration)
  const info = (message, duration) => addToast(message, 'info', duration)
  const warning = (message, duration) => addToast(message, 'warning', duration)
  
  return {
    toasts: state.toasts,
    addToast,
    removeToast,
    success,
    error,
    info,
    warning
  }
}
