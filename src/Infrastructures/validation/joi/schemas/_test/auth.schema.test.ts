import { loginSchema } from '../auth.schema'

describe('loginSchema', () => {
  it('should invalidate an invalid login object with missing property', () => {
    const invalidLogin = {
      password: 'password123',
    }

    const { error } = loginSchema.validate(invalidLogin)

    expect(error).toBeDefined()
  })

  it('should invalidate an invalid login object with invalid email format', () => {
    const invalidLogin = {
      email: 'invalidemail',
      password: 'password123',
    }

    const { error } = loginSchema.validate(invalidLogin)

    expect(error).toBeDefined()
  })

  it('should invalidate an invalid login object with short password', () => {
    const invalidLogin = {
      email: 'test@example.com',
      password: 'short',
    }

    const { error } = loginSchema.validate(invalidLogin)

    expect(error).toBeDefined()
  })

  it('should invalidate an invalid login object with long password', () => {
    const invalidLogin = {
      email: 'test@example.com',
      password: 'averylongpasswordthatexceedsthemaximumlengthallowed',
    }

    const { error } = loginSchema.validate(invalidLogin)

    expect(error).toBeDefined()
  })

  it('should validate a valid login object', () => {
    const validLogin = {
      email: 'test@example.com',
      password: 'password123',
    }

    const { error } = loginSchema.validate(validLogin)

    expect(error).toBeUndefined()
  })
})
