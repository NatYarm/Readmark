import { Link, useNavigate } from '@tanstack/react-router'
import { BookmarkCheck } from 'lucide-react'
import { toast } from 'sonner'

import { Button, buttonVariants } from '../ui/button'

import { ThemeToggle } from './ThemeToggle'

import { authClient } from '@/lib/auth-client'

export const Navbar = () => {
  const { data: session, isPending } = authClient.useSession()
  const navigate = useNavigate()

  const handleSignout = async () => {
    await authClient.signOut({
      fetchOptions: {
        onSuccess: () => {
          navigate({ to: '/' })
        },
        onError: ({ error }) => {
          toast.error(error.message)
        },
      },
    })
  }

  return (
    <nav className="sticky top-0 z-50 border-b bg-background/95 backdrop-blur supports-backdrop-filter:bg-background/60">
      <div className="mx-auto flex-between h-16 max-w-6xl px-4">
        <div className="flex items-center gap-2">
          <BookmarkCheck className="size-9 text-primary" />

          <h1 className="text-lg font-semibold text-foreground">Readmark</h1>
        </div>
        <div className="flex items-center gap-3">
          <ThemeToggle />
          {isPending ? null : session ? (
            <>
              <Button
                className={buttonVariants({ variant: 'secondary' })}
                onClick={handleSignout}
              >
                Logout
              </Button>
              <Link to="/dashboard" className={buttonVariants()}>
                Dashboard
              </Link>
            </>
          ) : (
            <>
              <Link
                to="/login"
                className={buttonVariants({ variant: 'secondary' })}
              >
                Login
              </Link>
              <Link to="/signup" className={buttonVariants()}>
                Sign up
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  )
}
