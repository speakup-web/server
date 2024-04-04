import { type IValidator } from '@Applications/validators/IValidator'
import { InvariantError } from '@Commons/exceptions/InvariantError'
import { type z } from 'zod'

export class ZodValidator<T> implements IValidator<T> {
  constructor(private readonly schema: z.ZodType<T>) {}

  public validate(payload: unknown): T {
    const result = this.schema.safeParse(payload)

    if (!result.success) {
      const { path, message } = result.error.issues[0]
      throw new InvariantError(`${message} at ${path.join('.')}.`)
    }

    return result.data
  }
}
