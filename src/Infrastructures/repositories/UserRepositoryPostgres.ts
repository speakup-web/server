import { User } from '@Domains/entities/User/User'
import { type UserRole } from '@Domains/enums/UserRole'
import { type IUserRepository } from '@Domains/repositories/IUserRepository'
import { type QueryConfig, type Pool } from 'pg'

export class UserRepositoryPostgres implements IUserRepository {
  constructor(private readonly pool: Pool) {}

  public async findAll(limit?: number, offset?: number, role?: UserRole): Promise<User[]> {
    let text = `SELECT
                  id,
                  name,
                  email,
                  password,
                  role
                FROM users`

    const values = []

    if (role) {
      text += ' WHERE role = $1'
      values.push(role)
    }

    if (limit) {
      text += ` LIMIT $${values.length + 1}`
      values.push(limit)
    }

    if (offset) {
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

    return rows.map((row) => new User(row.id, row.name, row.email, row.password, row.role))
  }

  public async countAll(role?: UserRole): Promise<number> {
    let text = 'SELECT COUNT(*) FROM users'
    const values = []

    if (role) {
      text += ' WHERE role = $1'
      values.push(role)
    }

    const query: QueryConfig = {
      text,
      values,
    }

    const { rows } = await this.pool.query(query)

    return parseInt(rows[0].count)
  }

  public async findByEmail(email: string): Promise<User | null> {
    const query = {
      text: `SELECT
                id,
                name,
                email,
                password,
                role
             FROM users
             WHERE email = $1`,
      values: [email],
    }

    const { rows, rowCount } = await this.pool.query(query)

    if (!rowCount) {
      return null
    }

    return new User(rows[0].id, rows[0].name, rows[0].email, rows[0].password, rows[0].role)
  }

  public async save(user: User): Promise<void> {
    const query = {
      text: `INSERT INTO users (
                id,
                name,
                email,
                password,
                role)
             VALUES ($1, $2, $3, $4, $5)`,
      values: [user.id, user.name, user.email, user.password, user.role],
    }

    await this.pool.query(query)
  }
}
