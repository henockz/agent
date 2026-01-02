
export function parseShopIntent(args: string[], ctx: any) {
  const query = args.join(" ");

  return {
    query,
    maxTotalAmount: ctx.userPreferences?.maxPurchaseAmount,
    confirmationToken: ctx.confirmationToken,
  };
}
