import { AgentContext } from "./AgentContext.js";
export class DefaultAgentContext implements AgentContext {
  readonly agentId: string;
  readonly cwd: string;
  readonly apiKey: string;
  readonly command: string;

  constructor(argv: string[], env: NodeJS.ProcessEnv, cwd: string) {
    this.agentId = "Default";
    this.command = argv[0] ?? "help";
    if (!env.OPENAI_API_KEY) throw new Error("OPENAI_API_KEY is not set");
    this.apiKey = env.OPENAI_API_KEY;
    this.cwd = cwd;
  }
}
