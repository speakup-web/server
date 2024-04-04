import { z } from 'zod'

export const CreateNewIncidentReportSchema = z.object({
  reporterName: z.string().min(4).max(50),
  reporterEmail: z.string().email().max(50),
  reporterPhone: z.string().regex(/^(0|8|\+62)\d{9,15}$/),
  incidentLocation: z.string().min(4),
  incidentDate: z.coerce.date().max(new Date()),
  incidentDetail: z.string().min(15),
})
