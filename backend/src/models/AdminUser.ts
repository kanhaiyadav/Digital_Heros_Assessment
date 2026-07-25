import { Schema, model } from "mongoose"

export interface AdminUserDocument {
  _id: Schema.Types.ObjectId
  email: string
  passwordHash: string
  name: string
  createdAt: Date
  updatedAt: Date
}

const adminUserSchema = new Schema<AdminUserDocument>(
  {
    email: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      lowercase: true,
    },
    passwordHash: {
      type: String,
      required: true,
      select: false,
    },
    name: {
      type: String,
      required: true,
      trim: true,
    },
  },
  { timestamps: true, strict: true }
)

export const AdminUser = model<AdminUserDocument>("AdminUser", adminUserSchema)
