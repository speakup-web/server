/* istanbul ignore file */

import * as dotenv from 'dotenv'
import { resolve } from 'path'

dotenv.config({
  path: resolve(process.cwd(), `.env.${process.env.NODE_ENV}.local`),
})

export const config = {
  app: {
    host: process.env.APP_HOST || 'localhost',
    port: Number(process.env.APP_PORT) || 3000,
  },
  database: {
    host: process.env.DB_HOST || 'localhost',
    port: Number(process.env.DB_PORT) || 5432,
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || 'password',
    database: process.env.DB_DATABASE || 'my_database',
  },
  jwt: {
    secretKey: process.env.JWT_SECRET_KEY || 'secret',
    expiresIn: Number(process.env.JWT_EXPIRES_IN) || 3000,
  },
}
