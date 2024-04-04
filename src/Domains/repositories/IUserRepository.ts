import { type User } from '@Domains/entities/User/User'

export interface IUserRepository {
  findByEmail: (email: string) => Promise<User | null>
}
