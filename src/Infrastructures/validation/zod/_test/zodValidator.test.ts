import { z } from 'zod'
import { ZodValidator } from '../zodValidator'
import { InvariantError } from '@Commons/exceptions/invariantError'

describe('ZodValidator', () => {
  describe('validate', () => {
    let schema: z.ZodTypeAny

    beforeAll(() => {
      schema = z.object({
        name: z.string().min(3).max(50),
        age: z.number().int().positive(),
      })
    })

    it('should throw InvariantError when payload is invalid', () => {
      const payload = {
        name: 'a',
        age: -1,
      }
      const zodValidator = new ZodValidator(schema)

      expect(() => zodValidator.validate(payload)).toThrow(InvariantError)
    })

    it('should return payload when payload is valid', () => {
      const payload = {
        name: 'John Doe',
        age: 18,
      }
      const zodValidator = new ZodValidator(schema)

      const result = zodValidator.validate({ ...payload })

      expect(result).toEqual(payload)
    })
  })
})
