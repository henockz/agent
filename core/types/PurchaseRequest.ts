import { ShippingSpeed } from "./ShippingSpeed.js";

export type PurchaseRequest = {
  provider: string;
  productId: string;
  confirmationToken: string;
  shippingSpeed: ShippingSpeed;
  quantity: number;
  idempotencyKey: string;
};