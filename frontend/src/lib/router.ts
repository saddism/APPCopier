import { Router } from '@tanstack/react-router'

// Import routes
import { rootRoute } from '@/routes/root'
import { indexRoute } from '@/routes/index'
import { loginRoute } from '@/routes/auth/login'
import { registerRoute } from '@/routes/auth/register'
import { uploadRoute } from '@/routes/upload'
import { productListRoute, productDetailRoute } from '@/routes/products'
import { dashboardRoute } from '@/routes/dashboard'

// SEO-friendly route configuration with language support
export const routeConfig = {
  home: '/',
  auth: {
    login: '/login',
    register: '/register'
  },
  dashboard: '/dashboard',
  products: {
    list: '/products',
    details: '/products/:slug'
  },
  upload: '/upload',
  languages: {
    zh: '/zh',
    en: '/en'
  }
}

// Create route tree with all routes
const routeTree = rootRoute.addChildren([
  indexRoute,
  loginRoute,
  registerRoute,
  uploadRoute,
  productListRoute,
  productDetailRoute,
  dashboardRoute,
])

// Configure router with preloading
export const router = new Router({
  routeTree,
  defaultPreload: 'intent',
})

declare module '@tanstack/react-router' {
  interface Register {
    router: typeof router
  }
}
