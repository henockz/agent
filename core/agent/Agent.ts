// core/agent/Agent.ts
import { commands } from "@commands/index.js";
import { LLMClient } from "@llm/LLMClient.js";
import { AgentResult } from "../types/AgentResult.js";
import { RuntimeConfig } from "../types/RuntimeConfig.js";

export class Agent {
  private readonly llm: LLMClient;
  private readonly config: RuntimeConfig;


  constructor(config: RuntimeConfig, llm: LLMClient) {
    this.llm = llm;
    this.config = config;
  }

  async suggestShoppingItem(intent: string): Promise<string> {
  const prompt = `Suggest one shopping item for this intent: ${intent}`;
  return await this.llm.complete(prompt);
}

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
      return await handler.run(args, { ...this.config, llm: this.llm });

    } catch (err) {
      result.status = "error";
      result.message = (err as Error).message;
      return result;
    }
  }
}
