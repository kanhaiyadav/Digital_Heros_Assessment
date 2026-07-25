import type { ReactNode } from "react"
import { Navigate } from "react-router-dom"

import { Skeleton } from "@/components/ui/skeleton"
import { useSession } from "@/features/auth/useSession"

export function ProtectedRoute({ children }: { children: ReactNode }) {
  const { data, isLoading, isError } = useSession()

  if (isLoading) {
    return (
      <div className="mx-auto flex max-w-5xl flex-col gap-4 px-4 py-10 sm:px-6">
        <Skeleton className="h-8 w-40" />
        <Skeleton className="h-64 w-full" />
      </div>
    )
  }

  if (isError || !data?.data) {
    return <Navigate to="/login" replace />
  }

  return <>{children}</>
}
