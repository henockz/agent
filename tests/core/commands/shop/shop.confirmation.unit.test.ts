import { shop } from "@core/commands/shop.js";
import assert from "node:assert";
import test from "node:test";

test("shop blocks purchase without confirmation token", async () => {
  const ctx = {
    providers: {
      search: {
        async search() {
          return [{ id: "ASIN123", title: "Premium Jogging Suit", price: 99, rating: 4.8 }];
        },
      },
      commerce: {
        retailer: {
          name: "mock-retailer",
          async search() { return []; },
          async getProduct() {
            return {
              productId: "ASIN123",
              title: "Premium Jogging Suit",
              availability: "in_stock",
              price: { amount: 99, currency: "USD" },
              shippingOptions: [],
              seller: { id: "amz", name: "mock-retailer" },
            };
          },
          async purchase() {
            throw new Error("SHOULD_NOT_BE_CALLED");
          },
        },
      },
    },
    userPreferences: { maxPurchaseAmount: 150 },
  };

  const result = await shop.run(["buy", "sweater"], ctx as any);

  assert.strictEqual(result.status, "error");
  assert.strictEqual(result.output, "Purchase requires explicit confirmation");
});
