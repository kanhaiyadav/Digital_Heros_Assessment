import type { ReactNode } from "react"

import { Header } from "@/components/layout/Header"
import { Footer } from "@/components/layout/Footer"

export function PageShell({ children }: { children: ReactNode }) {
  return (
    <div className="flex h-svh flex-col overflow-hidden">
      <Header />
      <main className="flex-1 overflow-y-auto">{children}</main>
      <Footer />
    </div>
  )
}
