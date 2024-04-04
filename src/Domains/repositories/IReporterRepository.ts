import { type Reporter } from '@Domains/entities/Reporter/Reporter'

export interface IReporterRepository {
  save: (reporter: Reporter) => Promise<void>
}
