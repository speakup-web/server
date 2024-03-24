import { InvariantError } from '@Applications/common/exceptions/InvariantError'
import type { UserRepository } from '@Domains/user/user.repository'
import { Pool, QueryConfig } from 'pg'

export class UserRepositoryPostgres implements UserRepository {
  constructor(private pool: Pool) {}

  async getPasswordByEmail(email: string): Promise<string> {
    const query: QueryConfig = {
      text: `SELECT password
             FROM users
             WHERE email = $1`,
      values: [email],
    }

    const { rowCount, rows } = await this.pool.query(query)

    if (!rowCount) {
      throw new InvariantError('users with that email are not found')
    }

    return rows[0].password
  }

  async getRoleByEmail(email: string): Promise<string> {
    const query: QueryConfig = {
      text: `SELECT role
             FROM users
             WHERE email = $1`,
      values: [email],
    }

    const { rowCount, rows } = await this.pool.query(query)

    if (!rowCount) {
      throw new InvariantError('users with that email are not found')
    }

    return rows[0].role
  }
}
