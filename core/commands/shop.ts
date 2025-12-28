import { RankingService } from "@services/RankingService.js";
import { ShoppingPolicyService } from "@services/ShoppingPolicyService.js";
import { SearchTool } from "@tools/SearchTool.js";
import type { AgentResult } from "../types/AgentResult.js";
import type { CommandHandler } from "../types/CommandHandler.js";

export const shop: CommandHandler = {
  description: "Suggest shopping items",

  run: async (args, ctx) => {
    let result: AgentResult = {
      status: "ok",
      command: "shop",
      output: {},
    };

    if (args.length === 0) {
      result.status = "error";
      result.message = "shop requires intent text";
      return result;
    }

    const input = args.join(" ").toLowerCase();
    const preference = input.includes("budget") ? "budget" : "premium";

    // 1 policy
    const policy = new ShoppingPolicyService();
    const decision = policy.evaluate(input);

    if (!decision.allowed) {
      result.status = "error";
      result.message = decision.reason;
      return result;
    }

    // 2 search (fake for now)
    const searchTool = new SearchTool();
    const candidates = searchTool.search(input);

    // 3 rank
    const rankingService = new RankingService();
    const ranked = rankingService.rank(candidates, 3,preference);

    // 4 return structured result
    let summary: string | undefined;
 

    if (ctx.llm) {
      const lines = ranked.map((r, i) => `${i + 1}. ${r.title} — $${r.price} — rating ${r.rating}`).join("\n");
     
      const category = decision.category!;
       
      summary = await ctx.llm.complete(
        `In one concise sentence, explain why the top-ranked item is the best ${preference} choice among the available ${category} options.
      Focus only on rating and price comparison.

      Options:
      ${lines}`
      );

    }

    result.output = {
      input,
      results: ranked,
      summary,
    };
 
  return result;
  },
};