import { Link } from "react-router-dom"

import { Button } from "@/components/ui/button"

export function NotFound() {
  return (
    <div className="mx-auto flex max-w-md flex-col items-center gap-4 px-4 py-24 text-center">
      <p className="text-sm font-medium text-muted-foreground">404</p>
      <h1 className="text-2xl font-semibold tracking-tight">Page not found</h1>
      <p className="text-sm text-muted-foreground">
        The page you&apos;re looking for doesn&apos;t exist.
      </p>
      <Button render={<Link to="/" />} nativeButton={false} className="mt-2">
        Back home
      </Button>
    </div>
  )
}
