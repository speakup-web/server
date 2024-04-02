import { type IncidentReport } from '@Domains/entitites/incidentReport'

export interface IIncidentReportRepository {
  save: (incidentReport: IncidentReport) => Promise<void>
}
