import { type IValidator } from '@Applications/validation/validator'
import { InvariantError } from '@Commons/exceptions/invariantError'
import { type z } from 'zod'

export class ZodValidator<T extends z.ZodTypeAny> implements IValidator<z.infer<T>> {
  constructor(private readonly schema: T) {}

  validate(payload: unknown): z.TypeOf<T> {
    const result = this.schema.safeParse(payload)

    if (!result.success) {
      const { path, message } = result.error.issues[0]
      throw new InvariantError(`${message} at ${path.join('.')} path.`)
    }

    return result.data
  }
}
