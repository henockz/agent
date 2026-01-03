import { ShopIntentContext } from "@core/context/ShopIntentContext.js";
import type { AgentResult } from "@core/types/AgentResult.js";
import type { CommandHandler } from "@core/types/CommandHandler.js";
import { ExecutionPlan } from "@core/types/ExecutionPlan.js";
import { RankingService } from "@services/RankingService.js";
import { buildPurchaseRequest } from "@tools/buildPurchaseReqest.js";
import { mapPurchaseResult } from "@tools/mapPurchaseResult.js";
import { resolveShopIntent } from "@tools/resolveShopIntent.js";
/**
 * EXECUTION INVARIANTS (v1)
 *
 * - Execution is allowed ONLY when:
 *   - commerce provider is configured
 *   - confirmationToken is present
 *   - idempotencyKey is present
 *   - executionPolicy explicitly allows purchase
 *
 * - Search is always performed before execution (v1 design)
 * - PurchaseRequest contains ONLY execution-critical fields
 * - Policy constraints (e.g. maxTotalAmount) are validated BEFORE execution
 *
 * Do NOT bypass these checks.
 */

export const shop: CommandHandler = {
  description: "Search and optionally purchase products",

  async run(args, context, executionPlan?:ExecutionPlan): Promise<AgentResult> {

    if (context.mode === "execute") {
      if (!context.providers?.commerce) {
        return {
          command: "shop",
          status: "error",
          output: "Execution mode requires a commerce provider",
        };
      }
      

      const intentContext: ShopIntentContext = {
        userPreferences: context.userPreferences,
        confirmationToken: context.confirmationToken,
        shippingSpeed: context.shippingSpeed,
        };

       const intent = resolveShopIntent(args, intentContext);


      if (!resolveShopIntent(args, context).confirmationToken) {
        return {
          command: "shop",
          status: "error",
          output: "Purchase requires explicit confirmation",
        };
      }
    }
    if (context.mode === "execute") {
      const commerceProviders = context.providers?.commerce;
      const providerEntries = commerceProviders
        ? Object.values(commerceProviders)
        : [];

      if (providerEntries.length === 0) {
        return {
          command: "shop",
          status: "error",
          output: "No commerce provider configured",
        };
      }

      if (providerEntries.length > 1) {
        return {
          command: "shop",
          status: "error",
          output: "Multiple commerce providers configured; provider selection required",
        };
      }
    }


    // 1. Parse intent
    
    const intent = resolveShopIntent(args, context);

    
    // 2. Search provider is REQUIRED
    const searchProvider = context.providers?.search;
    if (!searchProvider) {
      return {
        command: "shop",
        status: "error",
        output: "Search provider not configured",
      };
    }

    // 3. Search
    const candidates = await searchProvider.search(intent.query);
    if (candidates.length === 0) {
      return {
        command: "shop",
        status: "error",
        output: "No results found",
      };
    }

    // 4. Rank
    const preference =
      context.rankingPreference ??
      (intent.query.includes("budget") ? "budget" : "premium");

    const rankingService = new RankingService();
    const results = rankingService.rank(candidates, 3, preference);

  // 5. Reasoning (to be produced as part of ExecutionPlan)
  // Intentionally empty until ExecutionPlan is introduced
  let reasoning: string | undefined;

 
    // 6. Optional LLM summary
    let summary: string | undefined;

    if (context.llm) {
      const lines = results
        .map(
          (r, i) =>
            `${i + 1}. ${r.title} — $${r.price} — rating ${r.rating}`
        )
        .join("\n");

      summary = await context.llm.complete(
        `In one concise sentence, explain why the top-ranked item is the best choice among the available options.
Focus only on rating and price comparison.

Options:
${lines}`
      );
    }

    // ─────────────────────────────────────────────
    // DISCOVERY MODE
    // ─────────────────────────────────────────────
    if (context.mode !== "execute" && !context.providers?.commerce) {
      return {
        command: "shop",
        status: "ok",
        output: {
          input: intent.query,
          results,
          summary,
          reasoning, 
        },
      };
    }
    if (context.mode === "execute" && !context.providers?.commerce) {
      return {
        command: "shop",
        status: "error",
        message: "Execution mode requires a commerce provider",
        output: null,
      };
    }


    // ─────────────────────────────────────────────
    // EXECUTION MODE
    // ─────────────────────────────────────────────
    if (!intent.idempotencyKey) {
      return {
        command: "shop",
        status: "error",
        output: "Execution requires an idempotency key",
      };
    }


    if (!context.providers?.commerce) {
      return {
        command: "shop",
        status: "error",
        output: "Execution mode requires a commerce provider",
      };
    }

    const commerceProviders = context.providers.commerce;
    const providerEntries = Object.values(commerceProviders);

    if (providerEntries.length === 0) {
    return {
      command: "shop",
      status: "error",
      output: "No commerce providers configured",
    };
    }

    if (providerEntries.length > 1) {
    return {
      command: "shop",
      status: "error",
      output: "Multiple commerce providers configured; provider selection required",
    };
    }

    const provider = providerEntries[0];


    const selected = results[0];

    if (!selected.id) {
      return {
        command: "shop",
        status: "error",
        output: "Selected product is not purchasable",
      };
    }

    const product = await provider.getProduct(selected.id);

    if (product.availability !== "in_stock") {
      return {
        command: "shop",
        status: "error",
        output: "Product out of stock",
      };
    }

    if (
      intent.maxTotalAmount &&
      product.price.amount > intent.maxTotalAmount
    ) {
      return {
        command: "shop",
        status: "error",
        output: "Price exceeds allowed limit",
      };
    }

    if (!intent.confirmationToken) {
      return {
        command: "shop",
        status: "error",
        output: "Purchase requires explicit confirmation",
      };
    }1
   const request = buildPurchaseRequest({
      provider: provider.name,
      productId: product.productId,
      confirmationToken: intent.confirmationToken,
      shippingSpeed: intent.shippingSpeed,
      idempotencyKey: intent.idempotencyKey,
    });


    // execution policy (final safety gate)
  if (context.executionPolicy) {
    const decision =context.executionPolicy.allowPurchase({provider: provider.name,amount: product.price.amount });

  if (!decision.allowed) {
    return {
      command: "shop",
      status: "error",
      output: decision.reason ?? "Purchase blocked by execution policy",
    };
  }
}

    
    const purchaseResult = await provider.purchase(request);

    return mapPurchaseResult(purchaseResult);
  },
};
