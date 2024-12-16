import { RootRoute } from '@tanstack/react-router'
import { Outlet } from '@tanstack/react-router'
import { AuthProvider } from '@/providers/AuthProvider'
import { Helmet } from 'react-helmet-async'
import { ToastProvider, ToastViewport } from '@/components/ui/toast'
import { Layout } from '@/components/Layout'
import { useTranslation } from '@/lib/translations'

export const rootRoute = new RootRoute({
  component: () => {
    const { t } = useTranslation()

    return (
      <AuthProvider>
        <Layout>
          <Helmet>
            <meta charSet="utf-8" />
            <meta name="viewport" content="width=device-width, initial-scale=1" />
            <meta name="description" content={t('meta.description')} />
            <meta name="keywords" content={t('meta.keywords')} />
            <link rel="canonical" href="/" />
          </Helmet>
          <ToastProvider>
            <div className="min-h-screen bg-gray-100">
              <div className="container mx-auto px-4 py-8">
                <Outlet />
              </div>
            </div>
            <ToastViewport />
          </ToastProvider>
        </Layout>
      </AuthProvider>
    )
  },
})
