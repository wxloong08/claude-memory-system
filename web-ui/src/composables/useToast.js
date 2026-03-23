import { ref } from 'vue'

const toasts = ref([])
let nextId = 0

export function useToast() {
  function addToast(message, type = 'info', duration = 4000) {
    const id = nextId++
    toasts.value.push({ id, message, type })
    if (duration > 0) {
      setTimeout(() => removeToast(id), duration)
    }
  }
  function removeToast(id) {
    toasts.value = toasts.value.filter(t => t.id !== id)
  }
  function success(msg) { addToast(msg, 'success') }
  function error(msg) { addToast(msg, 'error', 6000) }
  function info(msg) { addToast(msg, 'info') }

  return { toasts, addToast, removeToast, success, error, info }
}
