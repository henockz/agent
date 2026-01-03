/* import { shop } from "@core/commands/shop.js";
import { CommandContext } from "@core/context/CommandContext.js";
import { MaxAmountExecutionPolicy } from "@services/MaxAmountExecutionPolicy.js";
import assert from "node:assert";
import test from "node:test";
import { InMemoryLLMClient } from "tests/helpers/InMemoryLLMClient.js";

test("shop executes purchase when commerce is configured", async () => {
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
      commerce: {
        retailer: mockCommerceProvider,
      },
    },
  });

  const result = await agent.run("shop", ["buy", "sweater"]);

  assert.strictEqual(result.status, "ok");
});
 */