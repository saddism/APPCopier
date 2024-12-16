import { Route, useNavigate } from '@tanstack/react-router'
import { Button } from '@/components/ui/button'
import { Upload } from 'lucide-react'
import { Helmet } from 'react-helmet-async'
import { rootRoute } from '@/routes/root'

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
        <div className="max-w-4xl mx-auto">
          <section className="text-center mb-16">
            <h1 className="text-4xl font-bold mb-4">APP视频分析系统</h1>
            <p className="text-xl text-gray-600 mb-8">
              上传您的APP操作视频，获取详细的功能分析和PRD文档
            </p>
            <Button
              size="lg"
              className="gap-2"
              onClick={() => navigate({
                to: '/upload',
                search: (current) => {
                  return current as never;
                }
              })}
            >
              <Upload className="w-5 h-5" />
              立即开始分析
            </Button>
          </section>

          <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* Product showcase grid - will be implemented in step 004 */}
          </section>
        </div>
      </>
    )
  },
})
