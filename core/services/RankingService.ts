// services/RankingService.ts
import type { SearchResult } from "../types/SearchResult.js";

export class RankingService {
  rank(
  results: SearchResult[],
  topN = 3,
  preference: "budget" | "premium" = "premium"
): SearchResult[] {

  const maxPrice = Math.max(...results.map(r => r.price));

  const scored = results.map(r => {
    const normalizedPrice = r.price / maxPrice; // 0..1

    let score = 0;
    if (preference === "budget") {
      score = r.rating * 5 - normalizedPrice * 10;
    } 
    else {
      
      score = r.rating * 20 - normalizedPrice * 5;
      console.log(`premium score: ${score}`)
    }

    return { r, score };
  });

  return scored
    .sort((a, b) => b.score - a.score)
    .slice(0, topN)
    .map(x => x.r);
}

}
