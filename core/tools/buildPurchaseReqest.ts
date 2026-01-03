import type { PurchaseRequest } from "@core/types/PurchaseRequest.js";
import { ShippingSpeed } from "@core/types/ShippingSpeed.js";

export function buildPurchaseRequest(input: {
  provider: string;
  productId: string;
  confirmationToken: string;
  shippingSpeed?: ShippingSpeed;
  idempotencyKey: string;
}): PurchaseRequest {
  return {
    provider: input.provider,
    productId: input.productId,
    confirmationToken: input.confirmationToken,
    shippingSpeed: input.shippingSpeed ?? "standard",
    quantity: 1,
    idempotencyKey: input.idempotencyKey,
  };
}
