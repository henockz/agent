import { OpenAILLMClient } from "../../core/llm/OpenLLMClient.js";
import { config } from "dotenv";
/* 1️determine environment */
const NODE_ENV = process.env.NODE_ENV ?? "development";
const ENVIRONMENT = NODE_ENV.toLowerCase();
/* 2 validate environment name */
const VALID_ENVIRONMENTS = ["development", "test", "production"];
if (!VALID_ENVIRONMENTS.includes(ENVIRONMENT)) {
    throw new Error(`Invalid environment: ${ENVIRONMENT}. Expected one of: ${VALID_ENVIRONMENTS.join(", ")}`);
}
/* 3 load env file */
config({ path: `./config/environment/env/.env.${ENVIRONMENT}` });
/* 4 validate required variables */
const REQUIRED_ENV_VARS = ["OPENAI_API_KEY"];
for (const key of REQUIRED_ENV_VARS) {
    if (!process.env[key]) {
        throw new Error(`Missing required environment variable: ${key}`);
    }
}
/* 5 project into runtime config */
export const runtimeConfig = {
    environment: ENVIRONMENT,
    openAiApiKey: process.env.OPENAI_API_KEY,
    llm: new OpenAILLMClient(process.env.OPENAI_API_KEY),
};
