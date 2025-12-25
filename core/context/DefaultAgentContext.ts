import { runtimeConfig } from "@config/index.js";
import { AgentContext } from "./AgentContext.js";


export class DefaultAgentContext implements AgentContext {
  readonly agentId: string;
  readonly cwd: string;
  readonly apiKey: string;
  readonly command: string;

  constructor(argv: string[],env: typeof runtimeConfig, cwd: string) {
    this.agentId = "Default";
    this.command = argv[0] ?? "help";
    if (!env.openAiApiKey) throw new Error("OPENAI_API_KEY is not set");
    this.apiKey = env.openAiApiKey
    this.cwd = cwd;
  }
}
