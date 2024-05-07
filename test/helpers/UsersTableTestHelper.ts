/* istanbul ignore file */

import { BcryptHasher } from '@Infrastructures/securities/BcryptHasher'
import { type Pool, type QueryConfig } from 'pg'
import { User } from '@Domains/entities/User/User'
import bcrypt from 'bcrypt'

export class UsersTableTestHelper {
  constructor(private readonly pool: Pool) {}

  public async cleanTable(): Promise<void> {
    const query = `DELETE FROM users
                   WHERE 1=1`
    await this.pool.query(query)
  }

  public async findUsers(): Promise<User[]> {
    const query = `SELECT
                     id,
                     name,
                     email,
                     password,
                     role
                   FROM users
                   WHERE is_deleted = false`
    const { rows } = await this.pool.query(query)

    return rows.map((row) => new User(row.id, row.name, row.email, row.password, row.role))
  }

  public async addUser(user: User): Promise<void> {
    const hashedPassword = await new BcryptHasher(bcrypt).hash(user.password)
    const query: QueryConfig = {
      text: `INSERT INTO users (
                id,
                name,
                email,
                password,
                role)
             VALUES ($1, $2, $3, $4, $5)`,
      values: [user.id, user.name, user.email, hashedPassword, user.role],
    }

    await this.pool.query(query)
  }

  public async deleteUserById(userId: string): Promise<void> {
    const query = {
      text: `UPDATE users
             SET is_deleted = true
             WHERE id = $1`,
      values: [userId],
    }

    await this.pool.query(query)
  }
}
