import { runtimeConfig } from "../config/environment/bootstrap.js";
import { Agent } from "../core/agent/Agent.js";
const [, , command, ...args] = process.argv;
const agent = new Agent(runtimeConfig);
const result = await agent.run(command, args);
if (result.status === "error") {
    console.error(result.message ?? "Unknown error");
    process.exit(1);
}
console.log(result.output);
