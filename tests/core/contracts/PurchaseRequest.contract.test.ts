import type { PurchaseRequest } from "@core/types/PurchaseRequest.js";
import assert from "node:assert";
import test from "node:test";
1

test("PurchaseRequest contract is stable", () => {
  const req: PurchaseRequest = {
    provider: "mock-retailer",
    productId: "ASIN123",
    quantity: 1,
    deliveryAddressId: "ADDR-1",
    paymentMethodId: "PM-1",
    shippingSpeed: "standard",
    maxTotalAmount: 150,
    userConfirmationToken: "CONFIRM-123",
  };

  assert.strictEqual(req.provider, "mock-retailer");
  assert.ok(typeof req.productId === "string");
  assert.ok(typeof req.quantity === "number");
  assert.ok(typeof req.userConfirmationToken === "string");
});
