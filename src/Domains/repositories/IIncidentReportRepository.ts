import { type IncidentReport } from '@Domains/entities/IncidentReport/IncidentReport'

export interface IIncidentReportRepository {
  save: (incidentReport: IncidentReport) => Promise<void>
}
