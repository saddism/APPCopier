import { Route } from '@tanstack/react-router'
import { useAuthContext } from '../providers/AuthProvider'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { useState } from 'react'
import { Helmet } from 'react-helmet-async'
import { rootRoute } from '@/routes/root'

export const authRoute = new Route({
  getParentRoute: () => rootRoute,
  path: '/auth',
  component: () => {
    const { signIn, signUp, loading, error } = useAuthContext()
    const [isLogin, setIsLogin] = useState(true)
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')

    const handleSubmit = async (e: React.FormEvent) => {
      e.preventDefault()
      if (isLogin) {
        await signIn(email, password)
      } else {
        await signUp(email, password)
      }
    }

    return (
      <>
        <Helmet>
          <title>{isLogin ? '登录' : '注册'} - APP视频分析系统</title>
          <meta name="robots" content="noindex" />
        </Helmet>
        <div className="max-w-md mx-auto bg-white rounded-lg shadow-md p-6">
          <h2 className="text-2xl font-bold text-center mb-6">
            {isLogin ? '登录' : '注册'}
          </h2>

          <form onSubmit={handleSubmit} className="space-y-4">
            <Input
              type="email"
              placeholder="邮箱地址"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
            <Input
              type="password"
              placeholder="密码"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />

            {error && (
              <div className="text-sm text-red-600">{error}</div>
            )}

            <Button
              type="submit"
              className="w-full"
              disabled={loading}
            >
              {loading ? '处理中...' : (isLogin ? '登录' : '注册')}
            </Button>

            <div className="text-center">
              <button
                type="button"
                onClick={() => setIsLogin(!isLogin)}
                className="text-sm text-blue-600 hover:underline"
              >
                {isLogin ? '没有账号？立即注册' : '已有账号？立即登录'}
              </button>
            </div>
          </form>
        </div>
      </>
    )
  },
})
