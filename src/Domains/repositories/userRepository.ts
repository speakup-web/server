import { type User } from '@Domains/entitites/user'

export interface IUserRepository {
  findByEmail: (email: string) => Promise<User | null>
}
