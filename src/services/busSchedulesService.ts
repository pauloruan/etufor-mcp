import { env } from "../utils/env";
import { redis } from "../lib/redis";
import { getCurrentFortalezaDate } from "../utils/formatters"; // Importa a nova função

const CACHE_KEY_PREFIX = "bus-schedule:";
const CACHE_TTL_SECONDS = 3600;

export async function fetchBusSchedule(numeroLinha: string): Promise<any> {
  // Usamos 'any' por enquanto

  const cacheKey = `${CACHE_KEY_PREFIX}${numeroLinha}`;

  try {
    const cachedData = await redis.get(cacheKey);
    if (cachedData) {
      console.log(`Serving schedule for line ${numeroLinha} from cache.`);
      return JSON.parse(cachedData);
    }
  } catch (error) {
    console.error("Redis GET error:", error);
  }

  console.log(`Cache miss. Fetching schedule for line ${numeroLinha}...`);

  const dataFormatada = getCurrentFortalezaDate();

  const url = `${env.ETUFOR_API_BASE_URL}/${numeroLinha}?data=${dataFormatada}`;
  console.log(`Fetching from: ${url}`);

  try {
    const response = await fetch(url);

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status} for URL: ${url}`);
    }

    const scheduleData = await response.json();

    try {
      await redis.set(
        cacheKey,
        JSON.stringify(scheduleData),
        "EX",
        CACHE_TTL_SECONDS,
      );
      console.log(`Saved schedule for ${numeroLinha} to cache.`);
    } catch (error) {
      console.error("Redis SET error:", error);
    }

    return scheduleData;
  } catch (error) {
    console.error(`Error fetching schedule for line ${numeroLinha}:`, error);
    return null;
  }
}
