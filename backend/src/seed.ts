import bcrypt from "bcrypt"

import { connectDb, disconnectDb } from "./config/db"
import { env } from "./config/env"
import { AdminUser } from "./models/AdminUser"

async function seed(): Promise<void> {
  if (!env.ADMIN_SEED_EMAIL || !env.ADMIN_SEED_PASSWORD) {
    throw new Error("ADMIN_SEED_EMAIL and ADMIN_SEED_PASSWORD must be set to seed the admin user")
  }

  await connectDb()

  const passwordHash = await bcrypt.hash(env.ADMIN_SEED_PASSWORD, env.BCRYPT_COST)

  const admin = await AdminUser.findOneAndUpdate(
    { email: env.ADMIN_SEED_EMAIL.toLowerCase() },
    {
      email: env.ADMIN_SEED_EMAIL.toLowerCase(),
      passwordHash,
      name: env.ADMIN_SEED_NAME ?? "Admin",
    },
    { upsert: true, new: true }
  )

  console.log(`[seed] admin user ready: ${admin.email}`)

  await disconnectDb()
}

seed()
  .then(() => process.exit(0))
  .catch((error: unknown) => {
    console.error("[seed] failed:", error)
    process.exit(1)
  })
