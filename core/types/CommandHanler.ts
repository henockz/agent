import { AgentResult } from "./AgentResult.js";
import type { RuntimeConfig } from "./RuntimeConfig.js";

export type CommandHandler = {
  description: string;
  run: (
    args: string[],
    ctx: RuntimeConfig
  ) => AgentResult | Promise<AgentResult>;
};
