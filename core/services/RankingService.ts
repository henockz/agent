import { SearchResult } from "@core/types/SearchResult.js";

// services/RankingService.ts
export class RankingService {

  rank(
    items: SearchResult[],
    limit: number,
    preference: "budget" | "premium"
  ): SearchResult[] {

    const scored = items.map(r => ({
      r,
      score: this.score(r, preference),
    }));

    return scored
      .sort((a, b) => b.score - a.score)
      .slice(0, limit)
      .map(x => x.r);
  }

  // ─────────────────────────────────────────────
  // Scoring seam (EXACT current behavior)
  // ─────────────────────────────────────────────
    private score(item: SearchResult,preference: "budget" | "premium"  ): number {

    if (preference === "premium") {
      const reviewCount = item.reviewCount ?? 0;

      const confidence = Math.log10(reviewCount + 1) + 1;
      const adjustedRating = item.rating * confidence;

      return adjustedRating * 10_000 - item.price;
    }

    // budget unchanged
    return item.rating * 5 - item.price * 2;
  }


}
