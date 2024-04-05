import { User } from '@Domains/entities/User/User'
import { type IUserRepository } from '@Domains/repositories/IUserRepository'
import { type Pool } from 'pg'

export class UserRepositoryPostgres implements IUserRepository {
  constructor(private readonly pool: Pool) {}

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
