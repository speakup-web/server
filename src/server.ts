import * as http from 'http'
import { config } from '@Commons/config'
import { app } from '@Infrastructures/http/express/app'
import { logger } from '@Commons/logger'

const server = http.createServer(app)

async function start() {
  server.listen(config.app.port, () => {
    logger.info(`listening on :${config.app.port}`)
  })
}

start()
