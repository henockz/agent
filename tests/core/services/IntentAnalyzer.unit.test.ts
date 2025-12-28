import { IntentAnalyzer } from "@services/IntentAnalyer.js";




import assert from "node:assert";
import test from "node:test";
 
test("classifies apparel intent", () => {
  const analyzer = new IntentAnalyzer();

  const result = analyzer.analyze("I want to buy a sweater");

  assert.strictEqual(result, "apparel");
});

test("returns unknown for unrecognized intent", () => {
  const analyzer = new IntentAnalyzer();

  const result = analyzer.analyze("schedule a meeting with john");

  assert.strictEqual(result, "unknown");
});
