import util from "node:util";
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
      const preference =context.rankingPreference ?? (intent.query.includes("budget") ? "budget" : "premium");

      
      const rankingService = new RankingService();
      const results = rankingService.rank(candidates, 3, preference);
      
      // ─────────────────────────────────────────────
      // 5. Deterministic reasoning (non-LLM)
      // ─────────────────────────────────────────────

      let reasoning: string | undefined;

      const top = results[0];
      const runnerUp = results[1];

      if (top) {
        const parts: string[] = [];
        parts.push( `Ranked results using ${preference} preference based on rating, review volume, and price.` );

      if (typeof top.reviewCount === "number") {
        parts.push(`Top choice has ${top.rating}⭐ from ${top.reviewCount} reviews.`);
      }

      if (runnerUp) {
        const ratingDelta =  (top.rating ?? 0) - (runnerUp.rating ?? 0);
        const priceDelta = (runnerUp.price ?? 0) - (top.price ?? 0);

        if (ratingDelta > 0 && priceDelta > 0) {
          parts.push(`Top choice has a higher rating (+${ratingDelta.toFixed(1)}) and costs $${priceDelta.toFixed(2)} less than the next option.`);
        } else if (ratingDelta > 0) {
          parts.push(`Top choice has a higher rating (+${ratingDelta.toFixed(1)}) than the next option.`);
        } else if (priceDelta > 0) {
          parts.push(`Top choice costs $${priceDelta.toFixed(2)} less than the next option.`);
        } else {
          parts.push(`Top choice offers the best balance of rating and price among the options.`);
        }
      } else {
        parts.push(`Only one candidate was available to compare.`);
      }

      reasoning = parts.join(" ");
    }
    executionPlan?.addStep({
      name: "rank",
      description: reasoning,
    });

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
            results: results.map(r => ({
              id: r.id,
              title: r.title,
              price: r.price,
              rating: r.rating,
              reviewCount: r.raw?.reviewCount,
              uri: r.uri,
              raw: r.raw ? JSON.parse(JSON.stringify(r.raw)) : undefined,
            })),
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
    if (context.dryRun === true) {
      return {
            command: "shop",
            status: "ok",
            output: {
              executionType: "dry-run",
              productId: product.productId,
              price: product.price,
              shippingSpeed: intent.shippingSpeed ?? "standard",
              reasoning,  
              message: "Dry run completed. No purchase executed.",
            },
          };

      }    
    
    const purchaseResult = await provider.purchase(request);
    return mapPurchaseResult(purchaseResult);
  },
};
