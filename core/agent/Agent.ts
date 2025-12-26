// core/agent/Agent.ts
import { IntentAnalyzer } from "../services/IntentAnalyer.js";
import { AgentResult } from "../types/AgentResult.js";
import { CommandHandler } from "../types/CommandHanler.js";
import { RuntimeConfig } from "../types/RuntimeConfig.js";


const commands: Record<string, CommandHandler> = {
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
  constructor(private readonly config: RuntimeConfig) {}

  async run(command: string | undefined, args: string[]): Promise<AgentResult> {
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
