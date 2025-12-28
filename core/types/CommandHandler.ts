import type { AgentResult } from "./AgentResult.js";
import type { CommandContext } from "./CommandContext.js";

export type CommandHandler = {
  description: string;
  run: (args: string[], ctx: CommandContext) => Promise<AgentResult>;
};

/**
 * 
 * 
 * import { AgentResult } from "./AgentResult.js";
import type { RuntimeConfig } from "./RuntimeConfig.js";
import type { CommandContext } from "./CommandContext.js";

export type CommandHandler = {
  description: string;
  run: (
    args: string[],
    ctx: RuntimeConfig
  ) => AgentResult | Promise<AgentResult>;
};

 */