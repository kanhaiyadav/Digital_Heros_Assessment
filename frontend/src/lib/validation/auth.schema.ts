// keep in sync with backend/src/validators/auth.schema.ts
import { z } from "zod"

export const loginSchema = z.object({
  email: z.string().trim().toLowerCase().email("Enter a valid email address"),
  password: z.string().min(1, "Password is required"),
})

export type LoginInput = z.infer<typeof loginSchema>

export interface AdminSession {
  id: string
  email: string
  name: string
}
