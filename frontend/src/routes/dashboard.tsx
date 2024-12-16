import { Route, redirect } from '@tanstack/react-router'
import { VideoUploader } from '@/components/VideoUploader'
import { Helmet } from 'react-helmet-async'
import { rootRoute } from '@/routes/root'

type RouteContext = {
  auth: {
    isAuthenticated: boolean
  }
}

export const dashboardRoute = new Route({
  getParentRoute: () => rootRoute,
  path: '/dashboard',
  beforeLoad: async ({ context }) => {
    const auth = (context as RouteContext).auth
    if (!auth?.isAuthenticated) {
      throw redirect({
        to: '/login',
        search: {
          redirect: '/dashboard',
        },
      })
    }
    return {}
  },
  component: () => (
    <>
      <Helmet>
        <title>控制台 - APP视频分析系统</title>
        <meta name="robots" content="noindex" />
      </Helmet>
      <div className="max-w-md mx-auto bg-white rounded-lg shadow-md p-6">
        <h1 className="text-2xl font-bold text-center mb-6">视频分析控制台</h1>
        <VideoUploader />
      </div>
    </>
  ),
})
