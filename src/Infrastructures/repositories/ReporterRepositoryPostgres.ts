import { Reporter } from '@Domains/entities/Reporter/Reporter'
import { type IReporterRepository } from '@Domains/repositories/IReporterRepository'
import { type QueryConfig, type Pool } from 'pg'

export class ReporterRepositoryPostgres implements IReporterRepository {
  constructor(private readonly pool: Pool) {}

  public async findByEmailOrPhone(email: string, phone: string): Promise<Reporter | null> {
    const query: QueryConfig = {
      text: `SELECT
                id,
                name,
                email,
                phone
             FROM reporters
             WHERE
                email = $1 OR
                phone = $2`,
      values: [email, phone],
    }

    const { rowCount, rows } = await this.pool.query(query)

    if (!rowCount) {
      return null
    }

    return new Reporter(rows[0].id, rows[0].name, rows[0].email, rows[0].phone)
  }

  public async save(reporter: Reporter): Promise<void> {
    const query: QueryConfig = {
      text: `INSERT INTO reporters (
                id,
                name,
                email,
                phone)
             VALUES ($1, $2, $3, $4)
             ON CONFLICT (id) DO
             UPDATE SET
                name = $2,
                email = $3,
                phone = $4`,
      values: [reporter.id, reporter.name, reporter.email, reporter.phone],
    }

    await this.pool.query(query)
  }
}
