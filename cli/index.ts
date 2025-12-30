import { Agent } from "@agent/Agent.js";
import { runtimeConfig } from "@config/environment/bootstrap.js";

const [, , command, ...args] = process.argv;

const input =args.join(" ");

const agent = new Agent(runtimeConfig);

try {
  const result = await agent.run(command,args);

  if (result.status === "error") {
    console.error(result.message);
    process.exit(1);
  }

  console.log(result.output);
}
catch (err) {
  console.error("Fatal error:", (err as Error).message);
  process.exit(1);
}
