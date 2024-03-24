import { ServerRoute } from '@hapi/hapi'
import type { AuthHandler } from './handler'

export const routes = (handler: AuthHandler): ServerRoute[] => [
  {
    method: 'POST',
    path: '/auth/login',
    handler: handler.postAuthLoginHandler,
  },
]
