import { Link } from '@tanstack/react-router'
import { AspectRatio } from '@/components/ui/aspect-ratio'
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { useTranslation } from '@/lib/translations'

// Placeholder image as data URL for demo products
const placeholderImage = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iODAwIiBoZWlnaHQ9IjQ1MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZGVmcz48bGluZWFyR3JhZGllbnQgaWQ9ImdyYWQiIHgxPSIwJSIgeTE9IjAlIiB4Mj0iMTAwJSIgeTI9IjEwMCUiPjxzdG9wIG9mZnNldD0iMCUiIHN0eWxlPSJzdG9wLWNvbG9yOiMzQjgyRjY7c3RvcC1vcGFjaXR5OjEiIC8+PHN0b3Agb2Zmc2V0PSIxMDAlIiBzdHlsZT0ic3RvcC1jb2xvcjojODIzQkY2O3N0b3Atb3BhY2l0eToxIiAvPjwvbGluZWFyR3JhZGllbnQ+PC9kZWZzPjxyZWN0IHdpZHRoPSI4MDAiIGhlaWdodD0iNDUwIiBmaWxsPSJ1cmwoI2dyYWQpIi8+PHRleHQgeD0iNDAwIiB5PSIyMjUiIGZvbnQtZmFtaWx5PSJBcmlhbCIgZm9udC1zaXplPSI0MCIgZmlsbD0id2hpdGUiIHRleHQtYW5jaG9yPSJtaWRkbGUiIGRvbWluYW50LWJhc2VsaW5lPSJtaWRkbGUiPkRlbW8gQXBwPC90ZXh0Pjwvc3ZnPg=='

interface ProductCardProps {
  id: string
  titleKey: string
  descriptionKey: string
  thumbnail?: string
  categoryKey: string
  date: string
}

export function ProductCard({ id, titleKey, descriptionKey, thumbnail, categoryKey, date }: ProductCardProps) {
  const { t } = useTranslation()

  return (
    <Link to="/products/$slug" params={{ slug: id }} className="block group">
      <Card className="overflow-hidden transition-all hover:shadow-lg">
        <CardHeader className="p-0">
          <AspectRatio ratio={16/9} className="bg-muted">
            <img
              src={thumbnail || placeholderImage}
              alt={t(titleKey)}
              className="w-full h-full object-cover transition-transform group-hover:scale-105"
            />
          </AspectRatio>
        </CardHeader>
        <CardContent className="p-4">
          <h3 className="text-lg font-semibold mb-2 group-hover:text-blue-600 transition-colors">
            {t(titleKey)}
          </h3>
          <p className="text-gray-600 text-sm mb-3 line-clamp-2">
            {t(descriptionKey)}
          </p>
          <Badge variant="secondary" className="mb-2">
            {t(categoryKey)}
          </Badge>
        </CardContent>
        <CardFooter className="px-4 py-3 border-t text-sm text-gray-500">
          {new Date(date).toLocaleDateString()}
        </CardFooter>
      </Card>
    </Link>
  )
}
