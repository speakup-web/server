import { AuthenticationError } from '@Applications/common/exceptions/AuthenticationError'
import type { Hasher } from '@Applications/security/Hasher'
import * as bcrypt from 'bcrypt'

type Bcrypt = typeof bcrypt

export class BcryptHasher implements Hasher {
  constructor(private bcrypt: Bcrypt, private saltRounds = 10) {}

  async hash(password: string): Promise<string> {
    return this.bcrypt.hash(password, this.saltRounds)
  }

  async compare(password: string, encryptedPassword: string): Promise<void> {
    const result = await this.bcrypt.compare(password, encryptedPassword)

    if (!result) {
      throw new AuthenticationError('Invalid email or password.')
    }
  }
}
