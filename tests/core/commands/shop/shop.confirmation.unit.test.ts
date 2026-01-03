import { shop } from "@core/commands/shop.js";
import { CommandContext } from "@core/context/CommandContext.js";
import assert from "node:assert";
import test from "node:test";
import { InMemoryLLMClient } from "tests/helpers/InMemoryLLMClient.js";

test("shop blocks purchase without confirmation token", async () => {
  const ctx: CommandContext = {
    environment: "test",
    llm:new InMemoryLLMClient("mock suggestion"),
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
        retailer: {
          name: "mock-retailer",

          async search(_query: string) {
            return [];
          },

          async getProduct(_productId: string) {
            return {
              productId: "ASIN123",
              title: "Premium Jogging Suit",
              availability: "in_stock",
              price: { amount: 99, currency: "USD" },
              shippingOptions: [],
              seller: {
                id: "mock-retailer",
                name: "Mock Retailer",
              },
            };
          },

          async purchase() {
            throw new Error("SHOULD_NOT_BE_CALLED");
          },
        },
      },

    },

    executionPolicy: {
      allowPurchase: () => ({ allowed: true }),
    },

    // missing confirmationToken is the point of the test
    idempotencyKey: "IDEMP-123",

    userPreferences: { maxPurchaseAmount: 150 },
  };

  const result = await shop.run(["buy", "sweater"], ctx);

  assert.strictEqual(result.status, "error");
  assert.strictEqual(
    result.output,
    "Purchase requires explicit confirmation"
  );
});
