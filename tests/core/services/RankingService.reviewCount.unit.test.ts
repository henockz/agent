import { RankingService } from "@services/RankingService.js";
import assert from "node:assert";
import test from "node:test";

test("premium ranking prefers slightly lower rating with many reviews", () => {
  const ranking = new RankingService();

  const items = [
    {
      id: "A",
      title: "High rating, few reviews",
      rating: 100,
      reviewCount: 2,
      price: 100,
    },
    {
      id: "B",
      title: "Slightly lower rating, many reviews",
      rating: 90,
      reviewCount: 10,
      price: 100,
    },
  ] as any;

  const ranked = ranking.rank(items, 2, "premium");

  assert.strictEqual(ranked[0].id, "B");
});
