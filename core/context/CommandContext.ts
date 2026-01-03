//core/types/CommandContext.ts
import type { RuntimeConfig } from "@config/RuntimeConfig.js";
import type { ExecutionPolicy } from "@core/services/ExecutionPolicy.js";
import { ExecutionMode } from "@core/types/ExecutionMode.js";
import { ShippingSpeed } from "@core/types/ShippingSpeed.js";
import type { ShoppingPreference } from "@core/types/ShoppingPrefrence.js";
import type { LLMClient } from "@llm/LLMClient.js";
import type { CommerceProvider } from "@tools/providers/CommerceProvider.js";
import type { SearchProvider } from "@tools/providers/SearchProvider.js";

export type CommandContext = RuntimeConfig & {
  readonly mode?: ExecutionMode;
  executionIntent?: "autonomous" | "requires_approval";

  // derived by Agent
  useResearch?: boolean;
  useRanking?: boolean;
  preference?: ShoppingPreference;
  telemetry?: boolean;

  // user intent inputs
  confirmationToken?: string;
  shippingSpeed?: ShippingSpeed;
  userPreferences?: {
    maxPurchaseAmount?: number;
  };
  idempotencyKey?: string;


  llm?: LLMClient;
  executionPolicy?: ExecutionPolicy;
  providers?: {
    search?: SearchProvider;
    commerce?: Record<string, CommerceProvider>;
  };
  
};
