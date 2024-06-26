import { UserRole } from '@Domains/enums/UserRole'
import {
  GetTaskforceProfilesSchema,
  GetUserProfileSchema,
  RegisterUserSchema,
  UpdateUserSchema,
} from '../userSchemas'

describe('userSchemas', () => {
  describe('RegisterUserSchema', () => {
    it('should invalidates when object is empty', () => {
      const payload = {}

      const { success } = RegisterUserSchema.safeParse(payload)

      expect(success).toEqual(false)
    })

    it('should invalidates when email is not a valid email', () => {
      const payload = {
        name: 'John Doe',
        email: 'johndoe@mail',
        password: 'secret_password',
      }

      const { success } = RegisterUserSchema.safeParse(payload)

      expect(success).toEqual(false)
    })

    it('should validates when payload is correct', () => {
      const payload = {
        name: 'John Doe',
        email: 'johndoe@mail.com',
        password: 'secret_password',
      }

      const { success } = RegisterUserSchema.safeParse(payload)

      expect(success).toEqual(true)
    })
  })

  describe('GetUserProfileSchema', () => {
    it('should invalidates when object is empty', () => {
      const { success } = GetUserProfileSchema.safeParse(null)

      expect(success).toEqual(false)
    })

    it('should invalidates when user is invalid', () => {
      const payload = {
        user: [],
      }

      const { success } = GetUserProfileSchema.safeParse(payload)

      expect(success).toEqual(false)
    })

    it('should validates when payload is correct', () => {
      const payload = {
        user: {
          email: 'johndoe@mail.com',
          role: UserRole.TASKFORCE,
        },
      }

      const { success } = GetUserProfileSchema.safeParse(payload)

      expect(success).toEqual(true)
    })
  })

  describe('GetTaskforceProfilesSchema', () => {
    it('should invalidates when object is empty', () => {
      const { success } = GetTaskforceProfilesSchema.safeParse(null)

      expect(success).toEqual(false)
    })

    it('should invalidates when limit is invalid', () => {
      const payload = {
        limit: 'abc',
        offset: 0,
      }

      const { success } = GetTaskforceProfilesSchema.safeParse(payload)

      expect(success).toEqual(false)
    })

    it('should invalidates when offset is invalid', () => {
      const payload = {
        limit: 20,
        offset: 'abc',
      }

      const { success } = GetTaskforceProfilesSchema.safeParse(payload)

      expect(success).toEqual(false)
    })

    it('should validates when limit and offset is not provided', () => {
      const payload = {}

      const { success } = GetTaskforceProfilesSchema.safeParse(payload)

      expect(success).toEqual(true)
    })

    it('should validates when payload is correct', () => {
      const payload = {
        limit: '20',
        offset: '0',
      }

      const { success } = GetTaskforceProfilesSchema.safeParse(payload)

      expect(success).toEqual(true)
    })
  })

  describe('UpdateUserSchema', () => {
    it('should invalidates when name is invalid', () => {
      const payload = {
        user: [],
        name: true,
        password: 'abcd1234',
      }

      const { success } = UpdateUserSchema.safeParse(payload)

      expect(success).toEqual(false)
    })

    it('should invalidates when object is empty', () => {
      const payload = {}

      const { success } = UpdateUserSchema.safeParse(payload)

      expect(success).toEqual(false)
    })

    it('should validates when payload is correct', () => {
      const payload = {
        user: {
          email: 'johndoe@mail.com',
          role: UserRole.TASKFORCE,
        },
        name: 'John Doe',
        password: 'abcd1234',
      }

      const { success } = UpdateUserSchema.safeParse(payload)

      expect(success).toEqual(true)
    })
  })
})
