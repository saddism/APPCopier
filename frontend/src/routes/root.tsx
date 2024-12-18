import { RootRoute } from '@tanstack/react-router'
import { Outlet, Link } from '@tanstack/react-router'
import { AuthProvider } from '@/providers/AuthProvider'
import { Helmet } from 'react-helmet-async'
import { ToastProvider, ToastViewport } from '@/components/ui/toast'
import { useAuth } from '@/hooks/use-auth'

const Navigation = () => {
  const { user, signOut } = useAuth()

  return (
    <nav className="bg-white shadow-sm">
      <div className="container mx-auto px-4 py-4 flex justify-between items-center">
        <Link to="/" className="text-xl font-bold">APP视频分析系统</Link>
        <div className="space-x-4">
          {user ? (
            <>
              <Link to="/dashboard" className="text-gray-600 hover:text-gray-900">控制台</Link>
              <button onClick={signOut} className="text-gray-600 hover:text-gray-900">退出</button>
            </>
          ) : (
            <>
              <Link to="/login" className="text-gray-600 hover:text-gray-900">登录</Link>
              <Link to="/register" className="text-gray-600 hover:text-gray-900">注册</Link>
            </>
          )}
        </div>
      </div>
    </nav>
  )
}

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
        <Navigation />
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
