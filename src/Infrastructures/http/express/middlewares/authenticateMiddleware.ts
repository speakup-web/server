import { AuthenticationError } from '@Commons/exceptions/AuthenticationError'
import { type UserRole } from '@Domains/enums/UserRole'
import { JwtTokenManager } from '@Infrastructures/securities/JWTTokenManager'
import { type NextFunction, type Request, type Response } from 'express'
import * as jose from 'jose'

export function authenticateMiddleware({ required }: { required: boolean }) {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      const authorization = req.get('Authorization')

      if (authorization === undefined) {
        if (required) {
          throw new AuthenticationError('Authentication failed.')
        } else {
          req.isAuthenticated = false
          next()
          return
        }
      }

      const token = authorization.split(' ')[1]
      const jwtTokenManager = new JwtTokenManager(jose)
      const tokenPayload = await jwtTokenManager.verify(token)

      req.isAuthenticated = true
      req.user = {
        id: tokenPayload.id as string,
        role: tokenPayload.role as UserRole,
      }

      next()
    } catch (err) {
      if (err instanceof Error) {
        throw new AuthenticationError(err.message)
      }
    }
  }
}
