import { createRouter, createWebHistory } from 'vue-router'
import { useUserStore } from '../stores/user'

const routes = [
  {
    path: '/',
    name: 'Home',
    component: () => import('../pages/index/index.vue')
  },
  {
    path: '/upload',
    name: 'Upload',
    component: () => import('../pages/upload/index.vue')
  },
  {
    path: '/auth/login',
    name: 'Login',
    component: () => import('../pages/auth/login.vue')
  },
  {
    path: '/auth/register',
    name: 'Register',
    component: () => import('../pages/auth/register.vue')
  },
  {
    path: '/dashboard',
    name: 'Dashboard',
    component: () => import('../pages/dashboard/index.vue')
  },
  {
    path: '/products',
    name: 'Products',
    component: () => import('../pages/products/index.vue')
  },
  {
    path: '/products/detail',
    name: 'ProductDetail',
    component: () => import('../pages/products/detail.vue')
  }
]

// Create router instance for H5/Web platform
const router = createRouter({
  history: createWebHistory('/'),
  routes
})

// Navigation guard for protected routes
router.beforeEach((to, from, next) => {
  const userStore = useUserStore()
  const protectedRoutes = ['/upload', '/products/detail', '/dashboard']

  if (protectedRoutes.includes(to.path) && !userStore.isAuthenticated) {
    next('/auth/login')
  } else {
    next()
  }
})

export default router
