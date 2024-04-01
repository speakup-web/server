import { pool } from '@Infrastructures/database/postgres/pool'
import { UsersTableTestHelper } from '../../../../test/helpers/usersTableTestHelper'
import { UserRepositoryPostgres } from '../userRepositoryPostgres'
import { User } from '@Domains/entitites/user'

describe('UserRepositoryPostgres', () => {
  let usersTableTestHelper: UsersTableTestHelper

  beforeAll(() => {
    usersTableTestHelper = new UsersTableTestHelper(pool)
  })

  afterEach(async () => {
    usersTableTestHelper.cleanTable()
  })

  afterAll(async () => {
    await pool.end()
  })

  describe('findByEmail', () => {
    it('should return null when user not found', async () => {
      const userRepositoryPostgres = new UserRepositoryPostgres(pool)

      const result = await userRepositoryPostgres.findByEmail('example@mail.com')

      expect(result).toBeNull()
    })

    it('should return user correctly', async () => {
      const user = new User({
        id: 'user-123',
        name: 'John Doe',
        email: 'johndoe@mail.com',
        password: 'secret_password',
        role: 'admin',
      })

      await usersTableTestHelper.addUser(user)
      const userRepositoryPostgres = new UserRepositoryPostgres(pool)

      const result = await userRepositoryPostgres.findByEmail(user.email)

      expect(result?.id).toEqual(user.id)
      expect(result?.name).toEqual(user.name)
      expect(result?.email).toEqual(user.email)
      expect(result?.password).not.toEqual(user.password)
      expect(result?.role).toEqual(user.role)
    })
  })
})
