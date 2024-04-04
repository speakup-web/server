import { IncidentStatus } from '@Domains/enums/IncidentStatus'
import {
  CreateNewIncidentReportSchema,
  GetAllIncidentReportsSchema,
} from '../incidentReportSchemas'

describe('incidentReportSchemas', () => {
  describe('IncidentReportSchema', () => {
    it('should invalidates when object is empty', () => {
      const payload = {}

      const { success } = CreateNewIncidentReportSchema.safeParse(payload)

      expect(success).toEqual(false)
    })

    it('should invalidates when the date format is invalid', () => {
      const payload = {
        reporterName: 'Lorem ipsum',
        reporterEmail: 'example@mail.com',
        reporterPhone: '123456789',
        incidentLocation: 'lorem ipsum',
        incidentDate: '2021/13/23',
        incidentDetail: 'lorem ipsum dolor sit amet consectetur',
      }

      const { success } = CreateNewIncidentReportSchema.safeParse(payload)

      expect(success).toEqual(false)
    })

    it('should invalidates when reporterPhone is not a valid phone number', () => {
      const payload = {
        reporterName: 'Lorem ipsum',
        reporterEmail: 'example@mail.com',
        reporterPhone: '123456789',
        incidentLocation: 'lorem ipsum',
        incidentDate: new Date(2024, 8 - 1, 20),
        incidentDetail: 'lorem ipsum dolor sit amet consectetur',
      }

      const { success } = CreateNewIncidentReportSchema.safeParse(payload)

      expect(success).toEqual(false)
    })

    it('should validates when payload is correct', () => {
      const payload = {
        reporterName: 'Lorem ipsum',
        reporterEmail: 'example@mail.com',
        reporterPhone: '+6281123456789',
        incidentLocation: 'lorem ipsum',
        incidentDate: new Date(2023, 8 - 1, 20),
        incidentDetail: 'lorem ipsum dolor sit amet consectetur',
      }

      const { success } = CreateNewIncidentReportSchema.safeParse(payload)

      expect(success).toEqual(true)
    })
  })

  describe('GetAllIncidentReportsSchema', () => {
    it('should invalidates when limit is less than 1', () => {
      const payload = {
        limit: '0',
        offset: '0',
        status: IncidentStatus.ON_PROGRESS,
      }

      const { success } = GetAllIncidentReportsSchema.safeParse(payload)

      expect(success).toEqual(false)
    })

    it('should invalidates when offset is invalid', () => {
      const payload = {
        limit: '1',
        offset: 'x',
        status: IncidentStatus.ON_PROGRESS,
      }

      const { success } = GetAllIncidentReportsSchema.safeParse(payload)

      expect(success).toEqual(false)
    })

    it('should invalidates when status is invalid', () => {
      const payload = {
        limit: '1',
        offset: '0',
        status: 'invalid-status',
      }

      const { success } = GetAllIncidentReportsSchema.safeParse(payload)

      expect(success).toEqual(false)
    })

    it('should validates when status is undefined', () => {
      const payload = {
        limit: '10',
        offset: '0',
      }

      const { success } = GetAllIncidentReportsSchema.safeParse(payload)

      expect(success).toEqual(true)
    })

    it('should validates when paylad is correct', () => {
      const payload = {
        limit: '10',
        offset: '0',
        status: IncidentStatus.ON_PROGRESS,
      }

      const { success } = GetAllIncidentReportsSchema.safeParse(payload)

      expect(success).toEqual(true)
    })
  })
})
