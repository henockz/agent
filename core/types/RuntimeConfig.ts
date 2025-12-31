//core/types/RuntimeConfig.ts
import { LLMClient } from "@llm/LLMClient.js";

export type RuntimeConfig = {
  environment: string;
  enableResearch?: boolean;
  enableRanking?: boolean;
  enableTelemetry?: boolean;
  llm: LLMClient;
  rankingPreference?: "budget" | "premium";
};
