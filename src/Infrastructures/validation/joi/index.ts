import type { ObjectSchema } from 'joi'
import type { Validator } from '@Applications/validation/Validator'
import { InvariantError } from '@Applications/common/exceptions/InvariantError'

export class JoiValidator implements Validator {
  constructor(private schema: ObjectSchema) {}

  validate(payload: any) {
    const { error, value } = this.schema.validate(payload)

    if (error) {
      throw new InvariantError(error.message)
    }

    return value
  }
}
