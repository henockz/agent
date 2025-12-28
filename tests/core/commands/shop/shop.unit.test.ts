import assert from "node:assert";
import test from "node:test";

import { shop } from "@commands/shop.js";
import type { LLMClient } from "@llm/LLMClient.js";

class FakeLLM implements LLMClient {
  lastPrompt = "";

  async complete(prompt: string): Promise<string> {
    this.lastPrompt = prompt;
    return "fake suggestion";
  }
}

test("shop returns ranked search results", async () => {
  const ctx = {};

  const result = await shop.run(["buy", "sweater"], ctx as any);

  assert.strictEqual(result.status, "ok");

  const output = result.output as {
    results: Array<{ title: string }>;
  };

  assert.strictEqual(output.results[0].title, "Premium Jogging Suit");
});

test("shop ranks results and adds LLM summary", async () => {
  const fakeLLM = new FakeLLM();

  const ctx = { llm: fakeLLM };

  const result = await shop.run(["buy", "sweater"], ctx as any);

  assert.strictEqual(result.status, "ok");

  const output = result.output as {
    input: string;
    results: any[];
    summary?: string;
  };

  assert.ok(output.results.length > 0);
  assert.strictEqual(output.summary, "fake suggestion");
  assert.ok(fakeLLM.lastPrompt.includes("Options:"));
});
test("shop works without LLM and skips summary", async () => {
  const ctx = {}; // no llm provided

  const result = await shop.run(["buy", "sweater"], ctx as any);

  assert.strictEqual(result.status, "ok");

  const output = result.output as {
    input: string;
    results: Array<{ rating: number }>;
    summary?: string;
  };

  assert.ok(output.results.length > 0);
  assert.strictEqual(output.summary, undefined);
});

test("shop applies budget preference to ranking", async () => {
  const ctx = {}; // no LLM needed

  const result = await shop.run(["buy", "sweater", "budget"], ctx as any);

  assert.strictEqual(result.status, "ok");

  const output = result.output as {
    results: Array<{ title: string; price: number }>;
  };

  // budget should favor the cheapest option
  assert.strictEqual(output.results[0].price, 29.99);
});