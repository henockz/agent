import { Agent } from "@agent/Agent.js";
import { runtimeConfig } from "@config/environment/bootstrap.js";
import { OpenAILLMClient } from "@llm/OpenLLMClient.js";
import assert from "node:assert";
import test from "node:test";
 
test("Agent can be constructed with context", () => {
  const llm = new OpenAILLMClient(runtimeConfig.openAiApiKey);
  const agent = new Agent(runtimeConfig,llm);
  

  assert.ok(agent);
});

test("Agent can be constructed with config", () => {
  const llm = new OpenAILLMClient(runtimeConfig.openAiApiKey);
  const agent = new Agent(runtimeConfig,llm);
  
  assert.ok(agent);
});


