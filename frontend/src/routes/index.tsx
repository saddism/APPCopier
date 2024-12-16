import { Route, useNavigate } from '@tanstack/react-router'
import { Button } from '@/components/ui/button'
import { Upload } from 'lucide-react'
import { Helmet } from 'react-helmet-async'
import { rootRoute } from '@/routes/root'
import { ProductCard } from '@/components/ProductCard'
import { useTranslation } from '@/lib/translations'

// Sample data - will be replaced with real data later
const featuredProducts = [
  {
    id: 'demo-app',
    titleKey: 'products.demo.title',
    descriptionKey: 'products.demo.description',
    categoryKey: 'products.demo.category',
    date: '2023-12-16',
    thumbnail: undefined
  }
]

export const indexRoute = new Route({
  getParentRoute: () => rootRoute,
  path: '/',
  component: () => {
    const navigate = useNavigate()
    const { t } = useTranslation()

    return (
      <>
        <Helmet>
          <title>{t('app.title')} - {t('meta.description')}</title>
          <meta name="description" content={t('meta.description')} />
          <meta name="keywords" content={t('meta.keywords')} />
          <link rel="canonical" href="/" />
        </Helmet>
        <div className="max-w-6xl mx-auto px-4">
          <section className="text-center py-16 md:py-24">
            <h1 className="text-4xl md:text-5xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-indigo-600">
              {t('app.title')}
            </h1>
            <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
              {t('app.description')}
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
              {t('app.startAnalysis')}
            </Button>
          </section>

          <section className="py-16">
            <div className="flex justify-between items-center mb-8">
              <h2 className="text-2xl font-bold">{t('products.latestTitle')}</h2>
              <Button
                variant="ghost"
                onClick={() => navigate({ to: '/products' })}
                className="text-blue-600 hover:text-blue-700"
              >
                {t('products.viewMore')} →
              </Button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {featuredProducts.map(product => (
                <ProductCard
                  key={product.id}
                  id={product.id}
                  titleKey={product.titleKey}
                  descriptionKey={product.descriptionKey}
                  categoryKey={product.categoryKey}
                  date={product.date}
                  thumbnail={product.thumbnail}
                />
              ))}
            </div>
          </section>
        </div>
      </>
    )
  },
})
