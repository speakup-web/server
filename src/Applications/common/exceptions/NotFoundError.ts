import * as httpStatus from 'http-status'
import { ClientError } from './ClientError'

export class NotFoundError extends ClientError {
  constructor(message: string) {
    super(message, httpStatus.NOT_FOUND)
    this.name = 'NotFoundError'
  }
}
