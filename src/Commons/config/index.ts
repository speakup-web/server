import * as dotenv from 'dotenv'
import { resolve } from 'path'

dotenv.config({
  path: resolve(process.cwd(), `.env.${process.env.NODE_ENV}.local`),
})

export const config = {
  app: {
    host: process.env.APP_HOST,
    port: process.env.APP_PORT,
  },
  db: {
    connectionString: process.env.DATABASE_URL,
  },
  jwt: {
    secretKey: process.env.JWT_SECRET_KEY,
    expiresIn: process.env.JWT_EXPIRES_IN,
  },
}
