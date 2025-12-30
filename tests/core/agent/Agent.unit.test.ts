import { Agent } from "@agent/Agent.js";
import { runtimeConfig } from "@config/environment/bootstrap.js";
import assert from "node:assert";
import test from "node:test";
import { InMemoryLLMClient } from "tests/helpers/InMemoryLLMClient.js";
 
test("Agent can be constructed with context", () => {
  const llm = new InMemoryLLMClient(); 
   
  const agent = new Agent(runtimeConfig);
  

  assert.ok(agent);
});
/*
test("Agent can be constructed with config", () => {
  const llm = new OpenAILLMClient(runtimeConfig.openAiApiKey);
  const agent = new Agent(runtimeConfig,llm);
  
  assert.ok(agent);
});
*/

