/* istanbul ignore file */

import * as httpStatus from 'http-status'
import { ClientError } from './ClientError'

export class AuthenticationError extends ClientError {
  constructor(message = 'Authentication error') {
    super(message, httpStatus.UNAUTHORIZED)
    super.name = 'AuthenticationError'
  }
}
