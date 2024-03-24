import type { Container } from '@Applications/common/types'
import { createServer } from '../create_server'
import * as httpStatus from 'http-status'

describe('createServer', () => {
  it('should response 404 when request unregistered route', async () => {
    const server = await createServer({} as Container)

    const response = await server.inject({
      method: 'GET',
      url: '/unregistered-route',
    })

    expect(response.statusCode).toEqual(404)
  })

  it('should handle server error correctly', async () => {
    // Arrange
    const requestPayload = {
      email: 'johndoe@mail.com',
      password: 'password',
    }
    const server = await createServer({} as Container)

    const response = await server.inject({
      method: 'POST',
      url: '/auth/login',
      payload: requestPayload,
    })

    const responseJson = JSON.parse(response.payload)
    expect(response.statusCode).toEqual(httpStatus.INTERNAL_SERVER_ERROR)
    expect(responseJson.status).toEqual('error')
    expect(responseJson.message).toEqual('There was a failure on our server.')
  })
})
