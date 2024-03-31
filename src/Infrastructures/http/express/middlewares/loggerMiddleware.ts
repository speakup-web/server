import { winstonLogger } from '@Infrastructures/loggers/winstonLogger'
import { type NextFunction, type Request, type Response } from 'express'

export function loggerMiddleware(req: Request, res: Response, next: NextFunction) {
  const { method, originalUrl, ip } = req
  const timestamp = new Date().toISOString()

  const start = Date.now()

  res.on('finish', () => {
    const duration = Date.now() - start
    const { statusCode } = res
    winstonLogger.info(
      `${timestamp} | ${ip} | ${method} ${originalUrl} | ${statusCode} | ${duration}ms`,
    )
  })

  next()
}
