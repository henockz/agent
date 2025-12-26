// core/agent/Agent.ts
import { commands } from "../commands/index.js";
export class Agent {
    config;
    constructor(config) {
        this.config = config;
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
            return await handler.run(args, this.config);
        }
        catch (err) {
            result.status = "error";
            result.message = err.message;
            return result;
        }
    }
}
