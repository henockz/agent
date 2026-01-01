import type { PurchaseResult } from "@core/types/PurchaseResult.js";
import assert from "node:assert";
import test from "node:test";

test("PurchaseResult success shape is stable", () => {
  const res: PurchaseResult = {
    status: "success",
    provider: "amazon",
    orderId: "ORDER-1",
    chargedAmount: 99,
    currency: "USD",
    estimatedDeliveryDate: "2025-01-01",
    purchasedAtIso: new Date().toISOString(),
  };

  assert.strictEqual(res.status, "success");
  assert.ok(res.orderId);
  assert.ok(res.chargedAmount > 0);
});
