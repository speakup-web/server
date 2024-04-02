import { type Reporter } from '@Domains/entitites/reporter'

export interface IReporterRepository {
  save: (reporter: Reporter) => Promise<void>
}
