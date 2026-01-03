//config/environment/bootstrap.ts
import type { ExecutionConfig } from "@config/ExecutionConfig.js";
import type { CommandContext } from "@core/context/CommandContext.js";
import { OpenAILLMClient } from "@llm/OpenLLMClient.js";
import { MaxAmountExecutionPolicy } from "@services/MaxAmountExecutionPolicy.js";
import { SerpApiGoogleShoppingProvider } from "@tools/providers/SerpApiGoogleShoppingProvider.js";
import { config } from "dotenv";


/* 1️determine environment */
const NODE_ENV = process.env.NODE_ENV ?? "development";
const ENVIRONMENT = NODE_ENV.toLowerCase();

/* 2 validate environment name */
const VALID_ENVIRONMENTS = ["development", "test", "production"] as const;

if (!VALID_ENVIRONMENTS.includes(ENVIRONMENT as any)) {
  throw new Error(
    `Invalid environment: ${ENVIRONMENT}. Expected one of: ${VALID_ENVIRONMENTS.join(", ")}`
  );
}

/* 3 load env file */
config({ path: `./config/environment/env/.env.${ENVIRONMENT}` });
const executionConfig: ExecutionConfig =  ENVIRONMENT === "production"
    ? { maxPurchaseAmount: 500 }   // real guardrail
    : { maxPurchaseAmount: 25 };   // dev / test safety


/* 4 validate required variables */
const REQUIRED_ENV_VARS = ["OPENAI_API_KEY"] as const;

if (ENVIRONMENT === "production") {
  for (const key of REQUIRED_ENV_VARS) {
    if (!process.env[key]) {
      throw new Error(`Missing required environment variable: ${key}`);
    }
  }
}
/* 5 project into runtime config */
export const runtimeConfig = {
  environment: ENVIRONMENT,
  enableResearch: true, 
  llm: new OpenAILLMClient(process.env.OPENAI_API_KEY!),

} as const;

const executionPolicy = new MaxAmountExecutionPolicy(executionConfig);

export const commandContext: CommandContext = {
  ...runtimeConfig,

  mode: "discover",  

  executionPolicy,

  providers: process.env.SERPAPI_API_KEY
    ? {
        search: new SerpApiGoogleShoppingProvider({
          apiKey: process.env.SERPAPI_API_KEY,
        }),
      }
    : undefined,
};
