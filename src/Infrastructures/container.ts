import { InjectionMode, asClass, createContainer } from 'awilix'
import { token } from '@hapi/jwt'
import * as bcrypt from 'bcrypt'
import { pool } from './database/postgres/pool'
import { loginSchema } from './validation/joi/schemas/auth.schema'
import { JoiValidator } from './validation/joi'
import { UserRepositoryPostgres } from './repositories/postgres/user.repository'
import { LoginUseCase } from '@Applications/use_cases/login.use_case'
import { JwtTokenManager } from './security/JwtTokenManager'
import { BcryptHasher } from './security/BcryptHasher'

export const container = createContainer()

container.register({
  // Register all validators
  loginValidator: asClass(JoiValidator, {
    injectionMode: InjectionMode.CLASSIC,
    injector: () => ({
      schema: loginSchema,
    }),
  }),
})

container.register({
  // Register all repositories & services
  userRepository: asClass(UserRepositoryPostgres, {
    injectionMode: InjectionMode.CLASSIC,
    injector: () => ({
      pool,
    }),
  }).singleton(),
  tokenManager: asClass(JwtTokenManager, {
    injectionMode: InjectionMode.CLASSIC,
    injector: () => ({
      token,
    }),
  }),
  hasher: asClass(BcryptHasher, {
    injectionMode: InjectionMode.CLASSIC,
    injector: () => ({
      bcrypt,
    }),
  }),
})

container.register({
  // Register all use cases
  loginUseCase: asClass(LoginUseCase, {
    injector: () => ({
      userRepository: container.resolve('userRepository'),
      validator: container.resolve('loginValidator'),
      tokenManager: container.resolve('tokenManager'),
      hasher: container.resolve('hasher'),
    }),
  }),
})
