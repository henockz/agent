export type PurchaseRequest = {
  provider: string;

  productId: string;        // ASIN (must be buyable)
  quantity: number;

  deliveryAddressId?: string;
  paymentMethodId?: string;

  shippingSpeed: "standard" | "expedited" | "overnight";

  maxTotalAmount?: number;   // hard safety cap (tax + shipping included)

  userConfirmationToken: string; // proves explicit approval
};
