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

  describe('GET /users/task-force', () => {
    it('should response 401 when get taskforce accounts as an anonymous', async () => {
      const response = await request(app).get('/api/users/task-force')

      expect(response.status).toEqual(httpStatus.UNAUTHORIZED)
      expect(response.body).toHaveProperty('status', 'fail')
      expect(response.body).toHaveProperty('message')
    })

    it('should response 403 when get taskforce accounts as an taskforce', async () => {
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
        .get('/api/users/task-force')
        .set('Authorization', `Bearer ${loginResponse.body.data.accessToken}`)

      expect(response.status).toEqual(httpStatus.FORBIDDEN)
      expect(response.body).toHaveProperty('status', 'fail')
      expect(response.body).toHaveProperty('message')
    })

    it('should response 400 when limit is invalid', async () => {
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
        .get('/api/users/task-force')
        .set('Authorization', `Bearer ${loginResponse.body.data.accessToken}`)
        .query({
          limit: 'invalid_limit',
        })

      expect(response.status).toEqual(httpStatus.BAD_REQUEST)
      expect(response.body).toHaveProperty('status', 'fail')
      expect(response.body).toHaveProperty('message')
    })

    it('should response 200 when get taskforce accounts successfully', async () => {
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

      await request(app)
        .post('/api/users/task-force')
        .set('Authorization', `Bearer ${loginResponse.body.data.accessToken}`)
        .send({
          name: 'John Doe',
          email: 'johndoe@mail.com',
          password: 'secret_password',
        })
      await request(app)
        .post('/api/users/task-force')
        .set('Authorization', `Bearer ${loginResponse.body.data.accessToken}`)
        .send({
          name: 'Jane Doe',
          email: 'janedoe@mail.com',
          password: 'secret_password',
        })

      const response = await request(app)
        .get('/api/users/task-force')
        .set('Authorization', `Bearer ${loginResponse.body.data.accessToken}`)

      expect(response.status).toEqual(httpStatus.OK)
      expect(response.body).toHaveProperty('status', 'success')
      expect(response.body).toHaveProperty('data')
      expect(response.body.data).toHaveProperty('count', 2)
      expect(response.body.data).toHaveProperty('results')
      expect(response.body.data.results).toHaveLength(2)
    })
  })

  describe('GET /users/profile', () => {
    it('should response 401 when get profile as an anonymous', async () => {
      const response = await request(app).get('/api/users/profile')

      expect(response.status).toEqual(httpStatus.UNAUTHORIZED)
      expect(response.body).toHaveProperty('status', 'fail')
      expect(response.body).toHaveProperty('message')
    })

    it('should response 200 when get profile information successfully', async () => {
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
        .get('/api/users/profile')
        .set('Authorization', `Bearer ${loginResponse.body.data.accessToken}`)

      expect(response.status).toEqual(httpStatus.OK)
      expect(response.body).toHaveProperty('status', 'success')
      expect(response.body).toHaveProperty('data')
      expect(response.body.data).toHaveProperty('name')
      expect(response.body.data).toHaveProperty('email')
    })
  })

  describe('PUT /users/profile', () => {
    it('should response 401 when update profile as an anonymous', async () => {
      const response = await request(app).put('/api/users/profile')

      expect(response.status).toEqual(httpStatus.UNAUTHORIZED)
      expect(response.body).toHaveProperty('status', 'fail')
      expect(response.body).toHaveProperty('message')
    })

    it('should response 400 when name is invalid', async () => {
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
        .put('/api/users/profile')
        .set('Authorization', `Bearer ${loginResponse.body.data.accessToken}`)
        .send({
          name: 'abc',
        })

      expect(response.status).toEqual(httpStatus.BAD_REQUEST)
      expect(response.body).toHaveProperty('status', 'fail')
      expect(response.body).toHaveProperty('message')
    })

    it('should response 200 when edit profile successfully without sending payload', async () => {
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
        .put('/api/users/profile')
        .set('Authorization', `Bearer ${loginResponse.body.data.accessToken}`)

      expect(response.status).toEqual(httpStatus.OK)
      expect(response.body).toHaveProperty('status', 'success')
      expect(response.body).toHaveProperty('data')
      expect(response.body.data).toHaveProperty('userId')
    })

    it('should response 200 when edit profile successfully', async () => {
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
        .put('/api/users/profile')
        .set('Authorization', `Bearer ${loginResponse.body.data.accessToken}`)
        .send({
          name: 'Michael Doe',
          password: 'new_secret_password',
        })

      expect(response.status).toEqual(httpStatus.OK)
      expect(response.body).toHaveProperty('status', 'success')
      expect(response.body).toHaveProperty('data')
      expect(response.body.data).toHaveProperty('userId')
    })
  })

  describe('DELETE /users/task-force/{userEmail}', () => {
    it('should response 401 when delete taskforce account as an anonymous', async () => {
      const response = await request(app).delete('/api/users/task-force/non.existing@mail.com')

      expect(response.status).toEqual(httpStatus.UNAUTHORIZED)
      expect(response.body).toHaveProperty('status', 'fail')
      expect(response.body).toHaveProperty('message')
    })

    it('should response 403 when delete taskforce account as taskforce', async () => {
      const taskforce1 = new UserBuilder(
        'John Doe',
        'john@mail.com',
        'secret_password',
        UserRole.TASKFORCE,
      ).build()
      const taskforce2 = new UserBuilder(
        'Jane Doe',
        'jane@mail.com',
        'secret_password',
        UserRole.TASKFORCE,
      ).build()
      await usersTableTestHelper.addUser(taskforce1)
      await usersTableTestHelper.addUser(taskforce2)

      const loginResponse = await request(app).post('/api/auth/login').send({
        email: taskforce1.email,
        password: taskforce1.password,
      })

      const response = await request(app)
        .delete(`/api/users/task-force/${taskforce2.email}`)
        .set('Authorization', `Bearer ${loginResponse.body.data.accessToken}`)

      expect(response.status).toEqual(httpStatus.FORBIDDEN)
      expect(response.body).toHaveProperty('status', 'fail')
      expect(response.body).toHaveProperty('message')
    })

    it('should response 404 when delete non-existing account', async () => {
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
        .delete('/api/users/task-force/non.existing@mail.com')
        .set('Authorization', `Bearer ${loginResponse.body.data.accessToken}`)

      expect(response.status).toEqual(httpStatus.NOT_FOUND)
      expect(response.body).toHaveProperty('status', 'fail')
      expect(response.body).toHaveProperty('message')
    })

    it('should response 400 when delete admin account', async () => {
      const admin1 = new UserBuilder(
        'Michael',
        'michael@mail.com',
        'secret_password',
        UserRole.ADMIN,
      ).build()
      const admin2 = new UserBuilder(
        'John Doe',
        'john@mail.com',
        'secret_password',
        UserRole.ADMIN,
      ).build()
      await usersTableTestHelper.addUser(admin1)
      await usersTableTestHelper.addUser(admin2)

      const loginResponse = await request(app).post('/api/auth/login').send({
        email: admin1.email,
        password: admin1.password,
      })

      const response = await request(app)
        .delete(`/api/users/task-force/${admin2.email}`)
        .set('Authorization', `Bearer ${loginResponse.body.data.accessToken}`)

      expect(response.status).toEqual(httpStatus.BAD_REQUEST)
      expect(response.body).toHaveProperty('status', 'fail')
      expect(response.body).toHaveProperty('message')
    })

    it('should response 200 when delete taskforce account successfully', async () => {
      const admin = new UserBuilder(
        'Michael',
        'michael@mail.com',
        'secret_password',
        UserRole.ADMIN,
      ).build()
      const taskforce = new UserBuilder(
        'John Doe',
        'john@mail.com',
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
        .delete(`/api/users/task-force/${taskforce.email}`)
        .set('Authorization', `Bearer ${loginResponse.body.data.accessToken}`)

      expect(response.status).toEqual(httpStatus.OK)
      expect(response.body).toHaveProperty('status', 'success')
      expect(response.body).toHaveProperty('data')
      expect(response.body.data).toHaveProperty('userId')
    })
  })

  describe('PUT /users/task-force/{userEmail}', () => {
    it('should response 401 when edit taskforce account as an anonymous', async () => {
      const response = await request(app).put('/api/users/task-force/non.existing@mail.com')

      expect(response.status).toEqual(httpStatus.UNAUTHORIZED)
      expect(response.body).toHaveProperty('status', 'fail')
      expect(response.body).toHaveProperty('message')
    })

    it('should response 403 when edit taskforce account as taskforce', async () => {
      const taskforce1 = new UserBuilder(
        'John Doe',
        'john@mail.com',
        'secret_password',
        UserRole.TASKFORCE,
      ).build()
      const taskforce2 = new UserBuilder(
        'Jane Doe',
        'jane@mail.com',
        'secret_password',
        UserRole.TASKFORCE,
      ).build()
      await usersTableTestHelper.addUser(taskforce1)
      await usersTableTestHelper.addUser(taskforce2)

      const loginResponse = await request(app).post('/api/auth/login').send({
        email: taskforce1.email,
        password: taskforce1.password,
      })

      const response = await request(app)
        .put(`/api/users/task-force/${taskforce2.email}`)
        .set('Authorization', `Bearer ${loginResponse.body.data.accessToken}`)

      expect(response.status).toEqual(httpStatus.FORBIDDEN)
      expect(response.body).toHaveProperty('status', 'fail')
      expect(response.body).toHaveProperty('message')
    })

    it('should response 404 when edit non-existing account', async () => {
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
        .put('/api/users/task-force/non.existing@mail.com')
        .set('Authorization', `Bearer ${loginResponse.body.data.accessToken}`)

      expect(response.status).toEqual(httpStatus.NOT_FOUND)
      expect(response.body).toHaveProperty('status', 'fail')
      expect(response.body).toHaveProperty('message')
    })

    it('should response 400 when edit admin account', async () => {
      const admin1 = new UserBuilder(
        'Michael',
        'michael@mail.com',
        'secret_password',
        UserRole.ADMIN,
      ).build()
      const admin2 = new UserBuilder(
        'John Doe',
        'john@mail.com',
        'secret_password',
        UserRole.ADMIN,
      ).build()
      await usersTableTestHelper.addUser(admin1)
      await usersTableTestHelper.addUser(admin2)

      const loginResponse = await request(app).post('/api/auth/login').send({
        email: admin1.email,
        password: admin1.password,
      })

      const response = await request(app)
        .put(`/api/users/task-force/${admin2.email}`)
        .set('Authorization', `Bearer ${loginResponse.body.data.accessToken}`)

      expect(response.status).toEqual(httpStatus.BAD_REQUEST)
      expect(response.body).toHaveProperty('status', 'fail')
      expect(response.body).toHaveProperty('message')
    })

    it('should response 200 when edit taskforce account without payload', async () => {
      const admin = new UserBuilder(
        'Michael',
        'michael@mail.com',
        'secret_password',
        UserRole.ADMIN,
      ).build()
      const taskforce = new UserBuilder(
        'John Doe',
        'john@mail.com',
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
        .put(`/api/users/task-force/${taskforce.email}`)
        .set('Authorization', `Bearer ${loginResponse.body.data.accessToken}`)

      expect(response.status).toEqual(httpStatus.OK)
      expect(response.body).toHaveProperty('status', 'success')
      expect(response.body).toHaveProperty('data')
      expect(response.body.data).toHaveProperty('userId')
    })

    it('should response 200 when edit taskforce account successfuly', async () => {
      const admin = new UserBuilder(
        'Michael',
        'michael@mail.com',
        'secret_password',
        UserRole.ADMIN,
      ).build()
      const taskforce = new UserBuilder(
        'John Doe',
        'john@mail.com',
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
        .put(`/api/users/task-force/${taskforce.email}`)
        .set('Authorization', `Bearer ${loginResponse.body.data.accessToken}`)
        .send({
          name: 'Johny Doe',
          password: 'new_secret_password',
        })

      expect(response.status).toEqual(httpStatus.OK)
      expect(response.body).toHaveProperty('status', 'success')
      expect(response.body).toHaveProperty('data')
      expect(response.body.data).toHaveProperty('userId')
    })
  })
})
