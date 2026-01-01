import type { PurchaseResult } from "@core/types/PurchaseResult.js";
import assert from "node:assert";
import test from "node:test";

test("PurchaseResult failure shape is stable", () => {
  const res: PurchaseResult = {
    status: "failed",
    provider: "amazon",
    reason: "PAYMENT_FAILED",
    message: "Card declined",
  };

  assert.strictEqual(res.status, "failed");
  assert.ok(res.reason);
});
