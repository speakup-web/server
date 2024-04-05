import { type Express } from 'express'
import request from 'supertest'
import { UsersTableTestHelper } from '../helpers/UsersTableTestHelper'
import { createApp } from '@Infrastructures/http/express/app'
import { awilixContainer } from '@Infrastructures/containers/awilixContainer'
import { pool } from '@Infrastructures/database/postgres/pool'
import httpStatus from 'http-status'
import { UserBuilder } from '@Domains/entities/User/UserBuilder'
import { UserRole } from '@Domains/enums/UserRole'

describe('/users', () => {
  let app: Express
  let usersTableTestHelper: UsersTableTestHelper

  beforeAll(() => {
    usersTableTestHelper = new UsersTableTestHelper(pool)
  })

  beforeEach(() => {
    app = createApp(awilixContainer)
  })

  afterEach(async () => {
    await usersTableTestHelper.cleanTable()
  })

  afterAll(async () => {
    await pool.end()
  })

  describe('POST /users/task-force', () => {
    it('should response 400 when name is not provided', async () => {
      const requestPayload = {
        email: 'johndoe@mail.com',
        password: 'secret_password',
      }
      const admin = new UserBuilder(
        'Michael',
        'michael@mail.com',
        'secret_password',
        UserRole.ADMIN,
      ).build()
      await usersTableTestHelper.addUser(admin)

      const loginResponse = await request(app).post('/api/auth/login').send({
        email: admin.email,
        password: admin.password,
      })

      const response = await request(app)
        .post('/api/users/task-force')
        .set('Authorization', `Bearer ${loginResponse.body.data.accessToken}`)
        .send(requestPayload)

      expect(response.status).toEqual(httpStatus.BAD_REQUEST)
      expect(response.body).toHaveProperty('status', 'fail')
      expect(response.body).toHaveProperty('message')
    })

    it('should response 401 when create taskforce account as an anonymous', async () => {
      const requestPayload = {
        name: 'John Doe',
        email: 'johndoe@mail.com',
        password: 'secret_password',
      }

      const response = await request(app).post('/api/users/task-force').send(requestPayload)

      expect(response.status).toEqual(httpStatus.UNAUTHORIZED)
      expect(response.body).toHaveProperty('status', 'fail')
      expect(response.body).toHaveProperty('message')
    })

    it('should response 403 when create taskforce account as an taskforce', async () => {
      const requestPayload = {
        name: 'John Doe',
        email: 'johndoe@mail.com',
        password: 'secret_password',
      }
      const taskforce = new UserBuilder(
        'Michael',
        'michael@mail.com',
        'secret_password',
        UserRole.TASKFORCE,
      ).build()
      await usersTableTestHelper.addUser(taskforce)

      const loginResponse = await request(app).post('/api/auth/login').send({
        email: taskforce.email,
        password: taskforce.password,
      })

      const response = await request(app)
        .post('/api/users/task-force')
        .set('Authorization', `Bearer ${loginResponse.body.data.accessToken}`)
        .send(requestPayload)

      expect(response.status).toEqual(httpStatus.FORBIDDEN)
      expect(response.body).toHaveProperty('status', 'fail')
      expect(response.body).toHaveProperty('message')
    })

    it('should response 409 when email is already registered', async () => {
      const requestPayload = {
        name: 'John Doe',
        email: 'taskforce@mail.com',
        password: 'secret_password',
      }
      const admin = new UserBuilder(
        'Jane Doe',
        'janedoe@mail.com',
        'secret_password',
        UserRole.ADMIN,
      ).build()
      const taskforce = new UserBuilder(
        'Michael',
        'taskforce@mail.com',
        'secret_password',
        UserRole.TASKFORCE,
      ).build()
      await usersTableTestHelper.addUser(admin)
      await usersTableTestHelper.addUser(taskforce)

      const loginResponse = await request(app).post('/api/auth/login').send({
        email: admin.email,
        password: admin.password,
      })

      const response = await request(app)
        .post('/api/users/task-force')
        .set('Authorization', `Bearer ${loginResponse.body.data.accessToken}`)
        .send(requestPayload)

      expect(response.status).toEqual(httpStatus.CONFLICT)
      expect(response.body).toHaveProperty('status', 'fail')
      expect(response.body).toHaveProperty('message')
    })

    it('should response 201 when create taskforce account successfully', async () => {
      const requestPayload = {
        name: 'John Doe',
        email: 'johndoe@mail.com',
        password: 'secret_password',
      }
      const admin = new UserBuilder(
        'Jane Doe',
        'janedoe@mail.com',
        'secret_password',
        UserRole.ADMIN,
      ).build()
      await usersTableTestHelper.addUser(admin)

      const loginResponse = await request(app).post('/api/auth/login').send({
        email: admin.email,
        password: admin.password,
      })

      const response = await request(app)
        .post('/api/users/task-force')
        .set('Authorization', `Bearer ${loginResponse.body.data.accessToken}`)
        .send(requestPayload)

      expect(response.status).toEqual(httpStatus.CREATED)
      expect(response.body).toHaveProperty('status', 'success')
      expect(response.body).toHaveProperty('data')
      expect(response.body.data).toHaveProperty('userId')
    })
  })
})