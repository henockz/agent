import { Agent } from "../core/agent/Agent.js";
import { runtimeConfig } from "../config/environment/bootstrap.js";
const [, , command, ...args] = process.argv;
const agent = new Agent(runtimeConfig);
try {
    const result = await agent.run(command, args);
    console.log(result.output);
}
catch (err) {
    console.error(err.message);
    process.exit(1);
}
