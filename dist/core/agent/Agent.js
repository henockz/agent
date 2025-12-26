// core/agent/Agent.ts
import { IntentAnalyzer } from "../services/IntentAnalyer.js";
const commands = {
    echo: {
        description: "Echo back the provided text",
        run: (args) => ({
            command: "echo",
            output: args.join(" "),
        }),
    },
    "analyze-intent": {
        description: "Analyze text and classify intent",
        run: (args) => {
            if (args.length === 0) {
                throw new Error("analyze-intent requires text input");
            }
            const input = args.join(" ");
            const analyzer = new IntentAnalyzer();
            const category = analyzer.analyze(input);
            return {
                command: "analyze-intent",
                output: { input, category },
            };
        },
    },
    help: {
        description: "List available commands",
        run: () => ({
            command: "help",
            output: Object.entries(commands)
                .map(([name, cmd]) => ({ name, description: cmd.description }))
                .sort((a, b) => a.name.localeCompare(b.name)),
        }),
    },
};
export class Agent {
    config;
    constructor(config) {
        this.config = config;
    }
    async run(command, args) {
        if (!command) {
            throw new Error("No command provided");
        }
        const handler = commands[command];
        if (!handler) {
            throw new Error(`Unknown command: ${command}`);
        }
        return await handler.run(args);
    }
}
