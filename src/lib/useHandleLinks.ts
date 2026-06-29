import { useState, useTransition } from 'react'

import type { SearchResultWeb } from 'firecrawl'
import { toast } from 'sonner'

import { bulkScrapeUrlsFn } from '@/data/items'
import type { BulkScrapeProgress } from '@/data/items'

export const useHandleLinks = () => {
  const [bulkIsPending, startBulkTransition] = useTransition()
  const [discoveredLinks, setDiscoveredLinks] = useState<SearchResultWeb[]>([]) // bulk import state
  const [selectedUrls, setSelectedUrls] = useState<Set<string>>(new Set())
  const [progress, setProgress] = useState<BulkScrapeProgress | null>(null)

  const handleSelectAll = () => {
    if (selectedUrls.size === discoveredLinks.length) {
      setSelectedUrls(new Set())
    } else {
      setSelectedUrls(new Set(discoveredLinks.map((link) => link.url)))
    }
  }

  const handleToggleUrl = (url: string) => {
    const newSelected = new Set(selectedUrls)

    if (newSelected.has(url)) {
      newSelected.delete(url)
    } else {
      newSelected.add(url)
    }

    setSelectedUrls(newSelected)
  }

  const handleBulkImport = () => {
    startBulkTransition(async () => {
      if (selectedUrls.size === 0) {
        toast.error('Please select at least one URL to import')
        return
      }

      setProgress({
        completed: 0,
        total: selectedUrls.size,
        url: '',
        status: 'success',
      })

      let successCount = 0
      let failedCount = 0

      for await (const update of await bulkScrapeUrlsFn({
        data: { urls: Array.from(selectedUrls) },
      })) {
        setProgress(update)
        if (update.status === 'success') successCount++
        else failedCount++
      }

      setProgress(null)

      if (failedCount > 0) {
        toast.success(`Imported ${successCount} Urls (${failedCount} failed)`)
      } else {
        toast.success(`Successfully imported ${successCount} URLs`)
      }
    })
  }

  return {
    bulkIsPending,
    discoveredLinks,
    setDiscoveredLinks,
    selectedUrls,
    handleSelectAll,
    handleToggleUrl,
    handleBulkImport,
    progress,
  }
}
