import { defineStore } from 'pinia'
import { ref } from 'vue'
import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  type User
} from 'firebase/auth'
import { auth } from '@/config/firebase'

// UniApp types are globally available in the runtime
export const useUserStore = defineStore('user', () => {
  const user = ref<User | null>(null)
  const isAuthenticated = ref(false)
  const loading = ref(true)

  const login = async (email: string, password: string) => {
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password)
      user.value = userCredential.user
      isAuthenticated.value = true
      return { success: true }
    } catch (error: any) {
      console.error('Login error:', error)
      return {
        success: false,
        error: error.code === 'auth/invalid-credential'
          ? '邮箱或密码错误'
          : '登录失败，请重试'
      }
    }
  }

  const register = async (email: string, password: string) => {
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password)
      user.value = userCredential.user
      isAuthenticated.value = true
      return { success: true }
    } catch (error: any) {
      console.error('Register error:', error)
      return {
        success: false,
        error: error.code === 'auth/email-already-in-use'
          ? '该邮箱已被注册'
          : '注册失败，请重试'
      }
    }
  }

  const logout = async () => {
    try {
      await signOut(auth)
      user.value = null
      isAuthenticated.value = false
      uni.removeStorageSync('token')
    } catch (error) {
      console.error('Logout error:', error)
    }
  }

  const init = () => {
    onAuthStateChanged(auth, (firebaseUser) => {
      user.value = firebaseUser
      isAuthenticated.value = !!firebaseUser
      loading.value = false
    })
  }

  return {
    user,
    isAuthenticated,
    loading,
    login,
    register,
    logout,
    init
  }
})
