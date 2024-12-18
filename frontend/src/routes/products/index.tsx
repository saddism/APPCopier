import { Route } from '@tanstack/react-router'
import { Helmet } from 'react-helmet-async'
import { rootRoute } from '@/routes/root'
import { ProductCard } from '@/components/ProductCard'

// Sample data - will be replaced with real data later
const sampleProducts = [
  {
    id: 'demo-app',
    title: '示例社交应用分析',
    description: '深入分析社交应用的核心功能、用户交互流程和技术实现方案',
    thumbnail: '/demo-app-thumbnail.jpg',
    category: '社交应用',
    date: '2023-12-16'
  },
  {
    id: 'ecommerce-app',
    title: '电商平台功能分析',
    description: '电商应用的购物流程、支付系统和商品管理功能详细分析',
    thumbnail: '/ecommerce-thumbnail.jpg',
    category: '电商应用',
    date: '2023-12-15'
  }
]

export const productListRoute = new Route({
  getParentRoute: () => rootRoute,
  path: '/products',
  component: () => (
    <>
      <Helmet>
        <title>已分析产品列表 - APP视频分析系统</title>
        <meta name="description" content="浏览已分析的APP产品列表，查看详细功能分析和PRD文档。" />
        <meta name="keywords" content="APP分析,产品列表,功能分析,PRD文档" />
        <link rel="canonical" href="/products" />
      </Helmet>
      <div className="max-w-6xl mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-8">已分析产品</h1>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {sampleProducts.map(product => (
            <ProductCard key={product.id} {...product} />
          ))}
        </div>
        {sampleProducts.length === 0 && (
          <div className="text-center py-16">
            <h3 className="text-xl font-medium text-gray-600 mb-4">暂无分析案例</h3>
            <p className="text-gray-500 mb-8">成为第一个上传视频进行分析的用户</p>
            <Link
              to="/upload"
              className="inline-flex items-center justify-center px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              立即上传视频
            </Link>
          </div>
        )}
      </div>
    </>
  ),
})

export const productDetailRoute = new Route({
  getParentRoute: () => rootRoute,
  path: '/products/$slug',
  component: ({ params: { slug } }) => {
    const product = sampleProducts.find(p => p.id === slug)

    if (!product) {
      return (
        <div className="max-w-4xl mx-auto px-4 py-16 text-center">
          <h1 className="text-2xl font-bold mb-4">未找到产品</h1>
          <p className="text-gray-600 mb-8">该产品可能已被删除或不存在</p>
          <Link
            to="/products"
            className="text-blue-600 hover:text-blue-700"
          >
            返回产品列表
          </Link>
        </div>
      )
    }

    return (
      <>
        <Helmet>
          <title>{`${product.title} - APP视频分析系统`}</title>
          <meta name="description" content={product.description} />
          <meta name="keywords" content={`${product.category},功能分析,PRD文档,用户体验`} />
          <link rel="canonical" href={`/products/${slug}`} />
        </Helmet>
        <div className="max-w-4xl mx-auto px-4 py-8">
          <div className="mb-8">
            <Link to="/products" className="text-blue-600 hover:text-blue-700 mb-4 inline-block">
              ← 返回列表
            </Link>
            <h1 className="text-3xl font-bold mb-4">{product.title}</h1>
            <div className="flex items-center gap-4 text-sm text-gray-500">
              <span>{new Date(product.date).toLocaleDateString('zh-CN')}</span>
              <span>·</span>
              <span>{product.category}</span>
            </div>
          </div>
          <div className="aspect-w-16 aspect-h-9 mb-8">
            <img src={product.thumbnail} alt={product.title} className="rounded-lg object-cover" />
          </div>
          {/* PRD content will be implemented in the next iteration */}
        </div>
      </>
    )
  },
})
