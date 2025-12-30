// services/RankingService.ts
import type { SearchResult } from "../types/SearchResult.js";
 

export class RankingService {
  rank( items: SearchResult[], limit: number, preference: "budget" | "premium"): SearchResult[] {
    const scored = items.map(r => {
      const score =
        preference === "budget"
          ? r.rating * 5 - r.price * 2
          : r.rating * 25 - r.price * 0.1;
      return { r, score };
    });

    return scored
      .sort((a, b) => b.score - a.score)
      .slice(0, limit)
      .map(x => x.r);
  }
}
