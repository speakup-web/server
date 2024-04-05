import { type User } from '@Domains/entities/User/User'
import { type UserRole } from '@Domains/enums/UserRole'

export interface IUserRepository {
  findAll: (limit?: number, offset?: number, role?: UserRole) => Promise<User[]>
  countAll: (role?: UserRole) => Promise<number>
  findByEmail: (email: string) => Promise<User | null>
  save: (user: User) => Promise<void>
}
