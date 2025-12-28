// core/agent/Agent.ts
import { commands } from "../commands/index.js";
export class Agent {
    llm;
    config;
    constructor(config, llm) {
        this.llm = llm;
        this.config = config;
    }
    async suggestShoppingItem(intent) {
        const prompt = `Suggest one shopping item for this intent: ${intent}`;
        return await this.llm.complete(prompt);
    }
    async run(command, args) {
        const result = {
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
        }
        catch (err) {
            result.status = "error";
            result.message = err.message;
            return result;
        }
    }
}
