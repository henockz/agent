import { ShopIntentContext } from "@core/context/ShopIntentContext.js";

export function resolveShopIntent(args: string[], context: ShopIntentContext) {
  const query = args.join(" ");

  return {
    query,
    maxTotalAmount: context.userPreferences?.maxPurchaseAmount,
    confirmationToken: context.confirmationToken,
    shippingSpeed: context.shippingSpeed,
    idempotencyKey: context.idempotencyKey,
  };
}
