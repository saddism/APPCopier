import { Link, Route } from '@tanstack/react-router'
import { Helmet } from 'react-helmet-async'
import { rootRoute } from '@/routes/root'
import { ProductCard } from '@/components/ProductCard'
import { useTranslation } from '@/lib/translations'

// Sample data - will be replaced with real data later
const sampleProducts = [
  {
    id: 'demo-app',
    titleKey: 'products.demo.title',
    descriptionKey: 'products.demo.description',
    thumbnail: '/demo-app-thumbnail.jpg',
    categoryKey: 'products.demo.category',
    date: '2023-12-16'
  },
  {
    id: 'ecommerce-app',
    titleKey: 'products.ecommerce.title',
    descriptionKey: 'products.ecommerce.description',
    thumbnail: '/ecommerce-thumbnail.jpg',
    categoryKey: 'products.ecommerce.category',
    date: '2023-12-15'
  }
]

export const productListRoute = new Route({
  getParentRoute: () => rootRoute,
  path: '/products',
  component: () => {
    const { t } = useTranslation()

    return (
      <>
        <Helmet>
          <title>{t('products.list.title')} - {t('app.title')}</title>
          <meta name="description" content={t('products.list.description')} />
          <meta name="keywords" content={t('meta.keywords')} />
          <link rel="canonical" href="/products" />
        </Helmet>
        <div className="max-w-6xl mx-auto px-4 py-8">
          <h1 className="text-3xl font-bold mb-8">{t('products.list.title')}</h1>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {sampleProducts.map(product => (
              <ProductCard key={product.id} {...product} />
            ))}
          </div>
          {sampleProducts.length === 0 && (
            <div className="text-center py-16">
              <h3 className="text-xl font-medium text-gray-600 mb-4">{t('products.empty.title')}</h3>
              <p className="text-gray-500 mb-8">{t('products.empty.description')}</p>
              <Link
                to="/upload"
                className="inline-flex items-center justify-center px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                {t('products.empty.uploadButton')}
              </Link>
            </div>
          )}
        </div>
      </>
    )
  },
})
