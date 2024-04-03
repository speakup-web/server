import { CreateNewIncidentReportSchema } from '../incidentReportSchemas'

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
})
