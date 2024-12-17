import { defineStore } from 'pinia'
import { ref, type Ref } from 'vue'
import { login, register, sendVerificationCode, verifyEmailCode } from '@/api/auth'

interface User {
  email: string;
  id: string;
}

interface AuthResult {
  success: boolean;
  error?: string;
  data?: {
    user: User;
    token: string;
  };
}

export const useUserStore = defineStore('user', () => {
  const user: Ref<User | null> = ref(null)
  const isAuthenticated = ref(false)
  const loading = ref(true)

  const loginUser = async (email: string, password: string): Promise<AuthResult> => {
    try {
      const result = await login(email, password)
      if (result.success && result.data) {
        user.value = result.data.user
        isAuthenticated.value = true
        uni.setStorageSync('token', result.data.token)
        return { success: true }
      }
      return { success: false, error: result.error || '登录失败，请重试' }
    } catch (error: any) {
      console.error('Login error:', error)
      return {
        success: false,
        error: '登录失败，请重试'
      }
    }
  }

  const registerUser = async (email: string, password: string, code: string): Promise<AuthResult> => {
    try {
      const verifyResult = await verifyEmailCode(email, code)
      if (!verifyResult.success) {
        return verifyResult
      }

      const result = await register(email, password, code)
      if (result.success) {
        return { success: true }
      }
      return { success: false, error: result.error || '注册失败，请重试' }
    } catch (error: any) {
      console.error('Register error:', error)
      return {
        success: false,
        error: '注册失败，请重试'
      }
    }
  }

  const logoutUser = () => {
    user.value = null
    isAuthenticated.value = false
    uni.removeStorageSync('token')
  }

  const sendVerification = async (email: string): Promise<AuthResult> => {
    try {
      const result = await sendVerificationCode(email)
      return result
    } catch (error) {
      console.error('Send verification error:', error)
      return { success: false, error: '发送验证码失败，请重试' }
    }
  }

  const init = () => {
    const token = uni.getStorageSync('token')
    if (token) {
      isAuthenticated.value = true
      // TODO: Fetch user profile if needed
    }
    loading.value = false
  }

  return {
    user,
    isAuthenticated,
    loading,
    loginUser,
    registerUser,
    logoutUser,
    sendVerification,
    init
  }
})
