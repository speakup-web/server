import { IncidentStatus } from '@Domains/enums/IncidentStatus'
import { z } from 'zod'

export const CreateNewIncidentReportSchema = z.object({
  reporterName: z.string().min(4).max(50),
  reporterEmail: z.string().email().max(50),
  reporterPhone: z.string().regex(/^(0|8|\+62)\d{9,15}$/),
  incidentLocation: z.string().min(4),
  incidentDate: z.coerce.date().max(new Date()),
  incidentDetail: z.string().min(15),
})

export const GetAllIncidentReportsSchema = z.object({
  limit: z.coerce.number().int().min(1).max(20).default(20),
  offset: z.coerce.number().int().min(0).default(0),
  status: z.nativeEnum(IncidentStatus).optional(),
})

export const GetIncidentReportDetailSchema = z.object({
  reportId: z.string(),
  isAuthenticated: z.boolean(),
})
