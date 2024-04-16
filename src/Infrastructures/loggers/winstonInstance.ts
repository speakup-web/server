/* istanbul ignore file */

import { type Logform, format, transports, createLogger } from 'winston'
import {
  DEBUG_LOGGING_LVL,
  INFO_LOGGING_LVL,
  PRODUCTION_ENV,
  SILENT_LOGGING_LVL,
  TEST_ENV,
} from '@Commons/constants'

function getFormat(): Logform.Format {
  return format.combine(format.json(), format.prettyPrint())
}

function getTransports(): transports.ConsoleTransportInstance[] {
  return [new transports.Console()]
}

let loggerLevel: string

if (process.env.NODE_ENV === PRODUCTION_ENV) {
  loggerLevel = INFO_LOGGING_LVL
} else if (process.env.NODE_ENV === TEST_ENV) {
  loggerLevel = SILENT_LOGGING_LVL
} else {
  loggerLevel = DEBUG_LOGGING_LVL
}

export const winstonInstance = createLogger({
  level: loggerLevel,
  format: getFormat(),
  transports: getTransports(),
})
