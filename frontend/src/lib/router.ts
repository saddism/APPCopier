import { Router } from '@tanstack/react-router'
import { createElement } from 'react'

// Import routes
import { rootRoute } from '@/routes/root'
import { indexRoute } from '@/routes/index'
import { loginRoute } from '@/routes/auth/login'
import { registerRoute } from '@/routes/auth/register'
import { uploadRoute } from '@/routes/upload'
import { productListRoute } from '@/routes/products'
import { productDetailRoute } from '@/routes/products/[id]'
import { dashboardRoute } from '@/routes/dashboard'

// SEO-friendly route configuration with language support
export const routeConfig = {
  home: '/',
  auth: {
    login: '/auth/login',
    register: '/auth/register'
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

// Configure router with preloading and loading component
export const router = new Router({
  routeTree,
  defaultPreload: 'intent',
  defaultPendingComponent: () => createElement('div', {
    className: 'flex items-center justify-center min-h-screen',
    children: createElement('div', {
      className: 'animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-blue-500'
    })
  }),
})

declare module '@tanstack/react-router' {
  interface Register {
    router: typeof router
  }
}
