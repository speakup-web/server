import express from 'express'
import cors from 'cors'
import 'express-async-errors'
import { routes } from '@Interfaces/api/routes'
import { errorMiddleware } from './middlewares/errorMiddleware'
import { loggerMiddleware } from './middlewares/loggerMiddleware'
import { type AwilixContainer } from 'awilix'

export function createApp(container: AwilixContainer): express.Express {
  const app = express()

  app.use(cors())
  app.use(express.json())
  app.use(loggerMiddleware)

  app.use(
    '/api',
    (req, res, next) => {
      req.container = container
      next()
    },
    routes,
  )

  app.get('/', (req, res) => {
    res.send('Welcome to SpeakUp API')
  })

  app.use(errorMiddleware)

  return app
}
