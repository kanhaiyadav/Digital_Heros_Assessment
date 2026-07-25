import compression from "compression"
import cookieParser from "cookie-parser"
import cors from "cors"
import express, { type Application } from "express"
import helmet from "helmet"
import morgan from "morgan"

import { env } from "./config/env"
import { errorHandler, notFoundHandler } from "./middleware/error.middleware"
import { globalLimiter } from "./middleware/rateLimit.middleware"
import routes from "./routes"

export function createApp(): Application {
  const app = express()

  app.use(helmet())
  app.use(
    cors({
      origin: env.corsOrigins,
      credentials: true,
    })
  )
  app.use(express.json({ limit: "20kb" }))
  app.use(cookieParser())
  app.use(compression())
  app.use(morgan(env.isProd ? "combined" : "dev"))
  app.use("/api", globalLimiter)

  app.use("/api", routes)

  app.use(notFoundHandler)
  app.use(errorHandler)

  return app
}
