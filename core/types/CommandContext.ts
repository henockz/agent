//core/types/CommandContext.ts
import type { LLMClient } from "@llm/LLMClient.js";
import type { SearchProvider } from "@tools/providers/SearchProvider.js";
import type { RuntimeConfig } from "./RuntimeConfig.js";
 

export type CommandContext = RuntimeConfig & {
  llm: LLMClient;
  providers?: {
    search?: SearchProvider;
  };
};
