export type PurchaseResult =
  | {
      status: "success";
      provider: "amazon";

      orderId: string;

      chargedAmount: number;
      currency: string;

      estimatedDeliveryDate: string; // ISO

      purchasedAtIso: string;
      raw?: Record<string, unknown>;
    }
  | {
      status: "failed";
      provider: "amazon";

      reason:
        | "OUT_OF_STOCK"
        | "PRICE_CHANGED"
        | "AMOUNT_EXCEEDED"
        | "PAYMENT_FAILED"
        | "AUTH_EXPIRED"
        | "UNKNOWN";

      message?: string;
      raw?: Record<string, unknown>;
    };
