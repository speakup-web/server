import * as awilix from 'awilix'
// Importing the external dependencies
import { pool } from '@Infrastructures/database/postgres/pool'
import * as jose from 'jose'
import * as bcrypt from 'bcrypt'
// Importing the validation schemas
import { LoginUserSchema } from '@Infrastructures/validators/zod/schemas/authSchemas'
import { CreateNewIncidentReportSchema } from '@Infrastructures/validators/zod/schemas/incidentReportSchemas'
// Importing the validator
import { ZodValidator } from '@Infrastructures/validators/zod/ZodValidator'
// Importing the repository
import { UserRepositoryPostgres } from '@Infrastructures/repositories/UserRepositoryPostgres'
import { JwtTokenManager } from '@Infrastructures/securities/JWTTokenManager'
import { BcryptHasher } from '@Infrastructures/securities/BcryptHasher'
// Importing the use cases
import { LoginUserUseCase } from '@Applications/use_cases/LoginUserUseCase'
import { CreateNewIncidentReportUseCase } from '@Applications/use_cases/CreateNewIncidentReportUseCase'
import { ReporterRepositoryPostgres } from '@Infrastructures/repositories/ReporterRepositoryPostgres'
import { IncidentReportRepositoryPostgres } from '@Infrastructures/repositories/IncidentReportRepositoryPostgres'

export const awilixContainer = awilix.createContainer({
  injectionMode: awilix.InjectionMode.CLASSIC,
})

awilixContainer.register({
  // Registering the validators
  loginUserValidator: awilix.asClass(ZodValidator<typeof LoginUserSchema>, {
    injector: () => ({
      schema: LoginUserSchema,
    }),
  }),
  createNewIncidentReportValidator: awilix.asClass(
    ZodValidator<typeof CreateNewIncidentReportSchema>,
    {
      injector: () => ({
        schema: CreateNewIncidentReportSchema,
      }),
    },
  ),

  // Registering the repository
  userRepository: awilix
    .asClass(UserRepositoryPostgres, {
      injector: () => ({
        pool,
      }),
    })
    .singleton(),
  tokenManager: awilix
    .asClass(JwtTokenManager, {
      injector: () => ({
        jwt: jose,
      }),
    })
    .singleton(),
  hasher: awilix
    .asClass(BcryptHasher, {
      injector: () => ({
        bcrypt,
      }),
    })
    .singleton(),
  reporterRepository: awilix
    .asClass(ReporterRepositoryPostgres, {
      injector: () => ({
        pool,
      }),
    })
    .singleton(),
  incidentReportRepository: awilix
    .asClass(IncidentReportRepositoryPostgres, {
      injector: () => ({
        pool,
      }),
    })
    .singleton(),

  // Registering the use cases
  loginUserUseCase: awilix.asClass(LoginUserUseCase, {
    injector: (instance) => ({
      validator: instance.resolve('loginUserValidator'),
      userRepository: instance.resolve('userRepository'),
      tokenManager: instance.resolve('tokenManager'),
      hasher: instance.resolve('hasher'),
    }),
  }),
  createNewIncidentReportUseCase: awilix.asClass(CreateNewIncidentReportUseCase, {
    injector: (instance) => ({
      validator: instance.resolve('createNewIncidentReportValidator'),
      reporterRepository: instance.resolve('reporterRepository'),
      incidentReportRepository: instance.resolve('incidentReportRepository'),
    }),
  }),
})
