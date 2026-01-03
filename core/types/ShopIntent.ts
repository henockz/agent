import type { ShippingSpeed } from "./ShippingSpeed.js";
export type ShopIntent = {
  rawQuery: string;
  query: string;
  category?: string;
  quantity: number;
  maxTotalAmount?: number;
  shippingSpeed: ShippingSpeed;
  requireConfirmation: boolean;
  confirmationToken?: string;
  deliveryAddressId?: string;
  paymentMethodId?: string;
};
