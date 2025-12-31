import { SearchResult } from "@core/types/SearchResult.js";

// services/RankingService.ts
export class RankingService {
  rank(items: SearchResult[], limit: number, preference: "budget" | "premium"): SearchResult[] {
    if (preference === "premium") {
      return items
        .slice()
        .sort((a, b) => (b.rating - a.rating) || (b.price - a.price))
        .slice(0, limit);
    }

    // budget (keep your existing logic)
    const scored = items.map(r => ({ r, score: r.rating * 5 - r.price * 2 }));

    return scored
      .sort((a, b) => b.score - a.score)
      .slice(0, limit)
      .map(x => x.r);
  }
}

