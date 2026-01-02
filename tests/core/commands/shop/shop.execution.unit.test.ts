import { shop } from "@core/commands/shop.js";
import { MaxAmountExecutionPolicy } from "@services/MaxAmountExecutionPolicy.js";
import assert from "node:assert";
import test from "node:test";

test("shop executes purchase when commerce is configured", async () => {
    const fakeProvider =   getFakeProvider();

    const ctx = {
        confirmationToken: "CONFIRM-123",  
        providers: {
        search: {
            async search() {
                return [{ id: "ASIN123", title: "Premium Jogging Suit", price: 99, rating: 4.8 }];
            },
        },
        commerce: { retailer: fakeProvider },
    },
    userPreferences: { maxPurchaseAmount: 150 },
    };


  const result = await shop.run(["buy", "sweater"], ctx as any);

  assert.strictEqual(result.status, "ok");
  assert.strictEqual((result.output as any).orderId, "ORDER-1");
});


test("shop blocks purchase when max amount exceeded", async () => {
    const fakeProvider =   getFakeProvider();
  const ctx = {
    confirmationToken: "CONFIRM-123",
    executionPolicy: new MaxAmountExecutionPolicy({ maxPurchaseAmount: 50 }),
    providers: {
      search: {
        async search() {
          return [{ id: "ASIN123", title: "Premium Coat", price: 99, rating: 4.9 }];
        },
      },
      commerce: {
        retailer: fakeProvider, // same fake as before
      },
    },
  };

  const result = await shop.run(["buy", "coat"], ctx as any);

  assert.strictEqual(result.status, "error");
});

function getFakeProvider() {
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
        seller: { id: "amz", name: "mock-retailer" },
      };
    },
    async purchase() {
    return {
        status: "ok",
        orderId: "ORDER-1",
        chargedAmount: 99,
        currency: "USD",
        estimatedDeliveryDate: "2025-01-01",
        purchasedAtIso: new Date().toISOString(),
    };
    },

    };
    return fakeProvider;
  
    
}