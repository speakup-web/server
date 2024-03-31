/* istanbul ignore file */

import { type User } from '@Domains/entitites/user'
import { BcryptHasher } from '@Infrastructures/security/bcryptHasher'
import { type Pool, type QueryConfig } from 'pg'
import * as bcrypt from 'bcrypt'

export class UsersTableTestHelper {
  constructor(private readonly pool: Pool) {}

  async cleanTable() {
    await this.pool.query('DELETE FROM users WHERE 1=1')
  }

  async addUser(user: User) {
    const hashedPassword = await new BcryptHasher(bcrypt).hash(user.password)

    const query: QueryConfig = {
      text: `INSERT INTO users (id, name, email, password, role)
             VALUES ($1, $2, $3, $4, $5)`,
      values: [user.id, user.name, user.email, hashedPassword, user.role],
    }

    await this.pool.query(query)
  }
}
