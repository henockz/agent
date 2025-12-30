
// core/agent/Agent.ts
import { commands } from "@commands/index.js";
import { LLMSearchProvider } from "@tools/providers/LLMSearchProvider.js";
import type { AgentResult } from "../types/AgentResult.js";
import { RuntimeConfig } from "../types/RuntimeConfig.js";
import { ExecutionContext } from "./ExecutionContext.js";
/*
import { RankingService } from "@services/RankingService.js";

import { SearchTool } from "@tools/SearchTool.js";
import { IntentAnalyzer } from "../services/IntentAnalyer.js";

import type { IntentCategory } from "../types/IntentCategories.js";

import type { SearchResult } from "../types/SearchResult.js";

*/
export class Agent {
  private readonly config: RuntimeConfig;

  constructor(config: RuntimeConfig) {
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
      return await handler.run(args, {
        ...this.config,
        llm: this.config.llm,
        providers: {
          search: new LLMSearchProvider(this.config.llm),
        },
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