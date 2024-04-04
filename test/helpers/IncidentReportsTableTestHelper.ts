/* istanbul ignore file */

import { IncidentReport } from '@Domains/entities/IncidentReport/IncidentReport'
import { Reporter } from '@Domains/entities/Reporter/Reporter'
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
        incidentReport.reporter.id,
      ],
    }

    await this.pool.query(query)
  }

  public async findIncidentReports(): Promise<IncidentReport[]> {
    const query = `SELECT
                      ir.id,
                      ir.incident_location AS "incidentLocation",
                      ir.incident_date AT TIME ZONE 'Asia/Jakarta' AS "incidentDate",
                      ir.incident_detail AS "incidentDetail",
                      ir.incident_status AS "incidentStatus",
                      r.id AS "reporterId",
                      r.name AS "reporterName",
                      r.email AS "reporterEmail",
                      r.phone AS "reporterPhone"
                   FROM incident_reports AS ir
                   JOIN reporters AS r ON ir.reporter_id = r.id`

    const { rowCount, rows } = await this.pool.query(query)

    if (!rowCount) {
      return []
    }

    const incidentReports = rows.map((row) => {
      const reporter = new Reporter(
        row.reporterId,
        row.reporterName,
        row.reporterEmail,
        row.reporterPhone,
      )
      return new IncidentReport(
        row.id,
        row.incidentLocation,
        row.incidentDate,
        row.incidentDetail,
        row.incidentStatus,
        reporter,
      )
    })

    return incidentReports
  }
}
