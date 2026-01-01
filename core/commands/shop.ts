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

    // 4. Rank (RESTORED — this is what the test needs)
    const preference =
      ctx.rankingPreference ??
      (intent.query.includes("budget") ? "budget" : "premium");

    const rankingService = new RankingService();
    const results = rankingService.rank(candidates, 3, preference);


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
    // DISCOVERY MODE (tests expect this)
    // ─────────────────────────────────────────────
    if (!ctx.providers?.commerce) {
     return {
        command: "shop",
        status: "ok",
        output: {
          input: intent.query,
          results,
          summary,
        },
      };

    }

    // ─────────────────────────────────────────────
    // EXECUTION MODE (purchase path)
    // ─────────────────────────────────────────────
    const provider = ctx.providers.commerce["amazon"];
    if (!provider) {
      return {
        command: "shop",
        status: "error",
        output: "Commerce provider not available",
      };
    }

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
    }


    const purchaseResult = await provider.purchase(buildPurchaseRequest(intent, product));

    return mapPurchaseResult(purchaseResult);
  },
};
