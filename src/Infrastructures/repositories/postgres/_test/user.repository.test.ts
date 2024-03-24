import { pool } from '@Infrastructures/database/postgres/pool'
import { UsersTableTestHelper } from '../../../../../tests/UsersTableTestHelper'
import { UserRepositoryPostgres } from '../user.repository'
import { InvariantError } from '@Applications/common/exceptions/InvariantError'

describe('UserRepositoryPostgres', () => {
  const usersTableTestHelper = new UsersTableTestHelper(pool)

  afterEach(async () => {
    await usersTableTestHelper.truncateTable()
  })

  afterAll(async () => {
    await pool.end()
  })

  describe('getPasswordByEmail function', () => {
    it('should throw InvariantError when user not found', async () => {
      const nonExistentEmail = 'johndoe@mail.co'
      const usersRepository = new UserRepositoryPostgres(pool)

      await expect(usersRepository.getPasswordByEmail(nonExistentEmail)).rejects.toThrow(InvariantError)
    })

    it('should get password from database and return the password', async () => {
      const email = 'johndoe@mail.co'
      const expectedPassword = 'encrypted_password'
      await usersTableTestHelper.addUser({ email, password: expectedPassword })
      const usersRepository = new UserRepositoryPostgres(pool)

      const password = await usersRepository.getPasswordByEmail(email)

      expect(password).toEqual(expectedPassword)
    })
  })

  describe('getRoleByEmail function', () => {
    it('should throw InvariantError when user not found', async () => {
      const nonExistentEmail = 'johndoe@mail.co'
      const usersRepository = new UserRepositoryPostgres(pool)

      await expect(usersRepository.getRoleByEmail(nonExistentEmail)).rejects.toThrow(InvariantError)
    })

    it('should get role from database and return the role', async () => {
      const email = 'johndoe@mail.co'
      const expectedrole = 'admin'
      await usersTableTestHelper.addUser({ email, role: expectedrole })
      const usersRepository = new UserRepositoryPostgres(pool)

      const role = await usersRepository.getRoleByEmail(email)

      expect(role).toEqual(expectedrole)
    })
  })
})
