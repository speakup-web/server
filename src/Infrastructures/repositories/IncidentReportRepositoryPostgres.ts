import { IncidentReport } from '@Domains/entities/IncidentReport/IncidentReport'
import { Reporter } from '@Domains/entities/Reporter/Reporter'
import { type IIncidentReportRepository } from '@Domains/repositories/IIncidentReportRepository'
import { type Pool, type QueryConfig } from 'pg'

export class IncidentReportRepositoryPostgres implements IIncidentReportRepository {
  constructor(private readonly pool: Pool) {}

  public async findById(id: string): Promise<IncidentReport | null> {
    const query: QueryConfig = {
      text: `SELECT
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
             WHERE ir.id = $1`,
      values: [id],
    }

    const { rowCount, rows } = await this.pool.query(query)

    if (!rowCount) {
      return null
    }

    const reporter = new Reporter(
      rows[0].reporterId,
      rows[0].reporterName,
      rows[0].reporterEmail,
      rows[0].reporterPhone,
    )
    return new IncidentReport(
      rows[0].id,
      rows[0].incidentLocation,
      rows[0].incidentDate,
      rows[0].incidentDetail,
      rows[0].incidentStatus,
      reporter,
    )
  }

  public async findAll(
    limit?: number,
    offset?: number,
    status?: string,
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
                WHERE 1=1`

    const values = []

    if (status) {
      text += ' AND ir.incident_status = $1'
      values.push(status)
    }

    text += ' ORDER BY ir.incident_date DESC'

    if (limit !== undefined) {
      text += ` LIMIT $${values.length + 1}`
      values.push(limit)
    }

    if (offset !== undefined) {
      text += ` OFFSET $${values.length + 1}`
      values.push(offset)
    }

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

  public async countAll(status?: string): Promise<number> {
    let text = 'SELECT COUNT(*) FROM incident_reports'
    const values = []

    if (status) {
      text += ' WHERE incident_status = $1'
      values.push(status)
    }

    const query: QueryConfig = { text, values }

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
