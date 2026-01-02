import type { PurchaseRequest } from "@core/types/PurchaseRequest.js";

export function buildPurchaseRequest(
  input: {
    provider: string;
    productId: string;
    maxTotalAmount?: number;
    confirmationToken: string;
    shippingSpeed: "standard" | "expedited" | "overnight";
  }
): PurchaseRequest {
  return {
    provider: input.provider,
    productId: input.productId,
    quantity: 1,
    shippingSpeed: input.shippingSpeed,
    maxTotalAmount: input.maxTotalAmount,
    userConfirmationToken: input.confirmationToken,
  };
}

