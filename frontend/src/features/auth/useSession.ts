import { useQuery } from "@tanstack/react-query"

import { me } from "@/lib/api/auth"

export const SESSION_QUERY_KEY = ["session"] as const

export function useSession() {
  return useQuery({
    queryKey: SESSION_QUERY_KEY,
    queryFn: me,
    retry: false,
    staleTime: 60_000,
  })
}
