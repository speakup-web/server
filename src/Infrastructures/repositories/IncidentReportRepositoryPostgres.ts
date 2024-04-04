import { IncidentReport } from '@Domains/entities/IncidentReport/IncidentReport'
import { Reporter } from '@Domains/entities/Reporter/Reporter'
import { type IIncidentReportRepository } from '@Domains/repositories/IIncidentReportRepository'
import { type Pool, type QueryConfig } from 'pg'

export class IncidentReportRepositoryPostgres implements IIncidentReportRepository {
  constructor(private readonly pool: Pool) {}

  public async findAll(
    limit: number,
    offset: number,
    status?: string | undefined,
  ): Promise<IncidentReport[]> {
    let text = `SELECT
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
                JOIN reporters AS r ON ir.reporter_id = r.id
                WHERE 1=1 `

    const values: any[] = []

    if (status) {
      text += `AND ir.incident_status = $${values.length + 1} `
      values.push(status)
    }

    text += `ORDER BY ir.incident_date DESC
             LIMIT $${values.length + 1} OFFSET $${values.length + 2}`

    values.push(limit, offset)

    const query: QueryConfig = {
      text,
      values,
    }

    const { rowCount, rows } = await this.pool.query(query)

    if (!rowCount) {
      return []
    }

    return rows.map((row) => {
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
  }

  public async countAll(): Promise<number> {
    const query = 'SELECT COUNT(*) FROM incident_reports'
    const { rows } = await this.pool.query(query)
    return parseInt(rows[0].count, 10)
  }

  public async save(incidentReport: IncidentReport): Promise<void> {
    const query: QueryConfig = {
      text: `INSERT INTO incident_reports (
                id,
                incident_location,
                incident_date,
                incident_detail,
                incident_status,
                reporter_id)
             VALUES ($1, $2, $3, $4, $5, $6)
             ON CONFLICT (id) DO
             UPDATE SET
                incident_location = $2,
                incident_date = $3,
                incident_detail = $4,
                incident_status = $5`,
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
}
