import { config } from "dotenv";

/* 1️determine environment */
export const NODE_ENV = process.env.NODE_ENV ?? "development";
export const ENVIRONMENT = NODE_ENV.toLowerCase();

/* 2 validate environment name */
const VALID_ENVIRONMENTS = ["development", "test", "production"] as const;

if (!VALID_ENVIRONMENTS.includes(ENVIRONMENT as any)) {
  throw new Error(
    `Invalid environment: ${ENVIRONMENT}. Expected one of: ${VALID_ENVIRONMENTS.join(", ")}`
  );
}

/* 3 load env file */
config({ path: `.env.${ENVIRONMENT}` });

/* 4 validate required variables */
const REQUIRED_ENV_VARS = ["OPENAI_API_KEY"] as const;

for (const key of REQUIRED_ENV_VARS) {
  if (!process.env[key]) {
    throw new Error(`Missing required environment variable: ${key}`);
  }
}

/* 5 project into runtime config */
export const runtimeConfig = {
  environment: ENVIRONMENT,
  openAiApiKey: process.env.OPENAI_API_KEY!,
} as const;
