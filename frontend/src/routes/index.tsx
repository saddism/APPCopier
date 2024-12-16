import { Route, useNavigate } from '@tanstack/react-router'
import { Button } from '@/components/ui/button'
import { Upload } from 'lucide-react'
import { Helmet } from 'react-helmet-async'
import { rootRoute } from '@/routes/root'
import { ProductCard } from '@/components/ProductCard'

// Sample data - will be replaced with real data later
const featuredProducts = [
  {
    id: 'demo-app',
    title: '示例社交应用分析',
    description: '深入分析社交应用的核心功能、用户交互流程和技术实现方案',
    thumbnail: '/demo-app-thumbnail.jpg',
    category: '社交应用',
    date: '2023-12-16'
  }
]

export const indexRoute = new Route({
  getParentRoute: () => rootRoute,
  path: '/',
  component: () => {
    const navigate = useNavigate()

    return (
      <>
        <Helmet>
          <title>APP视频分析系统 - 智能APP功能分析工具</title>
          <meta name="description" content="上传APP操作视频，快速获取详细的功能分析和PRD文档。智能分析APP界面、功能和用户体验。" />
          <meta name="keywords" content="APP分析,视频分析,PRD生成,功能分析,用户体验" />
          <link rel="canonical" href="/" />
        </Helmet>
        <div className="max-w-6xl mx-auto px-4">
          <section className="text-center py-16 md:py-24">
            <h1 className="text-4xl md:text-5xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-indigo-600">
              APP视频分析系统
            </h1>
            <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
              上传您的APP操作视频，获取详细的功能分析和PRD文档
            </p>
            <Button
              size="lg"
              className="gap-2"
              onClick={() => navigate({
                to: '/upload',
                search: (current) => current as never
              })}
            >
              <Upload className="w-5 h-5" />
              立即开始分析
            </Button>
          </section>

          <section className="py-16">
            <div className="flex justify-between items-center mb-8">
              <h2 className="text-2xl font-bold">最新分析案例</h2>
              <Button
                variant="ghost"
                onClick={() => navigate({ to: '/products' })}
                className="text-blue-600 hover:text-blue-700"
              >
                查看更多 →
              </Button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {featuredProducts.map(product => (
                <ProductCard key={product.id} {...product} />
              ))}
            </div>
          </section>
        </div>
      </>
    )
  },
})
