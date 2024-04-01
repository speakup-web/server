import { User } from '@Domains/entitites/user'
import { type IUserRepository } from '@Domains/repositories/userRepository'
import { type Pool } from 'pg'

export class UserRepositoryPostgres implements IUserRepository {
  constructor(private readonly pool: Pool) {}

  async findByEmail(email: string): Promise<User | null> {
    const query = {
      text: `SELECT *
             FROM users
             WHERE email = $1`,
      values: [email],
    }

    const { rows, rowCount } = await this.pool.query(query)

    if (!rowCount) {
      return null
    }

    return new User(rows[0])
  }
}
