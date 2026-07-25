import { useMutation, useQueryClient } from "@tanstack/react-query"

import { login } from "@/lib/api/auth"
import { SESSION_QUERY_KEY } from "@/features/auth/useSession"

export function useLogin() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: login,
    onSuccess: ({ data }) => {
      queryClient.setQueryData(SESSION_QUERY_KEY, { data })
    },
  })
}
