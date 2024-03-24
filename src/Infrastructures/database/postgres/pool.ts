/* istanbul ignore file */

import { Pool } from 'pg'
import { config } from '@Applications/common/config'

export const pool = new Pool(config.database)
