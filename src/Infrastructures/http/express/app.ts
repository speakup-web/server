import express from 'express'
import cors from 'cors'
import 'express-async-errors'
import expressWinston from 'express-winston'
import { type AwilixContainer } from 'awilix'
import { routes } from '@Interfaces/api/routes'
import { errorMiddleware } from './middlewares/errorMiddleware'
import { containerMiddleware } from './middlewares/containerMiddleware'
import { winstonInstance } from '@Infrastructures/loggers/winstonInstance'

export function createApp(container: AwilixContainer): express.Express {
  const app = express()

  app.use(cors())
  app.use(express.json())
  app.use(expressWinston.logger({ winstonInstance, responseWhitelist: ['body'] }))

  app.use('/api', containerMiddleware(container), routes)

  app.get('/', (req, res) => {
    res.send('Welcome to SpeakUp API')
  })

  app.use(expressWinston.errorLogger({ winstonInstance }))
  app.use(errorMiddleware)

  return app
}
