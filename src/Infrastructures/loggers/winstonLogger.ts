/* istanbul ignore file */

import * as winston from 'winston'
import {
  DEBUG_LOGGING_LVL,
  INFO_LOGGING_LVL,
  PRODUCTION_ENV,
  SILENT_LOGGING_LVL,
  TEST_ENV,
} from '@Commons/constants'

function getFormat(): winston.Logform.Format {
  return winston.format.combine(winston.format.json(), winston.format.prettyPrint())
}

function getTransports(): winston.transports.ConsoleTransportInstance[] {
  const transports = [new winston.transports.Console()]
  return transports
}

let loggerLevel: string

if (process.env.NODE_ENV === PRODUCTION_ENV) {
  loggerLevel = INFO_LOGGING_LVL
} else if (process.env.NODE_ENV === TEST_ENV) {
  loggerLevel = SILENT_LOGGING_LVL
} else {
  loggerLevel = DEBUG_LOGGING_LVL
}

export const winstonLogger = winston.createLogger({
  level: loggerLevel,
  format: getFormat(),
  transports: getTransports(),
})
