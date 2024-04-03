import { pool } from '@Infrastructures/database/postgres/pool'
import { UsersTableTestHelper } from '../../../../test/helpers/UsersTableTestHelper'
import { UserRepositoryPostgres } from '../UserRepositoryPostgres'
import { UserBuilder } from '@Domains/entities/User/UserBuilder'
import { UserRole } from '@Domains/enums/UserRole'

describe('UserRepositoryPostgres', () => {
  let usersTableTestHelper: UsersTableTestHelper
  let userRepositoryPostgres: UserRepositoryPostgres

  beforeAll(() => {
    usersTableTestHelper = new UsersTableTestHelper(pool)
  })

  beforeEach(() => {
    userRepositoryPostgres = new UserRepositoryPostgres(pool)
  })

  afterEach(async () => {
    await usersTableTestHelper.cleanTable()
  })

  afterAll(async () => {
    await pool.end()
  })

  describe('findByEmail', () => {
    it('should return null when user not found', async () => {
      const email = 'example@mail.com'

      const result = await userRepositoryPostgres.findByEmail(email)

      expect(result).toBeNull()
    })

    it('should return user correctly', async () => {
      const user = new UserBuilder(
        'John Doe',
        'johndoe@mail.com',
        'secret_password',
        UserRole.ADMIN,
      ).build()
      await usersTableTestHelper.addUser(user)

      const result = await userRepositoryPostgres.findByEmail(user.email)

      expect(result?.id).toEqual(user.id)
      expect(result?.name).toEqual(user.name)
      expect(result?.email).toEqual(user.email)
      expect(result?.password).not.toEqual(user.password)
      expect(result?.role).toEqual(user.role)
    })
  })
})
