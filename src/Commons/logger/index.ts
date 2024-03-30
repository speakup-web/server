import * as winston from 'winston'
import {
  DEBUG_LOGGING_LVL,
  INFO_LOGGING_LVL,
  PRODUCTION_ENV,
} from '@Commons/constants'

function getFormat() {
  return winston.format.combine(
    winston.format.json(),
    winston.format.prettyPrint(),
  )
}

function getTransports() {
  const transports = [new winston.transports.Console()]
  return transports
}

export const logger = winston.createLogger({
  level:
    process.env.NODE_ENV === PRODUCTION_ENV
      ? INFO_LOGGING_LVL
      : DEBUG_LOGGING_LVL,
  format: getFormat(),
  transports: getTransports(),
})
