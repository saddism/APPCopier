import { Route, useParams } from '@tanstack/react-router'
import { useTranslation } from '@/lib/translations'
import { Helmet } from 'react-helmet-async'
import { rootRoute } from '@/routes/root'

export const productDetailRoute = new Route({
  getParentRoute: () => rootRoute,
  path: '/products/$slug',
  component: () => {
    const { slug } = useParams({ from: '/products/$slug' })
    const { t } = useTranslation()

    // In a real app, we would fetch the product details based on the slug
    // For demo purposes, we'll just use static data
    const product = {
      titleKey: `products.${slug}.title`,
      descriptionKey: `products.${slug}.description`,
      categoryKey: `products.${slug}.category`,
      thumbnail: `/products/${slug}/thumbnail.jpg`,
      date: '2023-12-16'
    }

    return (
      <>
        <Helmet>
          <title>{t(product.titleKey)} - {t('app.title')}</title>
          <meta name="description" content={t(product.descriptionKey)} />
        </Helmet>
        <div className="max-w-4xl mx-auto px-4 py-8">
          <div className="aspect-video w-full overflow-hidden rounded-lg mb-8">
            <img
              src={product.thumbnail}
              alt={t(product.titleKey)}
              className="w-full h-full object-cover"
            />
          </div>
          <div className="space-y-6">
            <h1 className="text-3xl font-bold">{t(product.titleKey)}</h1>
            <div className="flex items-center gap-4">
              <span className="inline-flex items-center rounded-md bg-blue-50 px-2 py-1 text-sm font-medium text-blue-700 ring-1 ring-inset ring-blue-700/10">
                {t(product.categoryKey)}
              </span>
              <time className="text-sm text-muted-foreground">
                {new Date(product.date).toLocaleDateString()}
              </time>
            </div>
            <p className="text-lg text-gray-600">
              {t(product.descriptionKey)}
            </p>
          </div>
        </div>
      </>
    )
  }
})
