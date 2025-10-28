import { StreamableHTTPServerTransport } from "@modelcontextprotocol/sdk/server/streamableHttp.js";
import express, { Express, Request, Response } from "express";
import { mcp } from "./mcp";

const server: Express = express();
server.use(express.json());

server.get("/", (_request: Request, response: Response) => {
  response.send("MCP Server ETUFOR");
});

server.post("/mcp", async (request: Request, response: Response) => {
  const transport = new StreamableHTTPServerTransport({
    sessionIdGenerator: undefined,
    enableJsonResponse: true,
  });

  response.on("close", () => {
    transport.close();
  });

  await mcp.connect(transport);
  await transport.handleRequest(request, response, request.body);
});

export { server };
