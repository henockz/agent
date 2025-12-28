/* import { runtimeConfig } from "@config/bootstrap.js";
import { AgentContext } from "./AgentContext.js";
import { LLMClient } from "@llm/LLMClient.js";


export class DefaultAgentContext implements AgentContext {
  readonly agentId: string;
  readonly cwd: string;
  readonly apiKey: string;
  readonly command: string;
   
  

  constructor(argv: string[],env: typeof runtimeConfig, cwd: string) {
    this.agentId = "Default";
    this.command = argv.join(" ") ?? "help";
    if (!env.openAiApiKey) throw new Error("OPENAI_API_KEY is not set");
    this.apiKey = env.openAiApiKey
    this.cwd = cwd;
     
  }
}
 */