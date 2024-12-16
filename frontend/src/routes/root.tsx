import { RootRoute } from '@tanstack/react-router'
import { Outlet } from '@tanstack/react-router'
import { AuthProvider } from '@/providers/AuthProvider'
import { Helmet } from 'react-helmet-async'
import { ToastProvider, ToastViewport } from '@/components/ui/toast'

export const rootRoute = new RootRoute({
  component: () => (
    <AuthProvider>
      <Helmet>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta name="description" content="APP视频分析系统 - 智能分析APP功能和生成PRD文档" />
        <meta name="keywords" content="APP分析,视频分析,PRD生成,功能分析" />
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
    </AuthProvider>
  ),
})
