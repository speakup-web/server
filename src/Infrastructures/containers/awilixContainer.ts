import * as awilix from 'awilix'
// Importing the external dependencies
import { pool } from '@Infrastructures/database/postgres/pool'
import * as jose from 'jose'
import * as bcrypt from 'bcrypt'
// Importing the validation schemas
import { LoginUserSchema } from '@Infrastructures/validators/zod/schemas/authSchemas'
// Importing the validator
import { ZodValidator } from '@Infrastructures/validators/zod/ZodValidator'
// Importing the repository
import { UserRepositoryPostgres } from '@Infrastructures/repositories/UserRepositoryPostgres'
import { JwtTokenManager } from '@Infrastructures/securities/JWTTokenManager'
// Importing the use cases
import { LoginUserUseCase } from '@Applications/use_cases/LoginUserUseCase'
import { BcryptHasher } from '@Infrastructures/securities/BcryptHasher'

export const awilixContainer = awilix.createContainer({
  injectionMode: awilix.InjectionMode.CLASSIC,
})

awilixContainer.register({
  // Registering the validators
  loginValidator: awilix.asClass(ZodValidator<typeof LoginUserSchema>, {
    injector: () => ({
      schema: LoginUserSchema,
    }),
  }),

  // Registering the repository
  userRepository: awilix.asClass(UserRepositoryPostgres, {
    injector: () => ({
      pool,
    }),
  }),
  tokenManager: awilix.asClass(JwtTokenManager, {
    injector: () => ({
      jwt: jose,
    }),
  }),
  hasher: awilix.asClass(BcryptHasher, {
    injector: () => ({
      bcrypt,
    }),
  }),

  // Registering the use cases
  loginUserUseCase: awilix.asClass(LoginUserUseCase, {
    injector: (instance) => ({
      validator: instance.resolve('loginValidator'),
      userRepository: instance.resolve('userRepository'),
      tokenManager: instance.resolve('tokenManager'),
      hasher: instance.resolve('hasher'),
    }),
  }),
})
