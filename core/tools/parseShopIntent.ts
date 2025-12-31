import type { CommandContext } from "../types/CommandContext.js";
import type { ShopIntent } from "../types/ShopIntent.js";

export function parseShopIntent(
    args: string[],
    ctx: CommandContext
): ShopIntent {

    if (args.length === 0) {
        throw new Error("SHOP_REQUIRES_QUERY");
    }

    const rawQuery = args.join(" ").trim();

    const quantity = 1;

    const maxTotalAmount = ctx.userPreferences?.maxPurchaseAmount;

   
    const shippingSpeed = "standard";

    const deliveryAddressId = ctx.userProfile?.defaultAddressId;
    const paymentMethodId = ctx.userProfile?.defaultPaymentMethodId;

     
    return {
        rawQuery,
        query: rawQuery.toLowerCase(),

        quantity,

        maxTotalAmount,

        shippingSpeed,

        requireConfirmation: Boolean(ctx.confirmationToken),
        confirmationToken: ctx.confirmationToken,

        deliveryAddressId,
        paymentMethodId,
    };
}
