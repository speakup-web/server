import { LoginSchema } from '../authSchemas'

describe('authSchemas', () => {
  describe('LoginSchema', () => {
    it('should invalidates when object is empty', () => {
      const payload = {}
      const { success } = LoginSchema.safeParse(payload)

      expect(success).toEqual(false)
    })

    it('should invalidates when email is not a valid email', () => {
      const payload = {
        email: 'example@mail',
        password: 'secret',
      }
      const { success } = LoginSchema.safeParse(payload)

      expect(success).toEqual(false)
    })

    it('should invalidates when email is more than 50 characters', () => {
      const payload = {
        email: 'a'.repeat(51),
        password: 'secret',
      }
      const { success } = LoginSchema.safeParse(payload)

      expect(success).toEqual(false)
    })

    it('should invalidates when password is less than 8 characters', () => {
      const payload = {
        email: 'example@mail.com',
        password: 'secret',
      }
      const { success } = LoginSchema.safeParse(payload)

      expect(success).toEqual(false)
    })

    it('should invalidates when password is more than 50 characters', () => {
      const payload = {
        email: 'example@mail.com',
        password: 'a'.repeat(51),
      }
      const { success } = LoginSchema.safeParse(payload)

      expect(success).toEqual(false)
    })

    it('should validates when payload is correct', () => {
      const payload = {
        email: 'example@mail.com',
        password: 'secret_password',
      }
      const { success } = LoginSchema.safeParse(payload)

      expect(success).toEqual(true)
    })
  })
})
