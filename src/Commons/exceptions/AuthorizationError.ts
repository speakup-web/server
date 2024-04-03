/* istanbul ignore file */

import * as httpStatus from 'http-status'
import { ClientError } from './ClientError'

export class AuthorizationError extends ClientError {
  constructor(message = 'Unauthorized') {
    super(message, httpStatus.FORBIDDEN)
    super.name = 'AuthorizationError'
  }
}
