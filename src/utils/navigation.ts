import { useUserStore } from '@/stores/user'

// Navigation interceptor for protected routes
uni.addInterceptor('navigateTo', {
  invoke(e) {
    const userStore = useUserStore()
    const protectedRoutes = [
      '/pages/upload/',
      '/pages/products/detail',
      '/pages/dashboard/'
    ]

    // Check if the target route is protected
    const isProtectedRoute = protectedRoutes.some(route => e.url.includes(route))

    if (isProtectedRoute && !userStore.isAuthenticated) {
      uni.showToast({
        title: '请先登录',
        icon: 'none'
      })
      uni.navigateTo({ url: '/pages/auth/login' })
      return false
    }
    return true
  }
})

// Switch back interceptor for protected routes
uni.addInterceptor('switchTab', {
  invoke(e) {
    const userStore = useUserStore()
    const protectedTabs = [
      '/pages/upload/index',
      '/pages/dashboard/index'
    ]

    if (protectedTabs.includes(e.url) && !userStore.isAuthenticated) {
      uni.showToast({
        title: '请先登录',
        icon: 'none'
      })
      uni.navigateTo({ url: '/pages/auth/login' })
      return false
    }
    return true
  }
})
