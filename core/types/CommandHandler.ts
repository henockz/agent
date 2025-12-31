import type { AgentResult } from "./AgentResult.js";
import type { CommandContext } from "./CommandContext.js";

export type CommandHandler = {
  description: string;
  run: (args: string[], ctx: CommandContext) => Promise<AgentResult>;
};

 