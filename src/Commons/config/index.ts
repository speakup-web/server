/* istanbul ignore file */

import dotenv from 'dotenv'
import { resolve } from 'path'

dotenv.config({
  path: resolve(process.cwd(), `.env.${process.env.NODE_ENV}.local`),
})

export const config = {
  app: {
    host: process.env.APP_HOST ?? 'localhost',
    port: parseInt(process.env.APP_PORT ?? '3000', 10),
  },
  db: {
    connectionString: process.env.DATABASE_URL,
  },
  jwt: {
    secretKey: process.env.JWT_SECRET_KEY ?? 'secret',
    expiresIn: process.env.JWT_EXPIRES_IN ?? '3h',
  },
  cors: {
    origin: process.env.CORS_ORIGIN ?? '*',
  },
}
