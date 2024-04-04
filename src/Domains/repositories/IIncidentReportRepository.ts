import { type IncidentReport } from '@Domains/entities/IncidentReport/IncidentReport'

export interface IIncidentReportRepository {
  findAll: (limit?: number, offset?: number, status?: string) => Promise<IncidentReport[]>
  countAll: () => Promise<number>
  save: (incidentReport: IncidentReport) => Promise<void>
}
