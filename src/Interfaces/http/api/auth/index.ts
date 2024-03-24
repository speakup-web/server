import type { Plugin } from '@hapi/hapi'
import type { PluginOptions } from '../../../../Applications/common/types'
import { AuthHandler } from './handler'
import { routes } from './routes'

export const auth: Plugin<PluginOptions> = {
  name: 'auth',
  register(server, options) {
    const authHandler = new AuthHandler(options.container)
    server.route(routes(authHandler))
  },
}
