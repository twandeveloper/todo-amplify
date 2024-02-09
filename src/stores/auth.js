import { ref } from 'vue'
import { defineStore } from 'pinia'

export const useAuthStore = defineStore('auth.store', () => {
  const auth = ref({})

  return { auth }
})
