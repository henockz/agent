import type { PurchaseRequest } from "@core/types/PurchaseRequest.js";
import assert from "node:assert";
import test from "node:test";


test("PurchaseRequest contract is stable", () => {
  const req: PurchaseRequest = {
    provider: "mock-retailer",
    productId: "ASIN123",
    quantity: 1,
    shippingSpeed: "standard",
    confirmationToken: "CONFIRM-123",
    idempotencyKey: "IDEMP-123",
  };

  // required execution fields
  assert.strictEqual(req.provider, "mock-retailer");
  assert.strictEqual(req.productId, "ASIN123");
  assert.strictEqual(req.quantity, 1);
  assert.strictEqual(req.shippingSpeed, "standard");
  assert.strictEqual(req.confirmationToken, "CONFIRM-123");
  assert.strictEqual(req.idempotencyKey, "IDEMP-123");

  // ensure no policy / UI leakage
  const forbidden = [
    "maxTotalAmount",
    "deliveryAddressId",
    "paymentMethodId",
    "label",
    "summary",
    "results",
    "input",
    "research",
  ];

  forbidden.forEach(f => {
    assert.ok(!(f in (req as any)));
  });
});
