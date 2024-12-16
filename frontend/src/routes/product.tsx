import { Route, useParams } from '@tanstack/react-router'
import { Helmet } from 'react-helmet-async'
import { rootRoute } from '@/routes/root'

export const productRoute = new Route({
  getParentRoute: () => rootRoute,
  path: '/products/$slug',
  component: () => {
    const { slug } = useParams({ from: '/products/$slug' })
    return (
      <>
        <Helmet>
          <title>产品分析 - APP视频分析系统</title>
          <meta name="description" content="查看详细的APP功能分析和PRD文档。包含界面截图、功能列表和操作流程。" />
          <meta name="keywords" content="APP分析,功能分析,PRD文档,用户体验" />
          <link rel="canonical" href={`/products/${slug}`} />
        </Helmet>
        <div className="max-w-4xl mx-auto">
          <h1 className="text-3xl font-bold mb-8">产品分析</h1>
          {/* Product details will be implemented here */}
        </div>
      </>
    )
  },
})
