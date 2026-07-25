import type { NextFunction, Request, Response } from "express"

import { ACCESS_TOKEN_COOKIE } from "../utils/cookies"
import { ApiError } from "../utils/ApiError"
import { verifyAccessToken } from "../services/token.service"

export function requireAuth(req: Request, _res: Response, next: NextFunction): void {
  const token = req.cookies?.[ACCESS_TOKEN_COOKIE]

  if (!token) {
    next(ApiError.unauthorized("Not authenticated"))
    return
  }

  try {
    req.user = verifyAccessToken(token)
    next()
  } catch {
    next(ApiError.unauthorized("Session expired"))
  }
}
