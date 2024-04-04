import { type Reporter } from '@Domains/entities/Reporter/Reporter'

export interface IReporterRepository {
  findByEmailOrPhone: (email: string, phone: string) => Promise<Reporter | null>
  save: (reporter: Reporter) => Promise<void>
}
