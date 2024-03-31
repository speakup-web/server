import * as http from 'http'
import { config } from '@Commons/config'
import { winstonLogger } from '@Infrastructures/loggers/winstonLogger'
import { createApp } from '@Infrastructures/http/express/app'
import { awilixContainer } from '@Infrastructures/containers/awilixContainer'

const app = createApp(awilixContainer)
const server = http.createServer(app)

async function start() {
  server.listen(config.app.port, () => {
    winstonLogger.info(`listening on :${config.app.port}`)
  })
}

start()
