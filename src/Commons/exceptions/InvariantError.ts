/* istanbul ignore file */

import httpStatus = require('http-status')
import { ClientError } from './ClientError'

export class InvariantError extends ClientError {
  constructor(message = 'Invariant error') {
    super(message, httpStatus.BAD_REQUEST)
    super.name = 'InvariantError'
  }
}
