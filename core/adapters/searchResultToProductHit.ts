import type { ProductHit } from "@core/types/ProductHit.js";
import type { SearchResult } from "@core/types/SearchResult.js";

export function searchResultToProductHit(
  r: SearchResult
): ProductHit {
  return {
    provider: "serpapi-google-shopping",

    title: r.title,

    // For now, SearchResult.uri is the canonical landing page
    url: r.uri,

    merchant: r.source,
    productId: r.id,

    price: {
      amount: r.price,
      currency: r.currency,
      display: r.currency ? `${r.currency} ${r.price}` : `$${r.price}`,
    },

    rating: r.rating,
    reviewCount: r.reviewCount,

    thumbnailUrl: r.thumbnailUri,

    raw: r.raw,
  };
}
