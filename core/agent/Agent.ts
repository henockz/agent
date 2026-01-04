import { commands } from "@commands/index.js";
import type { CommandContext } from "@context/CommandContext.js";
import { CommandContextFactory } from "@context/CommandContextFactory.js";
import type { AgentResult } from "@core/types/AgentResult.js";

/**
 * Agent responsibilities:
 * - Route commands
 * - Derive context via factory
 * - Invoke handlers
 * - Normalize errors
 *
 * Agent must NOT:
 * - Contain domain logic
 * - Enforce execution rules
 * - Accumulate flags
 */

export class Agent {
  private readonly config: CommandContext;

  constructor(config: CommandContext) {
    this.config = config;
  }

  async run(command: string, args: string[]): Promise<AgentResult> {
    // Derive execution-related fields in ONE place
    const context = CommandContextFactory.withDerivedFields(this.config);

    if (!command) {
      return {
        command: "",
        status: "error",
        message: "No command provided",
        output: null,
      };
    }

    const handler = commands[command];
    if (!handler) {
      return {
        command,
        status: "error",
        message: `Unknown command: ${command}`,
        output: null,
      };
    }

    try {
      return await handler.run(args, context);
    } catch (err) {
      return {
        command,
        status: "error",
        message: (err as Error).message,
        output: null,
      };
    }
  }
}
