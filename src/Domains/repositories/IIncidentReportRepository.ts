import { type IncidentReport } from '@Domains/entities/IncidentReport/IncidentReport'

export interface IIncidentReportRepository {
  findById: (id: string) => Promise<IncidentReport | null>
  findAll: (limit?: number, offset?: number, status?: string) => Promise<IncidentReport[]>
  countAll: (status?: string) => Promise<number>
  save: (incidentReport: IncidentReport) => Promise<void>
}
