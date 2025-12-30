// core/tools/ResponseCleaner.test.ts
import assert from "node:assert";
import test from "node:test";

import { ResponseCleaner } from "@helpers/ResponseCleaner.js";

test("ResponseCleaner.extractJson", () => {
  // raw JSON unchanged
  {
    const input = `{"a":1}`;
    const output = ResponseCleaner.extractJson(input);
    assert.strictEqual(output, `{"a":1}`);
  }

  // strips ```json fenced blocks
  {
    const input = `
\`\`\`json
{"a":1}
\`\`\`
`;
    const output = ResponseCleaner.extractJson(input);
    assert.strictEqual(output, `{"a":1}`);
  }

  // strips ``` fenced blocks without language
  {
    const input = `
\`\`\`
{"a":1}
\`\`\`
`;
    const output = ResponseCleaner.extractJson(input);
    assert.strictEqual(output, `{"a":1}`);
  }

  // trims leading and trailing whitespace
  {
    const input = `   \n{"a":1}\n   `;
    const output = ResponseCleaner.extractJson(input);
    assert.strictEqual(output, `{"a":1}`);
  }
});
