import { apiFetch } from "@/lib/api/client"
import type { AdminSession, LoginInput } from "@/lib/validation/auth.schema"

export function login(input: LoginInput): Promise<{ data: AdminSession }> {
  return apiFetch<{ data: AdminSession }>("/auth/login", {
    method: "POST",
    body: JSON.stringify(input),
  })
}

export function logout(): Promise<void> {
  return apiFetch<void>("/auth/logout", { method: "POST" })
}

export function me(): Promise<{ data: AdminSession }> {
  return apiFetch<{ data: AdminSession }>("/auth/me")
}
