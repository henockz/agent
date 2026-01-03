import type { PurchaseRequest } from "@core/types/PurchaseRequest.js";
import assert from "node:assert";
import test from "node:test";

test("PurchaseRequest contains no UI fields", () => {
  const req: PurchaseRequest = {
    provider: "mock-retailer",
    productId: "ASIN123",
    quantity: 1,
    shippingSpeed: "standard",
    confirmationToken: "CONFIRM-123",
    idempotencyKey: "IDEMP-1",
  };

  const forbidden = [
    "label",
    "summary",
    "results",
    "input",
    "research",
    "deliveryAddressId",
    "paymentMethodId",
    "maxTotalAmount",
  ];

  forbidden.forEach(f => assert.ok(!(f in (req as any))));
});
