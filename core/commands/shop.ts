import { RankingService } from "@services/RankingService.js";
import { buildPurchaseRequest } from "@tools/buildPurchaseReqest.js";
import { mapPurchaseResult } from "@tools/mapPurchaseResult.js";
import { parseShopIntent } from "@tools/parseShopIntent.js";
import type { AgentResult } from "../types/AgentResult.js";
import type { CommandHandler } from "../types/CommandHandler.js";

export const shop: CommandHandler = {
  description: "Search and optionally purchase products",

  async run(args, ctx): Promise<AgentResult> {
    // 1. Parse intent
    const intent = parseShopIntent(args, ctx);

    // 2. Search provider is REQUIRED
    const searchProvider = ctx.providers?.search;
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
      ctx.rankingPreference ??
      (intent.query.includes("budget") ? "budget" : "premium");

    const rankingService = new RankingService();
    const results = rankingService.rank(candidates, 3, preference);

  // 5. Reasoning (to be produced as part of ExecutionPlan)
  // Intentionally empty until ExecutionPlan is introduced
  let reasoning: string | undefined;

 
    // 6. Optional LLM summary
    let summary: string | undefined;

    if (ctx.llm) {
      const lines = results
        .map(
          (r, i) =>
            `${i + 1}. ${r.title} — $${r.price} — rating ${r.rating}`
        )
        .join("\n");

      summary = await ctx.llm.complete(
        `In one concise sentence, explain why the top-ranked item is the best choice among the available options.
Focus only on rating and price comparison.

Options:
${lines}`
      );
    }

    // ─────────────────────────────────────────────
    // DISCOVERY MODE
    // ─────────────────────────────────────────────
    if (!ctx.providers?.commerce) {
      return {
        command: "shop",
        status: "ok",
        output: {
          input: intent.query,
          results,
          summary,
          reasoning, // 👈 added here
        },
      };
    }

    // ─────────────────────────────────────────────
    // EXECUTION MODE
    // ─────────────────────────────────────────────
    const commerceProviders = ctx.providers.commerce;
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
      maxTotalAmount: intent.maxTotalAmount,
      confirmationToken: intent.confirmationToken,
      shippingSpeed: "standard",
    });

    // execution policy (final safety gate)
  if (ctx.executionPolicy) {
  const decision = ctx.executionPolicy.allowPurchase({
    provider: provider.name,
    amount: product.price.amount,
  });

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
