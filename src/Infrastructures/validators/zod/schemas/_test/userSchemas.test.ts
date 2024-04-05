import { RegisterUserSchema } from '../userSchemas'

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
})
