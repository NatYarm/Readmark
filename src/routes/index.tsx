import { createFileRoute } from '@tanstack/react-router'

import { Navbar } from '@/components/web/Navbar'

export const Route = createFileRoute('/')({ component: Home })

function Home() {
  return (
    <div className="flex min-h-screen flex-col overflow-hidden">
      <Navbar />
      <div className="relative w-full flex-1 bg-[url(/bookshelf.webp)] bg-cover bg-no-repeat">
        <div className="absolute inset-0 bg-black/50" />
        <div className="absolute inset-0 flex flex-col items-center justify-center gap-4 text-center">
          <h1 className="text-6xl font-bold tracking-tight ">
            Save the web.
            <br />
            Read what matters.
          </h1>
          <p className="max-w-md text-xl text-amber-50">
            Collect any URL, get a clean read, and let AI summarize it for you.
          </p>
        </div>
      </div>
    </div>
  )
}
