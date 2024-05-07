import { createContainer, asClass, InjectionMode } from 'awilix'
// Importing the external dependencies
import { pool } from '@Infrastructures/database/postgres/pool'
import * as jose from 'jose'
import bcrypt from 'bcrypt'
// Importing the validation schemas
import { LoginUserSchema } from '@Infrastructures/validators/zod/schemas/authSchemas'
import {
  CreateNewIncidentReportSchema,
  GetAllIncidentReportsSchema,
  GetIncidentReportDetailSchema,
  UpdateIncidentReportStatusSchema,
} from '@Infrastructures/validators/zod/schemas/incidentReportSchemas'
import {
  GetTaskforceProfilesSchema,
  RegisterUserSchema,
  GetUserProfileSchema,
  UpdateUserSchema,
  DeleteUserSchema,
  UpdateTaskforceSchema,
} from '@Infrastructures/validators/zod/schemas/userSchemas'
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
import { GetAllIncidentReportsUseCase } from '@Applications/use_cases/GetAllIncidentReportsUseCase'
import { GetIncidentReportStatsUseCase } from '@Applications/use_cases/GetIncidentReportStatsUseCase'
import { GetIncidentReportDetailUseCase } from '@Applications/use_cases/GetIncidentReportDetailUseCase'
import { UpdateIncidentReportStatusUseCase } from '@Applications/use_cases/UpdateIncidentReportStatusUseCase'
import { CreateTaskforceAccountUseCase } from '@Applications/use_cases/CreateTaskforceAccountUseCase'
import { GetTaskforceProfilesUseCase } from '@Applications/use_cases/GetTaskforceProfilesUseCase'
import { GetUserProfileUseCase } from '@Applications/use_cases/GetUserProfileUseCase'
import { UpdateUserUseCase } from '@Applications/use_cases/UpdateUserUseCase'
import { DeleteTaskforceUseCase } from '@Applications/use_cases/DeleteTaskforceUseCase'
import { UpdateTaskforceUseCase } from '@Applications/use_cases/UpdateTaskforceUseCase'

export const awilixContainer = createContainer({
  injectionMode: InjectionMode.CLASSIC,
})

awilixContainer.register({
  // Registering the validators
  loginUserValidator: asClass(ZodValidator<typeof LoginUserSchema>, {
    injector: () => ({
      schema: LoginUserSchema,
    }),
  }),
  createNewIncidentReportValidator: asClass(ZodValidator<typeof CreateNewIncidentReportSchema>, {
    injector: () => ({
      schema: CreateNewIncidentReportSchema,
    }),
  }),
  getAllIncidentReportsValidator: asClass(ZodValidator<typeof GetAllIncidentReportsSchema>, {
    injector: () => ({
      schema: GetAllIncidentReportsSchema,
    }),
  }),
  getIncidentReportDetailValidator: asClass(ZodValidator<typeof GetIncidentReportDetailSchema>, {
    injector: () => ({
      schema: GetIncidentReportDetailSchema,
    }),
  }),
  updateIncidentReportStatusValidator: asClass(
    ZodValidator<typeof UpdateIncidentReportStatusSchema>,
    {
      injector: () => ({
        schema: UpdateIncidentReportStatusSchema,
      }),
    },
  ),
  registerUserValidator: asClass(ZodValidator<typeof RegisterUserSchema>, {
    injector: () => ({
      schema: RegisterUserSchema,
    }),
  }),
  getTaskforceProfilesValidator: asClass(ZodValidator<typeof GetTaskforceProfilesSchema>, {
    injector: () => ({
      schema: GetTaskforceProfilesSchema,
    }),
  }),
  getUserProfileValidator: asClass(ZodValidator<typeof GetUserProfileSchema>, {
    injector: () => ({
      schema: GetUserProfileSchema,
    }),
  }),
  updateUserValidator: asClass(ZodValidator<typeof UpdateUserSchema>, {
    injector: () => ({
      schema: UpdateUserSchema,
    }),
  }),
  deleteUserValidator: asClass(ZodValidator<typeof DeleteUserSchema>, {
    injector: () => ({
      schema: DeleteUserSchema,
    }),
  }),
  updateTaskforceValidator: asClass(ZodValidator<typeof UpdateTaskforceSchema>, {
    injector: () => ({
      schema: UpdateTaskforceSchema,
    }),
  }),

  // Registering the repository
  userRepository: asClass(UserRepositoryPostgres, {
    injector: () => ({
      pool,
    }),
  }).singleton(),
  tokenManager: asClass(JwtTokenManager, {
    injector: () => ({
      jwt: jose,
    }),
  }).singleton(),
  hasher: asClass(BcryptHasher, {
    injector: () => ({
      bcrypt,
    }),
  }).singleton(),
  reporterRepository: asClass(ReporterRepositoryPostgres, {
    injector: () => ({
      pool,
    }),
  }).singleton(),
  incidentReportRepository: asClass(IncidentReportRepositoryPostgres, {
    injector: () => ({
      pool,
    }),
  }).singleton(),

  // Registering the use cases
  loginUserUseCase: asClass(LoginUserUseCase, {
    injector: (instance) => ({
      validator: instance.resolve('loginUserValidator'),
      userRepository: instance.resolve('userRepository'),
      tokenManager: instance.resolve('tokenManager'),
      hasher: instance.resolve('hasher'),
    }),
  }),
  createNewIncidentReportUseCase: asClass(CreateNewIncidentReportUseCase, {
    injector: (instance) => ({
      validator: instance.resolve('createNewIncidentReportValidator'),
      reporterRepository: instance.resolve('reporterRepository'),
      incidentReportRepository: instance.resolve('incidentReportRepository'),
    }),
  }),
  getAllIncidentReportsUseCase: asClass(GetAllIncidentReportsUseCase, {
    injector: (instance) => ({
      validator: instance.resolve('getAllIncidentReportsValidator'),
      incidentReportRepository: instance.resolve('incidentReportRepository'),
    }),
  }),
  getIncidentReportStatsUseCase: asClass(GetIncidentReportStatsUseCase, {
    injector: (instance) => ({
      incidentReportRepository: instance.resolve('incidentReportRepository'),
    }),
  }),
  getIncidentReportDetailUseCase: asClass(GetIncidentReportDetailUseCase, {
    injector: (instance) => ({
      validator: instance.resolve('getIncidentReportDetailValidator'),
      incidentReportRepository: instance.resolve('incidentReportRepository'),
    }),
  }),
  updateIncidentReportStatusUseCase: asClass(UpdateIncidentReportStatusUseCase, {
    injector: (instance) => ({
      validator: instance.resolve('updateIncidentReportStatusValidator'),
      incidentReportRepository: instance.resolve('incidentReportRepository'),
    }),
  }),
  createTaskforceAccountUseCase: asClass(CreateTaskforceAccountUseCase, {
    injector: (instance) => ({
      validator: instance.resolve('registerUserValidator'),
      userRepository: instance.resolve('userRepository'),
      hasher: instance.resolve('hasher'),
    }),
  }),
  getTaskforceProfilesUseCase: asClass(GetTaskforceProfilesUseCase, {
    injector: (instance) => ({
      validator: instance.resolve('getTaskforceProfilesValidator'),
      userRepository: instance.resolve('userRepository'),
    }),
  }),
  getUserProfileUseCase: asClass(GetUserProfileUseCase, {
    injector: (instance) => ({
      validator: instance.resolve('getUserProfileValidator'),
      userRepository: instance.resolve('userRepository'),
    }),
  }),
  updateUserUseCase: asClass(UpdateUserUseCase, {
    injector: (instance) => ({
      validator: instance.resolve('updateUserValidator'),
      userRepository: instance.resolve('userRepository'),
      hasher: instance.resolve('hasher'),
    }),
  }),
  deleteTaskforceUseCase: asClass(DeleteTaskforceUseCase, {
    injector: (instance) => ({
      validator: instance.resolve('deleteUserValidator'),
      userRepository: instance.resolve('userRepository'),
    }),
  }),
  updateTaskforceUseCase: asClass(UpdateTaskforceUseCase, {
    injector: (instance) => ({
      validator: instance.resolve('updateTaskforceValidator'),
      userRepository: instance.resolve('userRepository'),
      hasher: instance.resolve('hasher'),
    }),
  }),
})
