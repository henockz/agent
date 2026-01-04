import util from "node:util";
import { Agent } from "@agent/Agent.js";
import { runtimeConfig } from "@config/environment/bootstrap.js";
import { LLMSearchProvider } from "@tools/providers/LLMSearchProvider.js";
import { SerpApiGoogleShoppingProvider } from "@tools/providers/SerpApiGoogleShoppingProvider.js";

const [, , command, ...rawArgs] = process.argv;
// parse --search=...
const flagSearch = rawArgs.find(a => a.startsWith("--search="));
const requested = flagSearch ? flagSearch.split("=", 2)[1] : undefined;

// default: prefer serpapi if configured, else llm
const searchName = requested ?? (process.env.SERPAPI_API_KEY ? "serpapi-google" : "llm");

// remove flags from args passed to command handlers
const args = rawArgs.filter(a => !a.startsWith("--search="));

function buildSearchProvider(name: string) {
  if (name === "serpapi-google") {
    if (!process.env.SERPAPI_API_KEY) {
      throw new Error("SERPAPI_API_KEY is required for --search=serpapi-google");
    }
    return new SerpApiGoogleShoppingProvider({ apiKey: process.env.SERPAPI_API_KEY });
  }

  return new LLMSearchProvider(runtimeConfig.llm);
}


const agent = new Agent({
  ...runtimeConfig,
  providers: {
    search: buildSearchProvider(searchName),
  },
});

try {
  const result = await agent.run(command, args);

  if (result.status === "error") {
    console.error(result.message);
    process.exit(1);
  }
  console.dir(result.output, { depth: null });

  //console.log(result.output);
} catch (err) {
  console.error("Fatal error:", (err as Error).message);
  process.exit(1);
}
