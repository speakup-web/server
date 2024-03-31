import { User } from '@Domains/entitites/user'
import { createApp } from '@Infrastructures/http/express/app'
import * as request from 'supertest'
import { UsersTableTestHelper } from '../helpers/usersTableTestHelper'
import * as httpStatus from 'http-status'
import { pool } from '@Infrastructures/database/postgres/pool'
import { awilixContainer } from '@Infrastructures/containers/awilixContainer'
import { type Express } from 'express'

describe('/auth', () => {
  describe('POST /auth/login', () => {
    let usersTableTestHelper: UsersTableTestHelper
    let app: Express

    beforeAll(() => {
      usersTableTestHelper = new UsersTableTestHelper(pool)
    })

    beforeEach(async () => {
      app = createApp(awilixContainer)
    })

    afterEach(async () => {
      await usersTableTestHelper.cleanTable()
    })

    afterAll(async () => {
      await pool.end()
    })

    it('should response 400 when request payload not contain needed property', async () => {
      const requestPayload = {
        email: 'example@mail',
      }

      const response = await request(app).post('/api/auth/login').send(requestPayload)

      expect(response.status).toEqual(httpStatus.BAD_REQUEST)
      expect(response.body).toHaveProperty('status', 'fail')
      expect(response.body).toHaveProperty('message')
    })

    it('should response 401 if password does not match', async () => {
      const requestPayload = {
        email: 'johndoe@mail.com',
        password: 'non_matching_password',
      }
      const user = new User({
        id: 'user-123',
        email: requestPayload.email,
        name: 'John Doe',
        password: 'secret_password',
        role: 'admin',
      })

      await usersTableTestHelper.addUser(user)

      const response = await request(app).post('/api/auth/login').send(requestPayload)

      expect(response.status).toEqual(httpStatus.UNAUTHORIZED)
      expect(response.body).toHaveProperty('status', 'fail')
      expect(response.body).toHaveProperty('message')
    })

    it('should response 200 when logging with valid credentials', async () => {
      const requestPayload = {
        email: 'johndoe@mail.com',
        password: 'secret_password',
      }
      const user = new User({
        id: 'user-123',
        email: requestPayload.email,
        name: 'John Doe',
        password: requestPayload.password,
        role: 'admin',
      })

      await usersTableTestHelper.addUser(user)

      const response = await request(app).post('/api/auth/login').send(requestPayload)

      expect(response.status).toEqual(httpStatus.OK)
      expect(response.body).toHaveProperty('status', 'success')
      expect(response.body).toHaveProperty('data')
      expect(response.body.data).toHaveProperty('accessToken')
    })
  })
})
