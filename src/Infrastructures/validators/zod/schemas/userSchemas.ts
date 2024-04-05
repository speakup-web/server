import { z } from 'zod'

export const RegisterUserSchema = z.object({
  name: z.string().min(4).max(50),
  email: z.string().email().max(50),
  password: z.string().min(8).max(50),
})
