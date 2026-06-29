import { Link } from '@tanstack/react-router'
import { Copy } from 'lucide-react'

import { Badge } from '../ui/badge'
import { Button } from '../ui/button'
import { Card, CardDescription, CardHeader, CardTitle } from '../ui/card'

import type { SavedItem } from '@/generated/prisma/client'

type ItemsListProps = {
  filteredItems: SavedItem[]
  onCopyLink: (
    e: React.MouseEvent<HTMLButtonElement>,
    url: string,
  ) => void | Promise<void>
}

export function ItemsList({ filteredItems, onCopyLink }: ItemsListProps) {
  return (
    <div className="grid gap-6 md:grid-cols-2">
      {filteredItems.map((item) => (
        <Card
          key={item.id}
          className="group overflow-hidden transition-all hover:shadow-lg pt-0"
        >
          <Link
            to="/dashboard/items/$itemId"
            params={{ itemId: item.id }}
            className="block"
          >
            <div className="aspect-video w-full overflow-hidden bg-muted">
              <img
                src={
                  item.ogImage ??
                  'https://i0.wp.com/backgroundabstract.com/wp-content/uploads/edd/2021/09/gradient-blue-pink-abstract-art-wallpaper-preview-e1656162284223.jpg?w=728&ssl=1'
                }
                alt={item.title ?? 'Article Thumbnail'}
                className="h-full w-full object-cover transition-transform group-hover:scale-105"
              />
            </div>

            <CardHeader className="space-y-3 pt-4">
              <div className="flex-between gap-2">
                <Badge
                  variant={
                    item.status === 'COMPLETED' ? 'default' : 'secondary'
                  }
                >
                  {item.status.toLowerCase()}
                </Badge>
                <Button
                  onClick={(e) => onCopyLink(e, item.url)}
                  variant="outline"
                  size="icon"
                  className="size-8"
                >
                  <Copy className="size-4" />
                </Button>
              </div>

              <CardTitle className="line-clamp-1 text-xl leading-snug group-hover:text-primary transition-colors">
                {item.title}
              </CardTitle>

              {item.author && (
                <p className="text-sm text-muted-foreground">{item.author}</p>
              )}

              {item.summary && (
                <CardDescription className="line-clamp-3 text-sm">
                  {item.summary}
                </CardDescription>
              )}

              {/* Tags */}
              {item.tags.length > 0 && (
                <div className="flex flex-wrap gap-1.5 pt-2">
                  {item.tags.slice(0, 4).map((tag, idx) => (
                    <Badge variant="outline" key={idx}>
                      {tag}
                    </Badge>
                  ))}
                </div>
              )}
            </CardHeader>
          </Link>
        </Card>
      ))}
    </div>
  )
}
