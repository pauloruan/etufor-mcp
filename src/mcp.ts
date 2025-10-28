import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { z } from "zod";
import { fetchBusLines, type BusLine } from "./services/busLinesService";
import { formatBusNumber } from "./utils/formatters";
import { fetchBusSchedule } from "./services/busSchedulesService";

export const mcp = new McpServer({
  name: "etufor-mcp",
  version: "1.0.0",
});

const busLineSchema = z.object({
  numero: z.string(),
  nome: z.string(),
  ida: z.string(),
  volta: z.string(),
});

mcp.registerTool(
  "getBusLines",
  {
    title: "Get Fortaleza Bus Lines",
    description: "Fetches bus line data from Fortaleza's open data portal.",
    inputSchema: {
      filterByName: z
        .string()
        .optional()
        .describe("Filter lines containing this text"),
      filterByNumber: z
        .string()
        .optional()
        .describe("Filter lines by a specific number (e.g., '42')"),
    },
    outputSchema: {
      lines: z.array(busLineSchema),
    },
  },
  async ({ filterByName, filterByNumber }) => {
    let allLines = await fetchBusLines();
    if (filterByName) {
      allLines = allLines.filter((line) =>
        line.nome.toLowerCase().includes(filterByName.toLowerCase()),
      );
    }
    if (filterByNumber) {
      const formattedInputNumber = formatBusNumber(filterByNumber);

      allLines = allLines.filter(
        (line) => line.numero === formattedInputNumber,
      );
    }

    const textOutput = `Found ${allLines.length} lines. Example: ${allLines[0]?.nome || "N/A"}`;

    return {
      content: [{ type: "text", text: textOutput }],
      structuredContent: { lines: allLines },
    };
  },
);

mcp.registerTool(
  "getBusSchedule",
  {
    title: "Get Bus Schedule by Line",
    description: "Fetches the daily schedule for a specific bus line number.",
    inputSchema: {
      numero: z.string().describe("The line number (e.g., '42' or '210')"),
    },
    outputSchema: {
      schedule: z.any(),
    },
  },
  async ({ numero }) => {
    const formattedNumero = formatBusNumber(numero);

    const scheduleData = await fetchBusSchedule(formattedNumero);

    if (!scheduleData) {
      const textOutput = `Error fetching schedule for line ${formattedNumero}.`;
      return {
        content: [{ type: "text", text: textOutput }],
        structuredContent: { schedule: null },
      };
    }

    const textOutput = `Successfully fetched schedule for line ${formattedNumero}.`;

    return {
      content: [{ type: "text", text: textOutput }],
      structuredContent: { schedule: scheduleData },
    };
  },
);
