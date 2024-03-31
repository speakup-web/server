import { type AwilixContainer } from 'awilix'

declare module 'express-serve-static-core' {
  export interface Request {
    container: AwilixContainer
  }
}
