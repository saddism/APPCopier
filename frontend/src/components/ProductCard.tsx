import { Link } from '@tanstack/react-router'
import { AspectRatio } from '@/components/ui/aspect-ratio'
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'

interface ProductCardProps {
  id: string
  title: string
  description: string
  thumbnail: string
  category: string
  date: string
}

export function ProductCard({ id, title, description, thumbnail, category, date }: ProductCardProps) {
  return (
    <Link to="/products/$slug" params={{ slug: id }} className="block group">
      <Card className="overflow-hidden transition-all hover:shadow-lg">
        <CardHeader className="p-0">
          <AspectRatio ratio={16/9} className="bg-muted">
            <img
              src={thumbnail}
              alt={title}
              className="w-full h-full object-cover transition-transform group-hover:scale-105"
            />
          </AspectRatio>
        </CardHeader>
        <CardContent className="p-4">
          <h3 className="text-lg font-semibold mb-2 group-hover:text-blue-600 transition-colors">
            {title}
          </h3>
          <p className="text-gray-600 text-sm mb-3 line-clamp-2">
            {description}
          </p>
          <Badge variant="secondary" className="mb-2">
            {category}
          </Badge>
        </CardContent>
        <CardFooter className="px-4 py-3 border-t text-sm text-gray-500">
          {new Date(date).toLocaleDateString('zh-CN')}
        </CardFooter>
      </Card>
    </Link>
  )
}
