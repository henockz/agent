import { AgentContext } from "./AgentContext.js";
export class DefaultAgentContext implements AgentContext {
  readonly agentId: string;
  readonly cwd: string;

  constructor(argv: string[], _env: NodeJS.ProcessEnv, cwd: string) {
    this.agentId = argv[0] ?? "Default";

    this.cwd = cwd;
  }
}
