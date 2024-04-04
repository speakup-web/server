import httpStatus from 'http-status'
import { ClientError } from './ClientError'

export class ConflictError extends ClientError {
  constructor(message: string) {
    super(message, httpStatus.CONFLICT)
    this.name = 'ConflictError'
  }
}
