export type BudgetRange = "<5k" | "5k-15k" | "15k-50k" | "50k+"

export const BUDGET_RANGES: BudgetRange[] = ["<5k", "5k-15k", "15k-50k", "50k+"]

export type LeadStatus = "New" | "Contacted" | "Closed"

export const LEAD_STATUSES: LeadStatus[] = ["New", "Contacted", "Closed"]

export interface AccessTokenPayload {
  sub: string
  email: string
}

export interface RefreshTokenPayload {
  sub: string
  jti: string
}
