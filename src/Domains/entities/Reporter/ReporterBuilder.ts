import { nanoid } from 'nanoid'
import { Reporter } from './Reporter'

export class ReporterBuilder {
  constructor(
    private readonly name: string,
    private readonly email: string,
    private readonly phone: string,
  ) {}

  public build(): Reporter {
    const id = nanoid()
    return new Reporter(id, this.name, this.email, this.phone)
  }
}
