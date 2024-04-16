import express, { type Express } from 'express'
import cors from 'cors'
import 'express-async-errors'
import { logger, errorLogger } from 'express-winston'
import { type AwilixContainer } from 'awilix'
import { routes } from '@Interfaces/api/routes'
import { customErrorHandler, unknownErrorHandler } from './middlewares/errorMiddleware'
import { containerMiddleware } from './middlewares/containerMiddleware'
import { winstonInstance } from '@Infrastructures/loggers/winstonInstance'
import { config } from '@Commons/config'

export function createApp(container: AwilixContainer): Express {
  const app = express()

  app.use(cors({ origin: config.cors.origin }))
  app.use(express.json())
  app.use(logger({ winstonInstance, responseWhitelist: ['body'] }))

  app.use('/api', containerMiddleware(container), routes)

  app.get('/', (req, res) => {
    res.send('Welcome to SpeakUp API')
  })

  app.use(customErrorHandler)
  app.use(errorLogger({ winstonInstance }))
  app.use(unknownErrorHandler)

  return app
}
