// core/agent/Agent.ts
import { commands } from "../commands/index.js";
import { AgentResult } from "../types/AgentResult.js";
import { RuntimeConfig } from "../types/RuntimeConfig.js";

export class Agent {
  constructor(private readonly config: RuntimeConfig) {}

  async run(command: string | undefined, args: string[]): Promise<AgentResult> {
    const result: AgentResult = {
      command: command ?? "",
      status: "ok",
      output: {},
    };

    if (!command) {
      result.status = "error";
      result.message = "No command provided";
      return result;
    }

    const handler = commands[command];
    if (!handler) {
      result.status = "error";
      result.message = `Unknown command: ${command}`;
      return result;
    }

    try {
      return await handler.run(args, this.config);
    } catch (err) {
      result.status = "error";
      result.message = (err as Error).message;
      return result;
    }
  }
}
