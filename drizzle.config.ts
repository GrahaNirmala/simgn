import { config } from "dotenv"
import type { Config } from "drizzle-kit"
config({ path: '.env.local' });

const configs: Config = {
  schema: "./src/server/db/schema.ts",
  driver: "pg",
  out: "./drizzle",
  dbCredentials: {
    connectionString: process.env.DATABASE_URL!,
  },
};
export default configs;