//core/types/CommandContext.ts
import type { ExecutionPolicy } from "@core/services/ExecutionPolicy.js";
import type { LLMClient } from "@llm/LLMClient.js";
import type { CommerceProvider } from "@tools/providers/CommerceProvider.js";
import type { SearchProvider } from "@tools/providers/SearchProvider.js";
import type { RuntimeConfig } from "./RuntimeConfig.js";

export type CommandContext = RuntimeConfig & {
  llm?: LLMClient;
  executionPolicy?: ExecutionPolicy;
  providers?: {
    search?: SearchProvider;
    commerce?: Record<string, CommerceProvider>;
  };
};
