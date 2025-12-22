import { AgentContext } from "@core/context/AgentContext.js";

export class Agent {
  readonly context: AgentContext;
  constructor(context: AgentContext) {
    this.context = context;
  }

  async run(): Promise<void> {
    console.log(this.context, {
      agentId: this.context.agentId,
      cwd: this.context.cwd,
    });
  }
}
