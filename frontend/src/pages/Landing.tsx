import { Navigate, useLocation } from "react-router-dom"

import { Badge } from "@/components/ui/badge"
import { Skeleton } from "@/components/ui/skeleton"
import { LoginForm } from "@/features/auth/LoginForm"
import { useSession } from "@/features/auth/useSession"
import { HeroIllustration } from "@/features/leads/HeroIllustration"
import { LeadForm } from "@/features/leads/LeadForm"

export function Landing() {
  const location = useLocation()
  const isLoginMode = location.pathname === "/login"

  const { data, isLoading } = useSession()

  if (isLoginMode && isLoading) {
    return (
      <div className="mx-auto flex max-w-sm flex-col gap-4 px-4 py-20">
        <Skeleton className="h-8 w-2/3" />
        <Skeleton className="h-32 w-full" />
      </div>
    )
  }

  if (isLoginMode && data?.data) {
    return <Navigate to="/admin" replace />
  }

  return (
    <div className="grid lg:h-full lg:grid-cols-2 lg:content-stretch">
      <HeroIllustration />

      <div className="flex flex-col justify-center px-4 py-12 sm:px-8 sm:py-16 lg:px-16 lg:py-20 border-l">
        <div
          key={isLoginMode ? "login" : "lead"}
          className="mx-auto w-full max-w-md animate-in fade-in-0 slide-in-from-bottom-4 duration-500 ease-out"
        >
          {isLoginMode ? (
            <>
              <Badge variant="outline" className="mb-3 w-fit">
                Admin access
              </Badge>
              <h1 className="font-heading text-3xl font-semibold tracking-tight text-balance sm:text-4xl">
                Welcome back
              </h1>
              <p className="mt-3 text-muted-foreground">
                Sign in to search, filter, and manage incoming leads.
              </p>

              <div className="mt-8">
                <LoginForm />
              </div>
            </>
          ) : (
            <>
              <h1 className="font-heading text-3xl font-semibold tracking-tight text-balance sm:text-4xl">
                Let&apos;s build something great together
              </h1>
              <p className="mt-3 text-muted-foreground">
                Tell us a little about your project and budget. No sales calls, no spam — just a quick note back
                from our team.
              </p>

              <div className="mt-8">
                <LeadForm />
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  )
}
