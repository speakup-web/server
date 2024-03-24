/* istanbul ignore file */

import type { Pool, QueryConfig } from 'pg'

export class UsersTableTestHelper {
  constructor(private pool: Pool) {}

  async addUser({ id = 'user-123', name = 'John Doe', email = 'john@doe.com', password = 'secret', role = 'admin' }) {
    const query: QueryConfig = {
      text: `INSERT INTO users
             VALUES ($1, $2, $3, $4, $5)`,
      values: [id, name, email, password, role],
    }

    await this.pool.query(query)
  }

  async truncateTable() {
    const query = 'TRUNCATE TABLE users'

    await this.pool.query(query)
  }
}
