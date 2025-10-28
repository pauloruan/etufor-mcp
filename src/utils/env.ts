import { z } from "zod";

const envSchema = z.object({
  ETUFOR_API_BASE_URL: z.string(),
  ETUFOR_XML_URL: z.string(),
  REDIS_URL: z.string(),
});

export const env = envSchema.parse(process.env);
