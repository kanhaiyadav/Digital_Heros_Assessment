import type { NextFunction, Request, Response } from "express"

import { env } from "../config/env"
import { ApiError } from "../utils/ApiError"

export function notFoundHandler(req: Request, _res: Response, next: NextFunction): void {
  next(ApiError.notFound(`Route not found: ${req.method} ${req.originalUrl}`))
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export function errorHandler(err: unknown, _req: Request, res: Response, _next: NextFunction): void {
  if (err instanceof ApiError) {
    res.status(err.statusCode).json({
      error: { message: err.message, ...(err.details ? { details: err.details } : {}) },
    })
    return
  }

  console.error("[unhandled error]", err)

  res.status(500).json({
    error: {
      message: env.isProd ? "Something went wrong" : err instanceof Error ? err.message : String(err),
    },
  })
}
