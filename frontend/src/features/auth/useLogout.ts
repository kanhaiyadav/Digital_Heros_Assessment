import { useMutation, useQueryClient } from "@tanstack/react-query"

import { logout } from "@/lib/api/auth"
import { SESSION_QUERY_KEY } from "@/features/auth/useSession"

export function useLogout() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: logout,
    onSuccess: () => {
      queryClient.setQueryData(SESSION_QUERY_KEY, undefined)
      queryClient.removeQueries({ queryKey: SESSION_QUERY_KEY })
    },
  })
}
