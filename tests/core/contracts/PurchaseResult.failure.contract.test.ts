import type { PurchaseResult } from "@core/types/PurchaseResult.js";
import assert from "node:assert";
import test from "node:test";

test("PurchaseResult error shape is stable", () => {
  const res: PurchaseResult = {
    status: "error",
    reason: "PAYMENT_FAILED",
    message: "Card declined",
  };

  assert.strictEqual(res.status, "error");
  assert.ok(res.reason);
});
