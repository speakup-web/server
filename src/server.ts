import http from 'http'
import { config } from '@Commons/config'
import { winstonInstance } from '@Infrastructures/loggers/winstonInstance'
import { createApp } from '@Infrastructures/http/express/app'
import { awilixContainer } from '@Infrastructures/containers/awilixContainer'

const app = createApp(awilixContainer)
const server = http.createServer(app)

async function start(): Promise<void> {
  server.listen(config.app.port, () => {
    winstonInstance.info(`listening on :${config.app.port}`)
  })
}

start()
