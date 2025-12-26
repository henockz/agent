import { Agent } from "@agent/Agent.js";
import { runtimeConfig } from "./bootstrap.js";
const [, , command, ...args] = process.argv;
const agent = new Agent(runtimeConfig);
try {
    await agent.run(command, args);
}
catch (error) {
    console.error(error);
    process.exit(1);
}
