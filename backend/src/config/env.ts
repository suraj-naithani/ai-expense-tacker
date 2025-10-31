import path from "path";
import dotenv from "dotenv";

const currentEnv = process.env.NODE_ENV || "development";
const envFile = `.env.${currentEnv}`;

dotenv.config({ path: path.resolve(process.cwd(), envFile) });

export const isProduction = currentEnv === "production";
export const isDevelopment = currentEnv === "development";

