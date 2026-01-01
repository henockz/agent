import { shop } from "@core/commands/shop.js";
import assert from "node:assert";
import test from "node:test";

test("shop executes purchase when commerce is configured", async () => {
  const fakeProvider = {
    name: "amazon",
    async search() {
      return [{ id: "ASIN123", title: "Premium Jogging Suit", price: 99, rating: 4.8 }];
    },
    async getProduct() {
      return {
        productId: "ASIN123",
        title: "Premium Jogging Suit",
        availability: "in_stock",
        price: { amount: 99, currency: "USD" },
        shippingOptions: [],
        seller: { id: "amz", name: "Amazon" },
      };
    },
    async purchase() {
      return {
        status: "success",
        provider: "amazon",
        orderId: "ORDER-1",
        chargedAmount: 99,
        currency: "USD",
        estimatedDeliveryDate: "2025-01-01",
        purchasedAtIso: new Date().toISOString(),
      };
    },
  };

    const ctx = {
    confirmationToken: "CONFIRM-123", // 👈 add this
    providers: {
        search: {
        async search() {
            return [{ id: "ASIN123", title: "Premium Jogging Suit", price: 99, rating: 4.8 }];
        },
        },
        commerce: { amazon: fakeProvider },
    },
    userPreferences: { maxPurchaseAmount: 150 },
    };


  const result = await shop.run(["buy", "sweater"], ctx as any);

  assert.strictEqual(result.status, "ok");
  assert.strictEqual((result.output as any).orderId, "ORDER-1");
});
