import { AgentResult } from "./AgentResult.js";

export type CommandHandler = {
  description: string;
  run: (args: string[]) => AgentResult | Promise<AgentResult>;
};
