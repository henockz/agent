 //config/RuntimeConfig.ts
import { ShoppingPreference } from "@core/types/ShoppingPrefrence.js";
import { LLMClient } from "@llm/LLMClient.js";
 
export type RuntimeConfig = {
  environment: string;
  enableResearch?: boolean;
  enableRanking?: boolean;
  enableTelemetry?: boolean;
  llm: LLMClient;
  rankingPreference?: ShoppingPreference;
};
 