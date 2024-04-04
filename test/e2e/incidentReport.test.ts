import { type Express } from 'express'
import { awilixContainer } from '@Infrastructures/containers/awilixContainer'
import { createApp } from '@Infrastructures/http/express/app'
import request from 'supertest'
import httpStatus from 'http-status'
import { IncidentReportsTableTestHelper } from '../helpers/IncidentReportsTableTestHelper'
import { ReportersTableTestHelper } from '../helpers/ReportersTableTestHelper'
import { pool } from '@Infrastructures/database/postgres/pool'
import { UserBuilder } from '@Domains/entities/User/UserBuilder'
import { UserRole } from '@Domains/enums/UserRole'
import { UsersTableTestHelper } from '../helpers/UsersTableTestHelper'
import { IncidentStatus } from '@Domains/enums/IncidentStatus'

describe('/incident-reports', () => {
  let app: Express
  let reportersTableTestHelper: ReportersTableTestHelper
  let incidentReportsTableTestHelper: IncidentReportsTableTestHelper
  let usersTableTestHelper: UsersTableTestHelper

  beforeAll(() => {
    reportersTableTestHelper = new ReportersTableTestHelper(pool)
    incidentReportsTableTestHelper = new IncidentReportsTableTestHelper(pool)
    usersTableTestHelper = new UsersTableTestHelper(pool)
  })

  beforeEach(() => {
    app = createApp(awilixContainer)
  })

  afterEach(async () => {
    await reportersTableTestHelper.cleanTable()
    await incidentReportsTableTestHelper.cleanTable()
    await usersTableTestHelper.cleanTable()
  })

  afterAll(async () => {
    await pool.end()
  })

  describe('/POST /incident-reports', () => {
    it('should response 400 when request payload not contain needed property', async () => {
      const requestPayload = {
        reporterName: 'John Doe',
        reporterEmail: 'example@mail.com',
        incidentLocation: 'lorem ipsum',
        incidentDate: '2024-05-04',
        incidentDetail: 'lorem ipsum dolor sit amet consectetur',
      }

      const response = await request(app).post('/api/incident-reports').send(requestPayload)

      expect(response.status).toEqual(httpStatus.BAD_REQUEST)
      expect(response.body).toHaveProperty('status', 'fail')
      expect(response.body).toHaveProperty('message')
    })

    it('should response 409 when there is data conflict', async () => {
      const requestPayload = {
        reporterName: 'John Doe',
        reporterEmail: 'john@mail.com',
        reporterPhone: '082123456789',
        incidentLocation: 'lorem ipsum',
        incidentDate: '2023-05-04',
        incidentDetail: 'lorem ipsum dolor sit amet consectetur',
      }

      await request(app).post('/api/incident-reports').send({
        reporterName: 'John Doe',
        reporterEmail: 'johndoe@mail.com',
        reporterPhone: '082123456789',
        incidentLocation: 'lorem ipsum',
        incidentDate: '2023-05-04',
        incidentDetail: 'lorem ipsum dolor sit amet consectetur',
      })

      const response = await request(app).post('/api/incident-reports').send(requestPayload)

      expect(response.status).toEqual(httpStatus.CONFLICT)
      expect(response.body).toHaveProperty('status', 'fail')
      expect(response.body).toHaveProperty('message')
    })

    it('should resopnse 200 when create new incident report with valid payload', async () => {
      const requestPayload = {
        reporterName: 'John Doe',
        reporterEmail: 'example@mail.com',
        reporterPhone: '082123456789',
        incidentLocation: 'lorem ipsum',
        incidentDate: '2023-05-04',
        incidentDetail: 'lorem ipsum dolor sit amet consectetur',
      }

      await request(app).post('/api/incident-reports').send({
        reporterName: 'John Doe',
        reporterEmail: 'example@mail.com',
        reporterPhone: '082123456789',
        incidentLocation: 'lorem ipsum',
        incidentDate: '2023-05-04',
        incidentDetail: 'lorem ipsum dolor sit amet consectetur',
      })

      const response = await request(app).post('/api/incident-reports').send(requestPayload)

      const reporters = await reportersTableTestHelper.findReporters()
      const incidentReports = await incidentReportsTableTestHelper.findIncidentReports()
      expect(response.status).toEqual(httpStatus.OK)
      expect(response.body).toHaveProperty('status', 'success')
      expect(response.body).toHaveProperty('data')
      expect(response.body.data).toHaveProperty('reportId')
      expect(reporters).toHaveLength(1)
      expect(incidentReports).toHaveLength(2)
    })
  })

  describe('GET /incident-reports', () => {
    it('should response 401 when request without token', async () => {
      const response = await request(app).get('/api/incident-reports')

      expect(response.status).toEqual(httpStatus.UNAUTHORIZED)
      expect(response.body).toHaveProperty('status', 'fail')
      expect(response.body).toHaveProperty('message')
    })

    it('should response 401 when request with invalid token', async () => {
      const response = await request(app)
        .get('/api/incident-reports')
        .set('Authorization', 'Bearer invalid-token')

      expect(response.status).toEqual(httpStatus.UNAUTHORIZED)
      expect(response.body).toHaveProperty('status', 'fail')
      expect(response.body).toHaveProperty('message')
    })

    it('should response 200 when request with valid token', async () => {
      const user = new UserBuilder(
        'John Doe',
        'johndoe@example.com',
        'secret_password',
        UserRole.TASKFORCE,
      ).build()
      await usersTableTestHelper.addUser(user)

      const loginResponse = await request(app).post('/api/auth/login').send({
        email: user.email,
        password: user.password,
      })

      const response = await request(app)
        .get('/api/incident-reports')
        .set('Authorization', `Bearer ${loginResponse.body.data.accessToken}`)

      expect(response.status).toEqual(httpStatus.OK)
      expect(response.body).toHaveProperty('status', 'success')
      expect(response.body).toHaveProperty('data')
      expect(response.body.data).toHaveProperty('count', 0)
      expect(response.body.data).toHaveProperty('results')
      expect(response.body.data.results).toHaveLength(0)
    })

    it('should response 200 when request with valid token and query params', async () => {
      const user = new UserBuilder(
        'John Doe',
        'johndoe@example.com',
        'secret_password',
        UserRole.TASKFORCE,
      ).build()
      await usersTableTestHelper.addUser(user)

      await request(app).post('/api/incident-reports').send({
        reporterName: 'John Doe',
        reporterEmail: 'example@mail.com',
        reporterPhone: '082123456789',
        incidentLocation: 'lorem ipsum',
        incidentDate: '2023-05-04',
        incidentDetail: 'lorem ipsum dolor sit amet consectetur',
      })
      const createNewIncidentReportResponse = await request(app)
        .post('/api/incident-reports')
        .send({
          reporterName: 'Jane Smith',
          reporterEmail: 'jane@example.com',
          reporterPhone: '081234567890',
          incidentLocation: 'Lorem ipsum dolor sit amet',
          incidentDate: '2023-06-15',
          incidentDetail: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit.',
        })
      await request(app).post('/api/incident-reports').send({
        reporterName: 'Alice Johnson',
        reporterEmail: 'alice@example.com',
        reporterPhone: '089876543210',
        incidentLocation: 'Consectetur adipiscing elit',
        incidentDate: '2023-07-20',
        incidentDetail: 'Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.',
      })

      const loginResponse = await request(app).post('/api/auth/login').send({
        email: user.email,
        password: user.password,
      })

      const response = await request(app)
        .get('/api/incident-reports')
        .query({
          offset: 1,
          limit: 1,
        })
        .set('Authorization', `Bearer ${loginResponse.body.data.accessToken}`)

      expect(response.status).toEqual(httpStatus.OK)
      expect(response.body).toHaveProperty('status', 'success')
      expect(response.body).toHaveProperty('data')
      expect(response.body.data).toHaveProperty('count', 3)
      expect(response.body.data).toHaveProperty('results')
      expect(response.body.data.results).toHaveLength(1)
      expect(response.body.data.results[0]).toHaveProperty(
        'id',
        createNewIncidentReportResponse.body.data.reportId,
      )
    })
  })

  describe('GET /incident-reports/stats', () => {
    it('should response 401 when request without token', async () => {
      const response = await request(app).get('/api/incident-reports/stats')

      expect(response.status).toEqual(httpStatus.UNAUTHORIZED)
      expect(response.body).toHaveProperty('status', 'fail')
      expect(response.body).toHaveProperty('message')
    })

    it('should response 401 when request with invalid token', async () => {
      const response = await request(app)
        .get('/api/incident-reports/stats')
        .set('Authorization', 'Bearer invalid-token')

      expect(response.status).toEqual(httpStatus.UNAUTHORIZED)
      expect(response.body).toHaveProperty('status', 'fail')
      expect(response.body).toHaveProperty('message')
    })

    it('should response 200 when request with valid token', async () => {
      const taskforce = new UserBuilder(
        'John Doe',
        'johndoe@mail.com',
        'secret_password',
        UserRole.TASKFORCE,
      ).build()
      await usersTableTestHelper.addUser(taskforce)

      const createNewIncidentReportResponse1 = await request(app)
        .post('/api/incident-reports')
        .send({
          reporterName: 'John Doe',
          reporterEmail: 'john@mail.com',
          reporterPhone: '082123456789',
          incidentLocation: 'lorem ipsum',
          incidentDate: '2023-05-04',
          incidentDetail: 'lorem ipsum dolor sit amet consectetur',
        })
      const createNewIncidentReportResponse2 = await request(app)
        .post('/api/incident-reports')
        .send({
          reporterName: 'Jane Smith',
          reporterEmail: 'jane@example.com',
          reporterPhone: '081234567890',
          incidentLocation: 'Lorem ipsum dolor sit amet',
          incidentDate: '2023-06-15',
          incidentDetail: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit.',
        })
      const createNewIncidentReportResponse3 = await request(app)
        .post('/api/incident-reports')
        .send({
          reporterName: 'John Doe',
          reporterEmail: 'john@mail.com',
          reporterPhone: '082123456789',
          incidentLocation: 'Consectetur adipiscing elit',
          incidentDate: '2023-07-20',
          incidentDetail: 'Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.',
        })
      await incidentReportsTableTestHelper.setIncidentReportStatus(
        createNewIncidentReportResponse1.body.data.reportId,
        IncidentStatus.ON_PROGRESS,
      )
      await incidentReportsTableTestHelper.setIncidentReportStatus(
        createNewIncidentReportResponse2.body.data.reportId,
        IncidentStatus.ON_PROGRESS,
      )
      await incidentReportsTableTestHelper.setIncidentReportStatus(
        createNewIncidentReportResponse3.body.data.reportId,
        IncidentStatus.DONE,
      )

      const loginResponse = await request(app).post('/api/auth/login').send({
        email: taskforce.email,
        password: taskforce.password,
      })

      const response = await request(app)
        .get('/api/incident-reports/stats')
        .set('Authorization', `Bearer ${loginResponse.body.data.accessToken}`)

      expect(response.status).toEqual(httpStatus.OK)
      expect(response.body).toHaveProperty('status', 'success')
      expect(response.body).toHaveProperty('data')
      expect(response.body.data).toHaveProperty('totalReporters', 2)
      expect(response.body.data).toHaveProperty('submitedReports', 3)
      expect(response.body.data).toHaveProperty('onProgressReports', 2)
      expect(response.body.data).toHaveProperty('doneReports', 1)
    })
  })

  describe('GET /incident-reports/{reportId}', () => {
    it('should response 404 when report not found', async () => {
      const response = await request(app).get('/api/incident-reports/report-xxx')

      expect(response.status).toEqual(httpStatus.NOT_FOUND)
      expect(response.body).toHaveProperty('status', 'fail')
      expect(response.body).toHaveProperty('message')
    })

    it('should response 200 when report found and without token', async () => {
      const createNewIncidentReportResponse = await request(app)
        .post('/api/incident-reports')
        .send({
          reporterName: 'John Doe',
          reporterEmail: 'john@mail.com',
          reporterPhone: '082123456789',
          incidentLocation: 'Consectetur adipiscing elit',
          incidentDate: '2023-07-20',
          incidentDetail: 'Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.',
        })

      await incidentReportsTableTestHelper.setIncidentReportStatus(
        createNewIncidentReportResponse.body.data.reportId,
        IncidentStatus.ON_PROGRESS,
      )

      const response = await request(app).get(
        `/api/incident-reports/${createNewIncidentReportResponse.body.data.reportId}`,
      )

      expect(response.status).toEqual(httpStatus.OK)
      expect(response.body).toHaveProperty('status', 'success')
      expect(response.body).toHaveProperty('data')
      expect(response.body.data).toHaveProperty(
        'id',
        createNewIncidentReportResponse.body.data.reportId,
      )
      expect(response.body.data).toHaveProperty('incidentLocation')
      expect(response.body.data).toHaveProperty('incidentDate')
      expect(response.body.data).toHaveProperty('incidentDetail')
      expect(response.body.data).toHaveProperty('incidentStatus')
      expect(response.body.data.incidentStatus).toHaveProperty('submited', true)
      expect(response.body.data.incidentStatus).toHaveProperty('onProgress', true)
      expect(response.body.data.incidentStatus).toHaveProperty('canceled', false)
      expect(response.body.data.incidentStatus).toHaveProperty('done', false)
    })

    it('should response 200 when report with done status found', async () => {
      const createNewIncidentReportResponse = await request(app)
        .post('/api/incident-reports')
        .send({
          reporterName: 'John Doe',
          reporterEmail: 'john@mail.com',
          reporterPhone: '082123456789',
          incidentLocation: 'Consectetur adipiscing elit',
          incidentDate: '2023-07-20',
          incidentDetail: 'Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.',
        })

      await incidentReportsTableTestHelper.setIncidentReportStatus(
        createNewIncidentReportResponse.body.data.reportId,
        IncidentStatus.DONE,
      )

      const response = await request(app).get(
        `/api/incident-reports/${createNewIncidentReportResponse.body.data.reportId}`,
      )

      expect(response.status).toEqual(httpStatus.OK)
      expect(response.body).toHaveProperty('status', 'success')
      expect(response.body).toHaveProperty('data')
      expect(response.body.data).toHaveProperty(
        'id',
        createNewIncidentReportResponse.body.data.reportId,
      )
      expect(response.body.data).toHaveProperty('incidentLocation')
      expect(response.body.data).toHaveProperty('incidentDate')
      expect(response.body.data).toHaveProperty('incidentDetail')
      expect(response.body.data).toHaveProperty('incidentStatus')
      expect(response.body.data.incidentStatus).toHaveProperty('submited', true)
      expect(response.body.data.incidentStatus).toHaveProperty('onProgress', true)
      expect(response.body.data.incidentStatus).toHaveProperty('canceled', false)
      expect(response.body.data.incidentStatus).toHaveProperty('done', true)
    })

    it('should response 200 when report found and with token', async () => {
      const user = new UserBuilder(
        'Jane Doe',
        'janedoe@mail.com',
        'secret_password',
        UserRole.TASKFORCE,
      ).build()
      await usersTableTestHelper.addUser(user)

      const createNewIncidentReportResponse = await request(app)
        .post('/api/incident-reports')
        .send({
          reporterName: 'John Doe',
          reporterEmail: 'john@mail.com',
          reporterPhone: '082123456789',
          incidentLocation: 'Consectetur adipiscing elit',
          incidentDate: '2023-07-20',
          incidentDetail: 'Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.',
        })

      await incidentReportsTableTestHelper.setIncidentReportStatus(
        createNewIncidentReportResponse.body.data.reportId,
        IncidentStatus.CANCELED,
      )

      const loginResponse = await request(app).post('/api/auth/login').send({
        email: user.email,
        password: user.password,
      })

      const response = await request(app)
        .get(`/api/incident-reports/${createNewIncidentReportResponse.body.data.reportId}`)
        .set('Authorization', `Bearer ${loginResponse.body.data.accessToken}`)

      expect(response.status).toEqual(httpStatus.OK)
      expect(response.body).toHaveProperty('status', 'success')
      expect(response.body).toHaveProperty('data')
      expect(response.body.data).toHaveProperty(
        'id',
        createNewIncidentReportResponse.body.data.reportId,
      )
      expect(response.body.data).toHaveProperty('reporterName')
      expect(response.body.data).toHaveProperty('reporterEmail')
      expect(response.body.data).toHaveProperty('reporterPhone')
      expect(response.body.data).toHaveProperty('incidentLocation')
      expect(response.body.data).toHaveProperty('incidentDate')
      expect(response.body.data).toHaveProperty('incidentDetail')
      expect(response.body.data).toHaveProperty('incidentStatus')
      expect(response.body.data.incidentStatus).toHaveProperty('submited', true)
      expect(response.body.data.incidentStatus).toHaveProperty('onProgress', true)
      expect(response.body.data.incidentStatus).toHaveProperty('canceled', true)
      expect(response.body.data.incidentStatus).toHaveProperty('done', true)
    })
  })
})
