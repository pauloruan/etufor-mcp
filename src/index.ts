import "./mcp";
import { server } from "./server";

server.listen(3333, () => {
  console.log(`Server is running in http://localhost:3333.`);
});
