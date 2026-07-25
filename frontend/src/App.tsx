import { PageShell } from "@/components/layout/PageShell"
import { Toaster } from "@/components/ui/sonner"
import { useKeepAlive } from "@/hooks/useKeepAlive"
import { AppRoutes } from "@/routes/AppRoutes"

export function App() {
  useKeepAlive()

  return (
    <PageShell>
      <AppRoutes />
      <Toaster position="top-center" />
    </PageShell>
  )
}

export default App
