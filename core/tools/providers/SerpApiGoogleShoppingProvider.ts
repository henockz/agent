// core/tools/providers/SerpApiGoogleShoppingProvider.ts
import type { SearchResult } from "../../types/SearchResult.js";
import type { SearchProvider } from "./SearchProvider.js";

export class SerpApiGoogleShoppingProvider implements SearchProvider {
  private readonly apiKey: string;
  private readonly gl: string;
  private readonly hl: string;

  constructor(opts: { apiKey: string; gl?: string; hl?: string }) {
    this.apiKey = opts.apiKey;
    this.gl = opts.gl ?? "us";
    this.hl = opts.hl ?? "en";
  }

  async search(query: string): Promise<SearchResult[]> {
    if (!query || !query.trim()) return [];

    const url = new URL("https://serpapi.com/search.json");
    url.searchParams.set("engine", "google_shopping");
    url.searchParams.set("q", query);
    url.searchParams.set("gl", this.gl);
    url.searchParams.set("hl", this.hl);
    url.searchParams.set("api_key", this.apiKey);

    const res = await fetch(url.toString());
    if (!res.ok) {
      throw new Error(`SerpApi request failed: ${res.status}`);
    }

    const data = await res.json();
    const rows = data.shopping_results ?? [];

    return rows
      .map((r: any, idx: number): SearchResult | null => {
        if (!r.title || !(r.link || r.product_link)) return null;

        return {
          id: r.product_id ?? `serpapi:${idx}`,
          title: r.title,
          price: typeof r.extracted_price === "number" ? r.extracted_price : 0,
          rating: typeof r.rating === "number" ? r.rating : 0,
          uri: r.link ?? r.product_link,

          // optional, non-breaking
          source: r.source,
          reviewCount: r.reviews,
          thumbnailUri: r.thumbnail,
          raw: r,
        };
      })
      .filter(Boolean) as SearchResult[];
  }
}
