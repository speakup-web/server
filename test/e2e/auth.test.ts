import { createApp } from '@Infrastructures/http/express/app'
import request from 'supertest'
import { UsersTableTestHelper } from '../helpers/UsersTableTestHelper'
import httpStatus from 'http-status'
import { pool } from '@Infrastructures/database/postgres/pool'
import { awilixContainer } from '@Infrastructures/containers/awilixContainer'
import { type Express } from 'express'
import { UserBuilder } from '@Domains/entities/User/UserBuilder'
import { UserRole } from '@Domains/enums/UserRole'

describe('/auth', () => {
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

  describe('POST /auth/login', () => {
    it('should response 400 when request payload not contain needed property', async () => {
      const requestPayload = {
        email: 'example@mail',
      }

      const response = await request(app).post('/api/auth/login').send(requestPayload)

      expect(response.status).toEqual(httpStatus.BAD_REQUEST)
      expect(response.body).toHaveProperty('status', 'fail')
      expect(response.body).toHaveProperty('message')
    })

    it('should response 401 when email is not found', async () => {
      const requestPayload = {
        email: 'johndoe@mail.com',
        password: 'secret_password',
      }

      const response = await request(app).post('/api/auth/login').send(requestPayload)

      expect(response.status).toEqual(httpStatus.UNAUTHORIZED)
      expect(response.body).toHaveProperty('status', 'fail')
      expect(response.body).toHaveProperty('message')
    })

    it('should response 401 when password does not match', async () => {
      const requestPayload = {
        email: 'johndoe@mail.com',
        password: 'non_matching_password',
      }
      const user = new UserBuilder(
        'John Doe',
        requestPayload.email,
        'secret_password',
        UserRole.ADMIN,
      ).build()
      await usersTableTestHelper.addUser(user)

      const response = await request(app).post('/api/auth/login').send(requestPayload)

      expect(response.status).toEqual(httpStatus.UNAUTHORIZED)
      expect(response.body).toHaveProperty('status', 'fail')
      expect(response.body).toHaveProperty('message')
    })

    it('should response 200 when logging with valid credentials', async () => {
      const requestPayload = {
        email: 'johndoe1@mail.com',
        password: 'secret_password',
      }
      const user = new UserBuilder(
        'John Doe',
        requestPayload.email,
        requestPayload.password,
        UserRole.ADMIN,
      ).build()
      await usersTableTestHelper.addUser(user)

      const response = await request(app).post('/api/auth/login').send(requestPayload)

      expect(response.status).toEqual(httpStatus.OK)
      expect(response.body).toHaveProperty('status', 'success')
      expect(response.body).toHaveProperty('data')
      expect(response.body.data).toHaveProperty('accessToken')
    })
  })
})
