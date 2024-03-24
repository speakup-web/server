import * as httpStatus from 'http-status'
import { ClientError } from './ClientError'

export class AuthenticationError extends ClientError {
  constructor(message: string) {
    super(message, httpStatus.UNAUTHORIZED)
    this.name = 'AuthenticationError'
  }
}
