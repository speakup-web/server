import { type NextFunction, type Request, type Response } from 'express'
import httpStatus from 'http-status'
import { ClientError } from '@Commons/exceptions/ClientError'
import { winstonInstance } from '@Infrastructures/loggers/winstonInstance'

export function customErrorHandler(
  err: unknown,
  req: Request,
  res: Response,
  next: NextFunction,
): void {
  if (err instanceof ClientError) {
    res.status(err.statusCode).json({
      status: 'fail',
      message: err.message,
    })
  } else {
    next(err)
  }
}

export function unknownErrorHandler(
  err: unknown,
  req: Request,
  res: Response,
  next: NextFunction,
): void {
  if (err instanceof Error) {
    winstonInstance.error(err.message)

    res.status(httpStatus.INTERNAL_SERVER_ERROR).json({
      status: 'error',
      message: 'Internal Server Error.',
    })
  }
}
