import * as request from 'supertest'
import * as httpStatus from 'http-status'
import { app } from '../app'

describe('App', () => {
  it('should response 404 when request unregistered route', async () => {
    const response = await request(app).post('/')

    expect(response.status).toEqual(httpStatus.NOT_FOUND)
  })

  it('should response 200 when request root route', async () => {
    const response = await request(app).get('/')

    expect(response.status).toEqual(httpStatus.OK)
    expect(response.text).toEqual('Welcome to SpeakUp API')
  })
})
