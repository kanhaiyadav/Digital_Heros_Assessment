import type { AccessTokenPayload } from "./index"

declare global {
  namespace Express {
    interface Request {
      user?: AccessTokenPayload
    }
    interface Locals {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      query?: any
    }
  }
}

export {}
