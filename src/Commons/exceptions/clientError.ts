/* istanbul ignore file */

import * as httpStatus from 'http-status'

export class ClientError extends Error {
  constructor(
    message: string,
    public statusCode: number = httpStatus.BAD_REQUEST,
  ) {
    super(message)
    super.name = 'ClientError'
    this.statusCode = statusCode
  }
}
