
import { runtimeConfig } from "../config/environment/index.js";
import { Agent } from "../core/agent/Agent.js";
import { DefaultAgentContext } from "../core/context/DefaultAgentContext.js";

const context = new DefaultAgentContext(
  process.argv.slice(2),
  runtimeConfig,
  process.cwd()
);

const agent = new Agent(context);
await agent.run();
