import { pool } from '@Infrastructures/database/postgres/pool'
import { UsersTableTestHelper } from '../../../../test/helpers/usersTableTestHelper'
import { UserRepositoryPostgres } from '../userRepositoryPostgres'
import { User, UserRoles } from '@Domains/entitites/user'

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
      const result = await userRepositoryPostgres.findByEmail('example@mail.com')

      expect(result).toBeNull()
    })

    it('should return user correctly', async () => {
      const user = new User({
        name: 'John Doe',
        email: 'johndoe@mail.com',
        password: 'secret_password',
        role: UserRoles.ADMIN,
      })
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
