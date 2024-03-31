import * as request from 'supertest'
import * as httpStatus from 'http-status'
import { createApp } from '../app'
import { type AwilixContainer } from 'awilix'

describe('App', () => {
  it('should response 404 when request unregistered route', async () => {
    const app = createApp({} as AwilixContainer)
    const response = await request(app).post('/')

    expect(response.status).toEqual(httpStatus.NOT_FOUND)
  })

  it('should response 200 when request root route', async () => {
    const app = createApp({} as AwilixContainer)
    const response = await request(app).get('/')

    expect(response.status).toEqual(httpStatus.OK)
    expect(response.text).toEqual('Welcome to SpeakUp API')
  })

  it('should respond 500 when encountering internal server error', async () => {
    const app = createApp({} as AwilixContainer)
    const response = await request(app).post('/api/auth/login')

    expect(response.status).toEqual(httpStatus.INTERNAL_SERVER_ERROR)
    expect(response.body).toHaveProperty('status', 'error')
    expect(response.body).toHaveProperty('message')
  })
})
