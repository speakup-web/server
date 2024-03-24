import * as Joi from 'joi'

export const loginSchema = Joi.object({
  email: Joi.string().email().max(50).required(),
  password: Joi.string().min(8).max(50).required(),
})
