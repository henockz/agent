import assert from "node:assert";
import test from "node:test";

import { shop } from "@commands/shop.js";
import { InMemorySearchProvider } from "@tools/providers/InMemorySearchProvider.js";
import { InMemoryLLMClient } from "tests/helpers/InMemoryLLMClient.js";
 
test("shop returns ranked search results", async () => {
  const ctx = {
    enableRanking: true,
    rankingPreference: "premium",
    providers: {
      search:new InMemorySearchProvider()
    }
  }


  const result = await shop.run(["buy", "sweater"], ctx as any);

  assert.strictEqual(result.status, "ok");

  const output = result.output as {
    results: Array<{ title: string }>;
  };

  assert.strictEqual(output.results[0].title, "Premium Jogging Suit");
});


test("shop ranks results and adds LLM summary", async () => {
  const inMemory = new InMemoryLLMClient("fake suggestion");

  const ctx = {
    llm: inMemory,
    enableResearch: false,
    enableRanking: true,
    rankingPreference: "premium",
    providers: {
      search: new InMemorySearchProvider(),
    },
  };

  const result = await shop.run(["buy", "sweater"], ctx as any);

  assert.strictEqual(result.status, "ok");

  const output = result.output as {
    input: string;
    results: any[];
    summary?: string;
  };

  assert.ok(output.results.length > 0);
  assert.strictEqual(output.summary, "fake suggestion");
  assert.ok(inMemory.lastPrompt.includes("Options:"));
});


test("shop works without LLM and skips summary", async () => {
   const ctx = {
     
     
    providers: {
      search:new InMemorySearchProvider()
    }
  }


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
  const ctx = {
    enableRanking: true,
     
    providers: {
      search:new InMemorySearchProvider()
    }
  }

  const result = await shop.run(["buy", "sweater", "budget"], ctx as any);

  assert.strictEqual(result.status, "ok");

  const output = result.output as {
    results: Array<{ title: string; price: number }>;
  };

  // budget should favor the cheapest option
  assert.strictEqual(output.results[0].price, 29.99);
});
 