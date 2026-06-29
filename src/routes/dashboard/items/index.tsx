import { Suspense, use, useEffect, useState } from 'react'

import { createFileRoute, Link, useNavigate } from '@tanstack/react-router'
import { Inbox } from 'lucide-react'
import { toast } from 'sonner'

import { ItemsGridSkeleton } from '@/components/dashboard/ItemsGridSkeleton'
import { ItemsList } from '@/components/dashboard/ItemsList'
import { buttonVariants } from '@/components/ui/button'
import {
  Empty,
  EmptyContent,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from '@/components/ui/empty'
import { Input } from '@/components/ui/input'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { getItemsFn } from '@/data/items'
import { ItemStatus } from '@/generated/prisma/enums'
import { copyToClipboard } from '@/lib/clipboard'
import { itemsSearchSchema } from '@/schemas/items'

export const Route = createFileRoute('/dashboard/items/')({
  component: RouteComponent,
  loader: () => ({ itemsPromise: getItemsFn() }),
  validateSearch: itemsSearchSchema,
  head: () => ({
    meta: [
      { title: 'Saved Items' },
      { property: 'og:title', content: 'Saved Items' },
    ],
  }),
})

function RouteComponent() {
  const { q, status } = Route.useSearch()
  const [searchInput, setSearchInput] = useState(q)
  const navigate = useNavigate({ from: Route.fullPath })

  useEffect(() => {
    if (searchInput === q) return

    const timeoutId = setTimeout(() => {
      navigate({ search: (prev) => ({ ...prev, q: searchInput }) })
    }, 300)

    return () => clearTimeout(timeoutId)
  }, [searchInput, navigate, q])

  const handleStatusChange = (newStatus: typeof status) => {
    navigate({
      search: (prev) => ({ ...prev, status: newStatus }),
    })
  }

  return (
    <div className="flex flex-1 flex-col gap-6">
      <div>
        <h1 className="text-2xl font-bold">Saved Items</h1>
        <p className="text-muted-foreground">Your saved articles and content</p>
      </div>
      {/* Search and Filter controls */}
      <div className="flex gap-4">
        <Input
          value={searchInput}
          onChange={(e) => setSearchInput(e.target.value)}
          placeholder="Search by title or tags"
        />
        <Select
          value={status}
          onValueChange={(value) => handleStatusChange(value as typeof status)}
        >
          <SelectTrigger className="w-40">
            <SelectValue placeholder="Filter by status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Statuses</SelectItem>
            {Object.values(ItemStatus).map((itemStatus) => (
              <SelectItem key={itemStatus} value={itemStatus}>
                {itemStatus.charAt(0) + itemStatus.slice(1).toLowerCase()}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <Suspense fallback={<ItemsGridSkeleton />}>
        <ItemsContent q={q} status={status} />
      </Suspense>
    </div>
  )
}

type ItemsContentProps = {
  q: string
  status: 'all' | ItemStatus
}

function ItemsContent({ q, status }: ItemsContentProps) {
  const { itemsPromise } = Route.useLoaderData()
  const items = use(itemsPromise)

  const filteredItems = items.filter((item) => {
    const matchesQuery =
      q === '' ||
      item.title?.toLowerCase().includes(q.toLowerCase()) ||
      item.tags.some((tag) => tag.toLowerCase().includes(q.toLowerCase()))

    const matchesStatus = status === 'all' || item.status === status

    return matchesQuery && matchesStatus
  })

  const handleCopyLink = async (e: React.MouseEvent, url: string) => {
    e.preventDefault()
    await copyToClipboard(url)
    toast.success('URL copied to clipboard')
  }

  if (filteredItems.length === 0) {
    return (
      <Empty className="border rounded-lg h-full">
        <EmptyHeader>
          <EmptyMedia variant="icon">
            <Inbox className="size-12" />
          </EmptyMedia>
          <EmptyTitle>
            {items.length === 0 ? 'No Items saved yet' : 'No items found'}
          </EmptyTitle>
          <EmptyDescription>
            {items.length === 0
              ? 'Import a URL to get started with saving your content.'
              : 'No items match your current search filters.'}
          </EmptyDescription>
        </EmptyHeader>
        {items.length === 0 && (
          <EmptyContent>
            <Link to="/dashboard/import" className={buttonVariants()}>
              Import URL
            </Link>
          </EmptyContent>
        )}
      </Empty>
    )
  }

  return <ItemsList filteredItems={filteredItems} onCopyLink={handleCopyLink} />
}
