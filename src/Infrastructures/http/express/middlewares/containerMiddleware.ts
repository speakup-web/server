import { type AwilixContainer } from 'awilix'
import { type NextFunction, type Request, type Response } from 'express'

export function containerMiddleware(container: AwilixContainer) {
  return (req: Request, res: Response, next: NextFunction): void => {
    req.container = container
    next()
  }
}
