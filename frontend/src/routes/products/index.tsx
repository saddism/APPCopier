import { Route } from '@tanstack/react-router'
import { Helmet } from 'react-helmet-async'
import { rootRoute } from '@/routes/root'

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
      <div className="max-w-4xl mx-auto py-8">
        <h1 className="text-2xl font-bold mb-6">已分析产品</h1>
        {/* Product list grid will be implemented later */}
      </div>
    </>
  ),
})

export const productDetailRoute = new Route({
  getParentRoute: () => rootRoute,
  path: '/products/$slug',
  component: ({ params: { slug } }) => (
    <>
      <Helmet>
        <title>产品分析详情 - APP视频分析系统</title>
        <meta name="description" content="查看详细的APP功能分析和PRD文档。包含界面截图、功能列表和操作流程。" />
        <meta name="keywords" content="APP分析,功能分析,PRD文档,用户体验" />
        <link rel="canonical" href={`/products/${slug}`} />
      </Helmet>
      <div className="max-w-4xl mx-auto py-8">
        <h1 className="text-2xl font-bold mb-6">产品分析详情</h1>
        {/* Product details will be implemented later */}
      </div>
    </>
  ),
})
