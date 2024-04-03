import { type UserRole } from '@Domains/enums/UserRole'
import { User } from './User'
import { nanoid } from 'nanoid'

export class UserBuilder {
  constructor(
    private readonly name: string,
    private readonly email: string,
    private readonly password: string,
    private readonly role: UserRole,
  ) {}

  public build(): User {
    const id = nanoid()
    return new User(id, this.name, this.email, this.password, this.role)
  }
}
