import { LLMClient } from "@llm/LLMClient.js";

export type RuntimeConfig = {
  environment: string;
  openAiApiKey: string;
  llm:LLMClient
};
