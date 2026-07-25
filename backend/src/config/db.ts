import mongoose from "mongoose"

import { env } from "./env"

mongoose.connection.on("connected", () => {
  console.log("[db] connected")
})

mongoose.connection.on("error", (error) => {
  console.error("[db] connection error:", error)
})

mongoose.connection.on("disconnected", () => {
  console.warn("[db] disconnected")
})

export async function connectDb(): Promise<void> {
  await mongoose.connect(env.MONGODB_URI)
}

export async function disconnectDb(): Promise<void> {
  await mongoose.disconnect()
}
