import { ClientError } from '@Commons/exceptions/clientError'
import { winstonLogger } from '@Infrastructures/loggers/winstonLogger'
import { type NextFunction, type Request, type Response } from 'express'
import * as httpStatus from 'http-status'

export function errorMiddleware(err: unknown, req: Request, res: Response, next: NextFunction) {
  if (err instanceof Error) {
    winstonLogger.error(err)

    if (err instanceof ClientError) {
      res.status(err.statusCode).json({
        status: 'fail',
        message: err.message,
      })
    }

    res.status(httpStatus.INTERNAL_SERVER_ERROR).json({
      status: 'error',
      message: 'Internal Server Error.',
    })
  }

  next()
}
