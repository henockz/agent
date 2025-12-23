import OpenAI from "openai";
export class Agent {
    context;
    constructor(context) {
        this.context = context;
    }
    async run() {
        const client = new OpenAI({ apiKey: this.context.apiKey });
        const handlers = {
            intro: async () => `You are an agent.
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
