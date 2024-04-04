/* istanbul ignore file */

import httpStatus from 'http-status'
import { ClientError } from './ClientError'

export class AuthorizationError extends ClientError {
  constructor(message = 'Unauthorized') {
    super(message, httpStatus.FORBIDDEN)
    super.name = 'AuthorizationError'
  }
}
