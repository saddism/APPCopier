import { Route } from '@tanstack/react-router'
import { Helmet } from 'react-helmet-async'
import { VideoUploader } from '@/components/VideoUploader'
import { rootRoute } from '@/routes/root'
import { useTranslation } from '@/lib/translations'

export const uploadRoute = new Route({
  getParentRoute: () => rootRoute,
  path: '/upload',
  component: () => {
    const { t } = useTranslation()

    return (
      <>
        <Helmet>
          <title>{t('upload.title')} - APP视频分析系统</title>
          <meta name="description" content={t('upload.description')} />
          <meta name="keywords" content="视频上传,APP分析,功能分析,PRD生成" />
          <link rel="canonical" href="/upload" />
        </Helmet>
        <div className="max-w-4xl mx-auto px-4 py-8">
          <h1 className="text-3xl font-bold mb-8 bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
            {t('upload.title')}
          </h1>
          <p className="text-gray-600 mb-8">{t('upload.description')}</p>
          <VideoUploader />
        </div>
      </>
    )
  },
})
