import { AuthorizationError } from '@Commons/exceptions/AuthorizationError'
import { type UserRole } from '@Domains/enums/UserRole'
import { type NextFunction, type Request, type Response } from 'express'

export function authorizeMiddleware(userRoles: UserRole[]) {
  return (req: Request, res: Response, next: NextFunction) => {
    const { role } = req.user

    if (!userRoles.includes(role)) {
      throw new AuthorizationError('You are not authorized to access this resource')
    }

    next()
  }
}
