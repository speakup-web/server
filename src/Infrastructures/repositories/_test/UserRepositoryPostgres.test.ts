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

  describe('findAll', () => {
    it('should return empty array when no user found', async () => {
      const users = await userRepositoryPostgres.findAll()

      expect(users).toHaveLength(0)
    })

    it('should return all users correctly', async () => {
      const user1 = new UserBuilder(
        'John Doe',
        'johndoe@mail.com',
        'secret_password',
        UserRole.ADMIN,
      ).build()
      const user2 = new UserBuilder(
        'Jane Doe',
        'janedoe@mail.com',
        'secret_password',
        UserRole.TASKFORCE,
      ).build()
      await usersTableTestHelper.addUser(user1)
      await usersTableTestHelper.addUser(user2)

      const users = await userRepositoryPostgres.findAll()

      expect(users).toHaveLength(2)
      expect(users[0].id).toEqual(user1.id)
      expect(users[1].id).toEqual(user2.id)
    })

    it('should return limited users correctly', async () => {
      const user1 = new UserBuilder(
        'John Doe',
        'johndoe@mail.com',
        'secret_password',
        UserRole.ADMIN,
      ).build()
      const user2 = new UserBuilder(
        'Jane Doe',
        'janedoe@mail.com',
        'secret_password',
        UserRole.TASKFORCE,
      ).build()
      await usersTableTestHelper.addUser(user1)
      await usersTableTestHelper.addUser(user2)
      const limit = 1

      const users = await userRepositoryPostgres.findAll(limit)

      expect(users).toHaveLength(1)
      expect(users[0].id).toEqual(user1.id)
    })

    it('should return users with offset correctly', async () => {
      const user1 = new UserBuilder(
        'John Doe',
        'johndoe@mail.com',
        'secret_password',
        UserRole.ADMIN,
      ).build()
      const user2 = new UserBuilder(
        'Jane Doe',
        'janedoe@mail.com',
        'secret_password',
        UserRole.TASKFORCE,
      ).build()
      await usersTableTestHelper.addUser(user1)
      await usersTableTestHelper.addUser(user2)
      const limit = 2
      const offset = 1

      const users = await userRepositoryPostgres.findAll(limit, offset)

      expect(users).toHaveLength(1)
      expect(users[0].id).toEqual(user2.id)
    })

    it('should return users with limit and offset correctly', async () => {
      const user1 = new UserBuilder(
        'John Doe',
        'johndoe@mail.com',
        'secret_password',
        UserRole.ADMIN,
      ).build()
      const user2 = new UserBuilder(
        'Jane Doe',
        'janedoe@mail.com',
        'secret_password',
        UserRole.TASKFORCE,
      ).build()
      const user3 = new UserBuilder(
        'Michael',
        'michael@mail.com',
        'secret_password',
        UserRole.TASKFORCE,
      ).build()
      await usersTableTestHelper.addUser(user1)
      await usersTableTestHelper.addUser(user2)
      await usersTableTestHelper.addUser(user3)
      const limit = 1
      const offset = 2

      const users = await userRepositoryPostgres.findAll(limit, offset)

      expect(users).toHaveLength(1)
      expect(users[0].id).toEqual(user3.id)
    })

    it('should return users with role correctly', async () => {
      const user1 = new UserBuilder(
        'John Doe',
        'johndoe@mail.com',
        'secret_password',
        UserRole.ADMIN,
      ).build()
      const user2 = new UserBuilder(
        'Jane Doe',
        'janedoe@mail.com',
        'secret_password',
        UserRole.TASKFORCE,
      ).build()
      const user3 = new UserBuilder(
        'Michael',
        'michael@mail.com',
        'secret_password',
        UserRole.TASKFORCE,
      ).build()
      await usersTableTestHelper.addUser(user1)
      await usersTableTestHelper.addUser(user2)
      await usersTableTestHelper.addUser(user3)
      const limit = 2
      const offset = 0
      const role = UserRole.TASKFORCE

      const users = await userRepositoryPostgres.findAll(limit, offset, role)

      expect(users).toHaveLength(2)
      expect(users[0].id).toEqual(user2.id)
      expect(users[1].id).toEqual(user3.id)
    })
  })

  describe('countAll', () => {
    it('should return 0 when no user found', async () => {
      const totalUsers = await userRepositoryPostgres.countAll()

      expect(totalUsers).toEqual(0)
    })

    it('should return total users correctly', async () => {
      const user1 = new UserBuilder(
        'John Doe',
        'johndoe@mail.com',
        'secret_password',
        UserRole.ADMIN,
      ).build()
      const user2 = new UserBuilder(
        'Jane Doe',
        'janedoe@mail.com',
        'secret_password',
        UserRole.TASKFORCE,
      ).build()
      await usersTableTestHelper.addUser(user1)
      await usersTableTestHelper.addUser(user2)

      const totalUsers = await userRepositoryPostgres.countAll()

      expect(totalUsers).toEqual(2)
    })

    it('should return total users with role correctly', async () => {
      const user1 = new UserBuilder(
        'John Doe',
        'johndoe@mail.com',
        'secret_password',
        UserRole.ADMIN,
      ).build()
      const user2 = new UserBuilder(
        'Jane Doe',
        'janedoe@mail.com',
        'secret_password',
        UserRole.TASKFORCE,
      ).build()
      const user3 = new UserBuilder(
        'Michael',
        'michael@mail.com',
        'secret_password',
        UserRole.TASKFORCE,
      ).build()
      await usersTableTestHelper.addUser(user1)
      await usersTableTestHelper.addUser(user2)
      await usersTableTestHelper.addUser(user3)

      const totalAdmins = await userRepositoryPostgres.countAll(UserRole.ADMIN)
      const totalTaskforces = await userRepositoryPostgres.countAll(UserRole.TASKFORCE)

      expect(totalAdmins).toEqual(1)
      expect(totalTaskforces).toEqual(2)
    })
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
