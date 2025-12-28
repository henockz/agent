
import type { LLMClient } from "@llm/LLMClient.js";
import type { RuntimeConfig } from "./RuntimeConfig.js";

export type CommandContext = RuntimeConfig & {
  llm?: LLMClient;
};
