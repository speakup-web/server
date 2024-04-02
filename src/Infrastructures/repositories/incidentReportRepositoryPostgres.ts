import { type IncidentReport } from '@Domains/entitites/incidentReport'
import { type IIncidentReportRepository } from '@Domains/repositories/incidentReportRepository'
import { type Pool, type QueryConfig } from 'pg'

export class IncidentReportRepositoryPostgres implements IIncidentReportRepository {
  constructor(private readonly pool: Pool) {}

  async save(incidentReport: IncidentReport): Promise<void> {
    const query: QueryConfig = {
      text: `INSERT INTO incident_reports (id, incident_location, incident_date, incident_detail, incident_status, reporter_id)
             VALUES ($1, $2, $3, $4, $5, $6)
             ON CONFLICT (id) DO
             UPDATE SET incident_location = $2, incident_date = $3, incident_detail = $4, incident_status = $5`,
      values: [
        incidentReport.id,
        incidentReport.incidentLocation,
        incidentReport.incidentDate,
        incidentReport.incidentDetail,
        incidentReport.incidentStatus,
        incidentReport.reporterId,
      ],
    }

    await this.pool.query(query)
  }
}
