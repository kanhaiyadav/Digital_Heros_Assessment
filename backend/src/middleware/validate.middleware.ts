import type { NextFunction, Request, Response } from "express"
import type { ZodSchema } from "zod"

import { ApiError } from "../utils/ApiError"

type RequestPart = "body" | "query" | "params"

export function validate(schema: ZodSchema, part: RequestPart = "body") {
  return (req: Request, res: Response, next: NextFunction): void => {
    const result = schema.safeParse(req[part])

    if (!result.success) {
      next(ApiError.badRequest("Validation failed", result.error.flatten().fieldErrors))
      return
    }

    // req.query is a getter-only accessor in Express, so it can't be reassigned -
    // parsed/coerced query values are exposed via res.locals instead.
    if (part === "query") {
      res.locals.query = result.data
    } else {
      req[part] = result.data
    }

    next()
  }
}
