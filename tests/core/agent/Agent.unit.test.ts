import { Agent } from "@agent/Agent.js";
import { runtimeConfig } from "@config/environment/bootstrap.js";
import assert from "node:assert";
import test from "node:test";
import { InMemoryLLMClient } from "tests/helpers/InMemoryLLMClient.js";
 
test("Agent can be constructed with context", () => {
  const llm = new InMemoryLLMClient(); 
   
  const agent = new Agent(runtimeConfig);
  

  assert.ok(agent);
});


test("Agent shop command can executes purchase when commerce is configured", async () => {
  const mockCommerceProvider = {
    name: "mock-retailer",

    async search(_query: string) {
      return [];
    },

    async getProduct(_productId: string) {
      return {
        productId: "ASIN123",
        title: "Premium Jogging Suit",
        availability: "in_stock" as const,
        price: { amount: 99, currency: "USD" },
        shippingOptions: [],
        seller: {
          id: "mock-retailer",
          name: "Mock Retailer",
        },
      };
    },

    async purchase(_request: any) {
      return {
        status: "ok" as const,
        orderId: "ORDER-1",
        chargedAmount: 99,
        currency: "USD",
        estimatedDeliveryDate: "2026-01-10",
        purchasedAtIso: new Date().toISOString(),
      };
    },
  };

  const agent = new Agent({
    environment: "test",
    llm: new InMemoryLLMClient("mock"),

    confirmationToken: "CONFIRM-123",
    idempotencyKey: "IDEMP-123",

    executionPolicy: {
      allowPurchase: () => ({ allowed: true }),
    },

   providers: {
      search: {
        async search(_query: string) {
          return [
            {
              id: "ASIN123",
              title: "Premium Jogging Suit",
              price: 99,
              rating: 4.8,
              uri: "https://example.com/product/ASIN123",
            },
          ];
        },
      },

      commerce: {
        retailer: mockCommerceProvider,
      },
    },

  });

  const result = await agent.run("shop", ["buy", "sweater"]);

  assert.strictEqual(result.status, "ok");
});
