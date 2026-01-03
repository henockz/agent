import type { CommandContext } from "../context/CommandContext.js";
import type { AgentResult } from "./AgentResult.js";
import { ExecutionPlan } from "./ExecutionPlan.js";

export type CommandHandler = {
  description: string;
  run(
  args: string[],
  context: CommandContext,
  executionPlan?: ExecutionPlan
): Promise<AgentResult>;

};

 