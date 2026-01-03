//core/agent/Agent.ts
import { commands } from "@commands/index.js";
import type { CommandContext } from "@core/context/CommandContext.js";
import type { AgentResult } from "@core/types/AgentResult.js";
import { ExecutionMode } from "@core/types/ExecutionMode.js";
import { ExecutionPlan } from "@core/types/ExecutionPlan.js";
import { LLMSearchProvider } from "@tools/providers/LLMSearchProvider.js";

export class Agent {
  private readonly config: CommandContext;

  constructor(config: CommandContext) {
    this.config = config;
  }

  private trace(path: string): void {
    console.log(`[agent] path=${path}`);
  }
  private determineExecutionMode(): ExecutionMode {
    return this.config.providers?.commerce ? "execute" : "discover";
  }
  
 private buildContext(): CommandContext {
   const providers = this.config.providers;
   const executionIntent = "autonomous";

  const mode =
    providers?.commerce
      ? "execute"
      : "discover";

  return {
    ...this.config,
    mode,
    executionIntent: executionIntent,
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
      const searchProvider = this.config.providers?.search ?? new LLMSearchProvider(this.config.llm);
      const mode = this.determineExecutionMode();
      if (mode === "execute" && !this.config.executionPolicy) {
        return {
          command,
          status: "error",
          message: "Execution policy is required for execution mode",
          output: null,
        };
      }

      const executionPlan: ExecutionPlan = { intent: command ,mode: mode, steps: [], addStep(step) { this.steps.push(step);}};

      const result= await handler.run(args, {
          ...context, providers: {
            ...context.providers,
            search: searchProvider,
          },
        }, executionPlan);
      return {      
        ...result,
        output: {
          ... (result.output ?? {}),
          executionPlan
        }
      }

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
