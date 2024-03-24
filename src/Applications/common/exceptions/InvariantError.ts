import { ClientError } from './ClientError'
import * as httpStatus from 'http-status'

export class InvariantError extends ClientError {
  constructor(message: string, statusCode = httpStatus.BAD_REQUEST) {
    super(message, statusCode)
    this.name = 'InvariantError'
  }
}
