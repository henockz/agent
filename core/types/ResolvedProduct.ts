export type ResolvedProduct = {
  productId: string;   // provider-specific identifier (ASIN, SKU, etc.)
  title: string;

  availability: "in_stock" | "out_of_stock";

  price: {
    amount: number;
    currency: string;
  };

  shippingOptions: Array<{
    speed: "standard" | "expedited" | "overnight";
    estimatedDeliveryDate: string; // ISO
    cost: number;
  }>;

  seller: {
    id: string;
    name: string;
  };

  fulfillment?: {
    type: "platform" | "merchant" | "third_party";
  };

  raw?: Record<string, unknown>;
};
