/* istanbul ignore file */

import { type Pool, type QueryConfig } from 'pg'
import { Reporter } from '@Domains/entities/Reporter/Reporter'

export class ReportersTableTestHelper {
  constructor(private readonly pool: Pool) {}

  public async cleanTable(): Promise<void> {
    const query = `DELETE FROM reporters
                   WHERE 1=1`
    await this.pool.query(query)
  }

  public async addReporter(reporter: Reporter): Promise<void> {
    const query: QueryConfig = {
      text: `INSERT INTO reporters (
                id,
                name,
                email,
                phone)
             VALUES ($1, $2, $3, $4)`,
      values: [reporter.id, reporter.name, reporter.email, reporter.phone],
    }

    await this.pool.query(query)
  }

  public async findReporters(): Promise<Reporter[]> {
    const query = `SELECT id, name, email, phone
                   FROM reporters`

    const { rowCount, rows } = await this.pool.query(query)

    if (!rowCount) {
      return []
    }

    const reporters = rows.map((row) => new Reporter(row.id, row.name, row.email, row.phone))

    return reporters
  }
}
