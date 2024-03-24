import { pool } from '@Infrastructures/database/postgres/pool'
import { UsersTableTestHelper } from '../../../../tests/UsersTableTestHelper'
import { createServer } from '../create_server'
import { container } from '@Infrastructures/container'
import * as httpStatus from 'http-status'
import * as bcrypt from 'bcrypt'

describe('POST /auth/login', () => {
  const usersTableTestHelper = new UsersTableTestHelper(pool)

  afterEach(async () => {
    await usersTableTestHelper.truncateTable()
  })

  afterAll(async () => {
    await pool.end()
  })

  it('should response 400 if the payload is incomplete', async () => {
    const requestPayload = {
      email: 'johndoe@mail.com',
    }
    const server = await createServer(container)

    const response = await server.inject({
      method: 'POST',
      url: '/auth/login',
      payload: requestPayload,
    })

    const responseJson = JSON.parse(response.payload)
    expect(response.statusCode).toEqual(httpStatus.BAD_REQUEST)
    expect(responseJson.status).toEqual('fail')
    expect(responseJson.message).toBeDefined()
  })

  it('should response 400 if email is not found', async () => {
    const requestPayload = {
      email: 'johndoe@mail.com',
      password: 'password',
    }
    const server = await createServer(container)

    const response = await server.inject({
      method: 'POST',
      url: '/auth/login',
      payload: requestPayload,
    })

    const responseJson = JSON.parse(response.payload)
    expect(response.statusCode).toEqual(httpStatus.BAD_REQUEST)
    expect(responseJson.status).toEqual('fail')
    expect(responseJson.message).toBeDefined()
  })

  it('should response 401 if password is incorrect', async () => {
    const requestPayload = {
      email: 'johndoe@mail.com',
      password: 'password',
    }
    const server = await createServer(container)

    await usersTableTestHelper.addUser({
      email: requestPayload.email,
      password: 'anotherpassword',
    })

    const response = await server.inject({
      method: 'POST',
      url: '/auth/login',
      payload: requestPayload,
    })

    const responseJson = JSON.parse(response.payload)
    expect(response.statusCode).toEqual(httpStatus.UNAUTHORIZED)
    expect(responseJson.status).toEqual('fail')
    expect(responseJson.message).toBeDefined()
  })

  it('should response 200 if login success', async () => {
    const requestPayload = {
      email: 'johndoe@mail.com',
      password: 'password',
    }
    const server = await createServer(container)

    const encryptedPassword = await bcrypt.hash(requestPayload.password, 10)
    await usersTableTestHelper.addUser({
      email: requestPayload.email,
      password: encryptedPassword,
    })

    const response = await server.inject({
      method: 'POST',
      url: '/auth/login',
      payload: requestPayload,
    })

    const responseJson = JSON.parse(response.payload)
    expect(response.statusCode).toEqual(httpStatus.OK)
    expect(responseJson.status).toEqual('success')
    expect(responseJson.data.token).toBeDefined()
  })
})
