import { type Express } from 'express'
import { awilixContainer } from '@Infrastructures/containers/awilixContainer'
import { createApp } from '@Infrastructures/http/express/app'
import request from 'supertest'
import httpStatus from 'http-status'
import { IncidentReportsTableTestHelper } from '../helpers/IncidentReportsTableTestHelper'
import { ReportersTableTestHelper } from '../helpers/ReportersTableTestHelper'
import { pool } from '@Infrastructures/database/postgres/pool'

describe('/incident-reports', () => {
  let app: Express
  let reportersTableTestHelper: ReportersTableTestHelper
  let incidentReportsTableTestHelper: IncidentReportsTableTestHelper

  beforeAll(() => {
    reportersTableTestHelper = new ReportersTableTestHelper(pool)
    incidentReportsTableTestHelper = new IncidentReportsTableTestHelper(pool)
  })

  beforeEach(() => {
    app = createApp(awilixContainer)
  })

  afterEach(async () => {
    await reportersTableTestHelper.cleanTable()
    await incidentReportsTableTestHelper.cleanTable()
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

    it('should resopnse 200 when create new incident report with valid payload', async () => {
      const requestPayload = {
        reporterName: 'John Doe',
        reporterEmail: 'example@mail.com',
        reporterPhone: '082123456789',
        incidentLocation: 'lorem ipsum',
        incidentDate: '2023-05-04',
        incidentDetail: 'lorem ipsum dolor sit amet consectetur',
      }

      const response = await request(app).post('/api/incident-reports').send(requestPayload)

      expect(response.status).toEqual(httpStatus.OK)
      expect(response.body).toHaveProperty('status', 'success')
      expect(response.body).toHaveProperty('data')
      expect(response.body.data).toHaveProperty('reportId')
    })
  })
})
