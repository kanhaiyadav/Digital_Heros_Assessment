import { useEffect } from "react"

import { apiFetch } from "@/lib/api/client"

const PING_INTERVAL_MS = 4 * 60 * 1000

// Belt-and-suspenders alongside the GitHub Actions cron ping (.github/workflows/keep-alive.yml):
// that one keeps Render warm even with nobody visiting, this one keeps it warm for the
// duration of an active session so a long-idle admin tab doesn't hit a cold start either.
export function useKeepAlive() {
  useEffect(() => {
    function ping() {
      if (document.visibilityState !== "visible") return
      apiFetch("/health").catch(() => {
        // Cold start or transient network issue - nothing actionable for the user here.
      })
    }

    ping()
    const id = setInterval(ping, PING_INTERVAL_MS)
    return () => clearInterval(id)
  }, [])
}
