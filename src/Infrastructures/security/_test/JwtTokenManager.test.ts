import * as Jwt from '@hapi/jwt'
import { JwtTokenManager } from '../JwtTokenManager'
import { config } from '@Applications/common/config'

describe('JwtTokenManager', () => {
  describe('createToken function', () => {
    it('should create token correctly', async () => {
      const payload = {
        email: 'johndoe@mail.com',
        role: 'admin',
      }
      const mockJwtToken = {
        generate: jest.fn().mockReturnValue('mock_token'),
      } as unknown as Jwt.HapiJwt.Token
      const jwtTokenManager = new JwtTokenManager(mockJwtToken)

      const accessToken = jwtTokenManager.createToken(payload)

      expect(mockJwtToken.generate).toHaveBeenCalledWith(payload, config.jwt.secretKey)
      expect(accessToken).toEqual('mock_token')
    })
  })

  describe('decodeToken function', () => {
    it('should decode payload correctly', async () => {
      const payload = {
        email: 'johndoe@mail.com',
      }
      const jwtTokenManager = new JwtTokenManager(Jwt.token)
      const accessToken = jwtTokenManager.createToken(payload)

      const { email } = await jwtTokenManager.decodeToken(accessToken)

      expect(email).toEqual(payload.email)
    })
  })
})
