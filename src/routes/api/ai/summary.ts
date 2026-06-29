import { createFileRoute } from '@tanstack/react-router'
import { createTextStreamResponse, streamText, toTextStream } from 'ai'

import { prisma } from '@/db'
import { openrouter } from '@/lib/openRouter'
import { authMiddleware } from '@/middlewares/auth'

export const Route = createFileRoute('/api/ai/summary')({
  server: {
    middleware: [authMiddleware],
    handlers: {
      POST: async ({ request, context }) => {
        const { itemId, prompt } = await request.json()

        if (!itemId || !prompt) {
          return new Response('Missing prompt or itemId', { status: 400 })
        }

        const item = await prisma.savedItem.findUnique({
          where: {
            id: itemId,
            userId: context?.session.user.id,
          },
        })

        if (!item) {
          return new Response('Item not found', { status: 404 })
        }

        // stream summary
        const result = streamText({
          model: openrouter.chat('openrouter/free'),
          system: `You are a helpful assistant that creates concise, informative summarits of web content. Your summaries should:
          - Be 2-3 paragraphs long
          - Capture the main points and key takeaways
          - Be written in a clear, professional tone`,
          prompt: `Summarize the following content:\n\n${prompt}`,
        })

        return createTextStreamResponse({
          stream: toTextStream({ stream: result.stream }),
        })
      },
    },
  },
})
