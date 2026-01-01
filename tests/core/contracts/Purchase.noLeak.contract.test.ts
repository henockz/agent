import type { PurchaseRequest } from "@core/types/PurchaseRequest.js";
import assert from "node:assert";
import test from "node:test";

test("PurchaseRequest contains no UI fields", () => {
  const req: PurchaseRequest = {
    provider: "amazon",
    productId: "ASIN123",
    quantity: 1,
    deliveryAddressId: "ADDR-1",
    paymentMethodId: "PM-1",
    shippingSpeed: "standard",
    maxTotalAmount: 150,
    userConfirmationToken: "CONFIRM-123",
  };

  const forbidden = ["label", "summary", "results", "input", "research"];
  forbidden.forEach(f => assert.ok(!(f in (req as any))));
});
