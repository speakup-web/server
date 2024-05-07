import { UserRole } from '@Domains/enums/UserRole'
import { z } from 'zod'

export const RegisterUserSchema = z.object({
  name: z.string().min(4).max(50),
  email: z.string().email().max(50),
  password: z.string().min(8).max(50),
})

export const GetTaskforceProfilesSchema = z.object({
  limit: z.coerce.number().int().positive().max(20).default(20),
  offset: z.coerce.number().int().min(0).default(0),
})

const UserSchema = z.object({
  email: z.string(),
  role: z.nativeEnum(UserRole),
})

export const GetUserProfileSchema = z.object({
  user: UserSchema,
})

export const UpdateUserSchema = z.object({
  user: UserSchema,
  name: z.string().min(4).max(50).optional(),
  password: z.string().min(8).max(50).optional(),
})

export const DeleteUserSchema = z.object({
  email: z.string().email().max(50),
})

export const UpdateTaskforceSchema = z.object({
  email: z.string().min(4).max(50),
  name: z.string().min(4).max(50).optional(),
  password: z.string().min(8).max(50).optional(),
})
