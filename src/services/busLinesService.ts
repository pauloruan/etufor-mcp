import { parseBusLinesXML } from "../utils/xmlParser";
import { env } from "../utils/env";
import { redis } from "../lib/redis";
import { formatBusNumber } from "../utils/formatters";

export interface BusLine {
  numero: string;
  nome: string;
  ida: string;
  volta: string;
}

const CACHE_KEY = "bus-lines:all";
const CACHE_TTL_SECONDS = 3600;

export async function fetchBusLines(): Promise<BusLine[]> {
  try {
    const cachedData = await redis.get(CACHE_KEY);
    if (cachedData) {
      console.log("Serving bus lines from cache.");
      return JSON.parse(cachedData) as BusLine[];
    }
  } catch (error) {
    console.error("Redis GET error:", error);
  }

  try {
    console.log(
      "Cache miss. Fetching bus lines XML data using native fetch...",
    );
    const response = await fetch(env.ETUFOR_XML_URL, {
      keepalive: false,
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`); // TODO: Criar Exeptions!
    }

    const xmlText = await response.text();

    const lines = parseBusLinesXML(xmlText);

    const formattedLines = lines.map((line) => {
      return {
        ...line,
        numero: formatBusNumber(line.numero),
      };
    });

    console.log(
      `Successfully parsed and formatted ${formattedLines.length} bus lines.`,
    );

    try {
      await redis.set(
        CACHE_KEY,
        JSON.stringify(formattedLines),
        "EX",
        CACHE_TTL_SECONDS,
      );
      console.log(`Saved bus lines to cache with ${CACHE_TTL_SECONDS}s TTL.`);
    } catch (error) {
      console.error("Redis SET error:", error);
    }

    return formattedLines;
  } catch (error) {
    console.error("Error fetching or parsing XML data:", error);
    return [];
  }
}
