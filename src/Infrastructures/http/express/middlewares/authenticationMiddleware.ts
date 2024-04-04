import { AuthenticationError } from '@Commons/exceptions/AuthenticationError'
import { type UserRole } from '@Domains/enums/UserRole'
import { JwtTokenManager } from '@Infrastructures/securities/JWTTokenManager'
import { type NextFunction, type Request, type Response } from 'express'
import * as jose from 'jose'

export async function authenticationMiddleware(
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> {
  try {
    const authorization = req.get('Authorization')

    if (!authorization) {
      throw new AuthenticationError('Authentication failed.')
    }

    const token = authorization.split(' ')[1]
    const jwtTokenManager = new JwtTokenManager(jose)
    const payload = await jwtTokenManager.verify(token)

    req.user = {
      id: payload.id as string,
      role: payload.role as UserRole,
    }

    next()
  } catch (err) {
    if (err instanceof Error) {
      throw new AuthenticationError(err.message)
    }
  }
}
