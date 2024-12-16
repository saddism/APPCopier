import { Route } from '@tanstack/react-router'
import { Helmet } from 'react-helmet-async'
import { VideoUploader } from '@/components/VideoUploader'
import { rootRoute } from '@/routes/root'

export const uploadRoute = new Route({
  getParentRoute: () => rootRoute,
  path: '/upload',
  component: () => (
    <>
      <Helmet>
        <title>上传视频 - APP视频分析系统</title>
        <meta name="description" content="上传您的APP操作视频，获取详细的功能分析和PRD文档。支持多种视频格式。" />
        <meta name="keywords" content="视频上传,APP分析,功能分析,PRD生成" />
        <link rel="canonical" href="/upload" />
      </Helmet>
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-8">上传视频</h1>
        <VideoUploader />
      </div>
    </>
  ),
})
