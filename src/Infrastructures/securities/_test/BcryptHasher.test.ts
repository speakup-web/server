import bcrypt from 'bcrypt'
import { BcryptHasher } from '../BcryptHasher'

describe('BcryptHasher', () => {
  describe('hash', () => {
    it('should hash the password', async () => {
      const spyHash = jest.spyOn(bcrypt, 'hash')
      const bcryptHasher = new BcryptHasher(bcrypt)

      const hashedPassword = await bcryptHasher.hash('secret')

      expect(hashedPassword).not.toEqual('secret')
      expect(spyHash).toHaveBeenCalledWith('secret', 10)
    })
  })

  describe('compare', () => {
    it('should return false if password does not match', async () => {
      const spyCompare = jest.spyOn(bcrypt, 'compare')
      const bcryptHasher = new BcryptHasher(bcrypt)

      const hashedPassword = await bcryptHasher.hash('secret')
      const isMatch = await bcryptHasher.compare('wrong', hashedPassword)

      expect(isMatch).toEqual(false)
      expect(spyCompare).toHaveBeenCalledWith('wrong', hashedPassword)
    })

    it('should return true if password matches', async () => {
      const spyCompare = jest.spyOn(bcrypt, 'compare')
      const bcryptHasher = new BcryptHasher(bcrypt)

      const hashedPassword = await bcryptHasher.hash('secret')
      const isMatch = await bcryptHasher.compare('secret', hashedPassword)

      expect(isMatch).toEqual(true)
      expect(spyCompare).toHaveBeenCalledWith('secret', hashedPassword)
    })
  })
})
