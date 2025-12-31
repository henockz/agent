import type { PurchaseRequest } from "@core/types/PurchaseRequest.js";
import type { ResolvedProduct } from "@core/types/ResolvedProduct.js";
import type { ShopIntent } from "@core/types/ShopIntent.js";

export function buildPurchaseRequest(
  intent: ShopIntent,
  product: ResolvedProduct
): PurchaseRequest {
  return {
    provider: "amazon",

    productId: product.productId,
    quantity: intent.quantity,

    deliveryAddressId: intent.deliveryAddressId,
    paymentMethodId: intent.paymentMethodId,

    shippingSpeed: intent.shippingSpeed,
    maxTotalAmount: intent.maxTotalAmount,

    userConfirmationToken: intent.confirmationToken!,
  };
}
