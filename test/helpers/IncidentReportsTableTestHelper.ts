/* istanbul ignore file */

import { IncidentReport } from '@Domains/entities/IncidentReport/IncidentReport'
import { type QueryConfig, type Pool } from 'pg'

export class IncidentReportsTableTestHelper {
  constructor(private readonly pool: Pool) {}

  public async cleanTable(): Promise<void> {
    const query = `DELETE FROM incident_reports
                   WHERE 1=1`
    await this.pool.query(query)
  }

  public async addIncidentReport(incidentReport: IncidentReport): Promise<void> {
    const query: QueryConfig = {
      text: `INSERT INTO incident_reports (
                id,
                incident_location,
                incident_date,
                incident_detail,
                incident_status, 
                reporter_id)
             VALUES ($1, $2, $3, $4, $5, $6)`,
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

  public async findIncidentReports(): Promise<IncidentReport[] | null> {
    const query = `SELECT
                      id,
                      incident_location AS "incidentLocation",
                      incident_date AT TIME ZONE 'Asia/Jakarta' AS "incidentDate",
                      incident_detail AS "incidentDetail",
                      incident_status AS "incidentStatus",
                      reporter_id AS "reporterId"
                   FROM incident_reports`

    const { rowCount, rows } = await this.pool.query<IncidentReport>(query)

    if (!rowCount) {
      return null
    }

    const incidentReports = rows.map(
      (row) =>
        new IncidentReport(
          row.id,
          row.incidentLocation,
          row.incidentDate,
          row.incidentDetail,
          row.incidentStatus,
          row.reporterId,
        ),
    )

    return incidentReports
  }
}
