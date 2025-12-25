// core/agent/Agent.ts
import OpenAI from "openai";
import type { AgentContext } from "../context/AgentContext.js";

export class Agent {
  private readonly context: AgentContext;
  private client?: OpenAI;

  constructor(context: AgentContext) {
    this.context = context;
  }

  private getClient(): OpenAI {
    if (!this.client) {
      this.client = new OpenAI({ apiKey: this.context.apiKey });
    }
    return this.client;
  }

  async run(): Promise<void> {
    const handlers: Record<string,() => Promise<{ kind: "static" | "model"; text: string }>
    > = {
      help: async () => ({
        kind: "static",
        text: `Available commands:
- intro   Introduce the agent
- help    Show this help message`,
      }),

      intro: async () => ({
        kind: "model",
        text: `You are an agent.
Your id is "${this.context.agentId}".
From here on out, your name is "GooZ".
Introduce yourself in one short sentence.`,
      }),
    };

    const command = this.context.command;
    const handler = handlers[command] ?? handlers["help"];
    const result = await handler();

    if (result.kind === "static") {
      console.log(result.text);
      return;
    }

    const client = this.getClient();

    const response = await client.responses.create({
      model: "gpt-4.1-mini",
      input: result.text,
    });

    console.log(response.output_text);
  }
}
