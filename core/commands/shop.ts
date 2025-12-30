import { Categories } from "@config/categories.js";
import { generateResearch } from "@llm/generateResearch.js";
import { RankingService } from "@services/RankingService.js";
import { ShoppingPolicyService } from "@services/ShoppingPolicyService.js";

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
    const preference = ctx.rankingPreference ?? (input.includes("budget") ? "budget" : "premium");
    

    // 1 policy
    const policy = new ShoppingPolicyService();
    const decision = policy.evaluate(input);

    if (!decision.allowed) {
      result.status = "error";
      result.message = decision.reason;
      return result;
    }

      
      let research;
     
      if (ctx.enableResearch && ctx.llm && decision.category) {
        const categoryConfig = Categories[decision.category] as {
          research: {
            baseQuestions: readonly string[];
            baseQueries: readonly string[];
          };
        
        }

        research = await generateResearch(ctx.llm,input,decision.category,categoryConfig.research.baseQuestions,categoryConfig.research.baseQueries);
      }

    // 2 search 
    const searchProvider = ctx.providers?.search;

    if (!searchProvider) {
    result.status = "error";
    result.message = "Search provider not configured";
    return result;
    }

    const candidates = await searchProvider.search(input);


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
      research
    };
 
  return result;
  },
};