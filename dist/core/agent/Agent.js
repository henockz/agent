// core/agent/Agent.ts
import OpenAI from "openai";
export class Agent {
    context;
    client;
    constructor(context) {
        this.context = context;
    }
    getClient() {
        if (!this.client) {
            this.client = new OpenAI({ apiKey: this.context.apiKey });
        }
        return this.client;
    }
    async run() {
        const handlers = {
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
