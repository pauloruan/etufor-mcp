import "./mcp"
import { server } from "./server"
import { env } from "./utils/env"

const port = env.PORT || 4000

server.listen(port, () => {
  console.log(`🚀 Server is running in http://localhost:${port}.`)
})
