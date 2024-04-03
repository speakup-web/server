import * as jose from 'jose'
import { JwtTokenManager } from '../JWTTokenManager'

describe('JWTTokenManager', () => {
  describe('generate', () => {
    it('should generate a JWT token with the correct payload', async () => {
      const jwtPayload: jose.JWTPayload = {
        userId: 'user-123',
        email: 'example@mail.com',
        name: 'John Doe',
      }
      const jwtTokenManager = new JwtTokenManager(jose)

      const token = await jwtTokenManager.generate(jwtPayload)

      expect(token).toBeDefined()
    })
  })

  describe('verify', () => {
    it('should throw JWSInvalid if the token is invalid', async () => {
      const invalidToken = 'invalid-token'
      const jwtTokenManager = new JwtTokenManager(jose)

      await expect(jwtTokenManager.verify(invalidToken)).rejects.toThrow(jose.errors.JWSInvalid)
    })

    it('should return the payload if the token is valid', async () => {
      const jwtPayload: jose.JWTPayload = {
        userId: 'user-123',
        email: 'example@mail.com',
        name: 'John Doe',
      }
      const jwtTokenManager = new JwtTokenManager(jose)

      const token = await jwtTokenManager.generate({ ...jwtPayload })
      const payload = await jwtTokenManager.verify(token)

      expect(payload).toBeDefined()
      expect(payload).toHaveProperty('userId', jwtPayload.userId)
      expect(payload).toHaveProperty('email', jwtPayload.email)
      expect(payload).toHaveProperty('name', jwtPayload.name)
    })
  })
})
