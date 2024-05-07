import { type UserRole } from '@Domains/enums/UserRole'
import { type AwilixContainer } from 'awilix'

declare global {
  namespace Express {
    interface Request {
      container: AwilixContainer
      isAuthenticated: boolean
      user: {
        email: string
        role: UserRole
      }
    }
  }
}
