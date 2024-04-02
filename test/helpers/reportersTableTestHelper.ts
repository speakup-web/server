/* istanbul ignore file */

import { type Pool, type QueryConfig } from 'pg'
import { Reporter } from '@Domains/entitites/reporter'

export class ReportersTableTestHelper {
  constructor(private readonly pool: Pool) {}

  async cleanTable() {
    await this.pool.query('DELETE FROM reporters WHERE 1=1')
  }

  async addReporter(reporter: Reporter) {
    const query: QueryConfig = {
      text: `INSERT INTO reporters (id, name, email, phone)
             VALUES ($1, $2, $3, $4)`,
      values: [reporter.id, reporter.name, reporter.email, reporter.phone],
    }

    await this.pool.query(query)
  }

  async findReporters() {
    const query = `SELECT id, name, email, phone
                   FROM reporters`

    const { rowCount, rows } = await this.pool.query(query)

    if (!rowCount) {
      return null
    }

    return rows.map((row) => new Reporter(row))
  }
}
