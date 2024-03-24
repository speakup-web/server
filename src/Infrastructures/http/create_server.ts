import * as Hapi from '@hapi/hapi'
import * as Jwt from '@hapi/jwt'
import { config } from '@Applications/common/config'
import { ClientError } from '@Applications/common/exceptions/ClientError'
import * as httpStatus from 'http-status'
import type { Container, PluginOptions } from 'types'

import { auth } from '@Interfaces/http/api/auth'

export const createServer = async (container: Container) => {
  const server = Hapi.server({
    host: config.app.host,
    port: config.app.port,
  })

  await server.register(Jwt)

  server.auth.strategy('speakup-jwt', 'jwt', {
    keys: config.jwt.secretKey,
    verify: {
      aud: false,
      iss: false,
      sub: false,
      maxAgeSec: config.jwt.expiresIn,
    },
    validate: async (artifacts) => ({
      isValid: true,
      credentials: {
        email: artifacts.decoded.payload.email,
        role: artifacts.decoded.payload.role,
      },
    }),
  } as Jwt.HapiJwt.Options)

  await server.register([
    {
      plugin: auth,
      options: { container },
    },
  ] as Hapi.ServerRegisterPluginObject<PluginOptions>[])

  server.ext('onPreResponse', (request, h) => {
    const { response } = request

    if (response instanceof Error) {
      if (response instanceof ClientError) {
        const newResponse = h.response({
          status: 'fail',
          message: response.message,
        })
        newResponse.code(response.statusCode)

        return newResponse
      }

      if (!response.isServer) {
        return h.continue
      }

      const newResponse = h.response({
        status: 'error',
        message: 'There was a failure on our server.',
      })
      newResponse.code(httpStatus.INTERNAL_SERVER_ERROR)

      return newResponse
    }

    return h.continue
  })

  return server
}
