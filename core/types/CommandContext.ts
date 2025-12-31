//core/types/CommandContext.ts
import type { LLMClient } from "@llm/LLMClient.js";
import type { CommerceProvider } from "@tools/providers/CommerceProvider.js";
import type { SearchProvider } from "@tools/providers/SearchProvider.js";
import type { RuntimeConfig } from "./RuntimeConfig.js";

export type CommandContext = RuntimeConfig & {
  llm: LLMClient;

  providers?: {
    search?: SearchProvider;
    commerce?: Record<string, CommerceProvider>;
  };

  userProfile?: {
    defaultAddressId?: string;
    defaultPaymentMethodId?: string;
  };

  userPreferences?: {
    maxPurchaseAmount?: number;
  };

  confirmationToken?: string;
};
