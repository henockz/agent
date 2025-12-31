//core/agent/Agent.ts
import { commands } from "@commands/index.js";
import type { AgentResult } from "@core/types/AgentResult.js";
import type { CommandContext } from "@core/types/CommandContext.js";
import { LLMSearchProvider } from "@tools/providers/LLMSearchProvider.js";
import { ExecutionContext } from "./ExecutionContext.js";

export class Agent {
  private readonly config: CommandContext;

  constructor(config: CommandContext) {
    this.config = config;
  }

  private trace(path: string): void {
    console.log(`[agent] path=${path}`);
  }

  private buildContext(): ExecutionContext {
    return {
      useResearch: this.config.enableResearch === true,
      useRanking: this.config.enableRanking === true,
      preference: this.config.rankingPreference ?? "premium",
      telemetry: this.config.enableTelemetry === true,
    };
  }

  async run(command: string, args: string[]): Promise<AgentResult> {
    const context = this.buildContext();

    if (context.telemetry) {
      const path = this.config.enableResearch
        ? (this.config.enableRanking ? "search+rank" : "search")
        : "analyze";
      this.trace(path);
    }

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
      const searchProvider =
        this.config.providers?.search ?? new LLMSearchProvider(this.config.llm);

      return await handler.run(args, {
        ...this.config,
        llm: this.config.llm,
        providers: { search: searchProvider },
      });
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
