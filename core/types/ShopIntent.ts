export type ShopIntent = {
  rawQuery: string;
  query: string;

  quantity: number;
  maxTotalAmount?: number;

  shippingSpeed: "standard" | "expedited" | "overnight";

  requireConfirmation: boolean;
  confirmationToken?: string;

  deliveryAddressId?: string;
  paymentMethodId?: string;
};
