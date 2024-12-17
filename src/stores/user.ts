import { defineStore } from 'pinia'
import { ref } from 'vue'

// UniApp types are globally available in the runtime
export const useUserStore = defineStore('user', () => {
  const token = ref('')
  const user = ref<any>(null)
  const isAuthenticated = ref(false)

  const setToken = (newToken: string) => {
    token.value = newToken
    uni.setStorageSync('token', newToken)
  }

  const setUser = (userData: any) => {
    user.value = userData
    isAuthenticated.value = !!userData
  }

  const logout = () => {
    token.value = ''
    user.value = null
    isAuthenticated.value = false
    uni.removeStorageSync('token')
  }

  const init = () => {
    const savedToken = uni.getStorageSync('token')
    if (savedToken) {
      token.value = savedToken
      isAuthenticated.value = true
      // TODO: Fetch user data if needed
    }
  }

  return {
    token,
    user,
    isAuthenticated,
    setToken,
    setUser,
    logout,
    init
  }
})
