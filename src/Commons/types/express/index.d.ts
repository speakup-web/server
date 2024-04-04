import { type UserRole } from '@Domains/enums/UserRole'
import { type AwilixContainer } from 'awilix'

declare module 'express-serve-static-core' {
  export interface Request {
    container: AwilixContainer
    isAuthenticated: boolean
    user: {
      id: string
      role: UserRole
    }
  }
}
