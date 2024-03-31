import * as awilix from 'awilix'
// Importing the external dependencies
import { pool } from '@Infrastructures/database/postgres/pool'
import * as jose from 'jose'
import * as bcrypt from 'bcrypt'
// Importing the validation schemas
import { LoginSchema } from '@Infrastructures/validation/zod/schemas/authSchemas'
// Importing the validator
import { ZodValidator } from '@Infrastructures/validation/zod/zodValidator'
// Importing the repository
import { UserRepositoryPostgres } from '@Infrastructures/repositories/userRepositoryPostgres'
import { JwtTokenManager } from '@Infrastructures/security/jwtTokenManager'
// Importing the use cases
import { LoginUseCase } from '@Applications/use_cases/loginUseCase'
import { BcryptHasher } from '@Infrastructures/security/bcryptHasher'

export const awilixContainer = awilix.createContainer({
  injectionMode: awilix.InjectionMode.CLASSIC,
})

awilixContainer.register({
  // Registering the external dependencies
  pool: awilix.asValue(pool),
  jwt: awilix.asValue(jose),
  bcrypt: awilix.asValue(bcrypt),

  // Registering the validation schemas
  loginSchema: awilix.asValue(LoginSchema),

  // Registering the validators
  loginValidator: awilix.asClass(ZodValidator, {
    injector: (instance) => ({
      schema: instance.resolve('loginSchema'),
    }),
  }),

  // Registering the repository
  userRepository: awilix.asClass(UserRepositoryPostgres, {
    injector: (instance) => ({
      pool: instance.resolve('pool'),
    }),
  }),
  tokenManager: awilix.asClass(JwtTokenManager, {
    injector: (instance) => ({
      jwt: instance.resolve('jwt'),
    }),
  }),
  hasher: awilix.asClass(BcryptHasher, {
    injector: (instance) => ({
      bcrypt: instance.resolve('bcrypt'),
    }),
  }),

  // Registering the use cases
  loginUseCase: awilix.asClass(LoginUseCase, {
    injector: (instance) => ({
      validator: instance.resolve('loginValidator'),
      userRepository: instance.resolve('userRepository'),
      tokenManager: instance.resolve('tokenManager'),
      hasher: instance.resolve('hasher'),
    }),
  }),
})