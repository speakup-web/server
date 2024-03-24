import * as bcrypt from 'bcrypt'
import { BcryptHasher } from '../BcryptHasher'
import { AuthenticationError } from '@Applications/common/exceptions/AuthenticationError'

describe('JwtTokenManager', () => {
  describe('hash function', () => {
    it('should encrypt password', async () => {
      const spyHash = jest.spyOn(bcrypt, 'hash')
      const bcryptHasher = new BcryptHasher(bcrypt)

      const encryptedPassword = await bcryptHasher.hash('plain_password')

      expect(typeof encryptedPassword).toEqual('string')
      expect(encryptedPassword).not.toEqual('plain_password')
      expect(spyHash).toHaveBeenCalledWith('plain_password', 10)
    })
  })

  describe('compare function', () => {
    it('should throw AuthenticationError if password not match', async () => {
      const bcryptHasher = new BcryptHasher(bcrypt)

      await expect(bcryptHasher.compare('plain_password', 'encrypted_password')).rejects.toThrow(AuthenticationError)
    })

    it('should not return AuthenticationError if password match', async () => {
      const bcryptHasher = new BcryptHasher(bcrypt)
      const plain = 'plain_password'
      const encrypted = await bcryptHasher.hash(plain)

      await expect(bcryptHasher.compare(plain, encrypted)).resolves.not.toThrow(AuthenticationError)
    })
  })
})
