import type * as bcrypt from 'bcrypt'
import { type IHasher } from '@Applications/security/hasher'

type Bcrypt = typeof bcrypt

export class BcryptHasher implements IHasher {
  constructor(
    private readonly bcrypt: Bcrypt,
    private readonly saltRounds = 10,
  ) {}

  async hash(password: string): Promise<string> {
    return await this.bcrypt.hash(password, this.saltRounds)
  }

  async compare(password: string, hashedPassword: string): Promise<boolean> {
    return await this.bcrypt.compare(password, hashedPassword)
  }
}
