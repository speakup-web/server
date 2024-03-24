import { createServer } from '@Infrastructures/http/create_server'
import { container } from '@Infrastructures/container'

const start = async () => {
  const server = await createServer(container)
  await server.start()
  console.log(`listening at ${server.info.uri}`)
}

start()
