import { AgentContext } from "@core/context/AgentContext.js";
import OpenAI from "openai";

export class Agent {
  readonly context: AgentContext;
  constructor(context: AgentContext) {
    this.context = context;
  }
  async run(): Promise<void> {
    const client = new OpenAI({ apiKey: this.context.apiKey });

    const handlers: Record<string, () => Promise<string>> = {
      intro: async () =>
        `You are an agent.
Your id is "${this.context.agentId}".
Introduce yourself in one short sentence.`,

      help: async () => `List the available commands briefly.`,
    };

    const command = this.context.command;
    const handler = handlers[command] ?? handlers["help"];

    const input = await handler();

    const response = await client.responses.create({
      model: "gpt-4.1-mini",
      input,
    });

    console.log(response.output_text);
  }
}
