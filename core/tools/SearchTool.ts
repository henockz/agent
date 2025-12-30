// core/tools/SearchTool.ts
import { SearchResult } from "../types/SearchResult.js";
import { SearchProvider } from "./providers/SearchProvider.js";

export class SearchTool {
  constructor(private readonly provider: SearchProvider) {}

  async search(query: string): Promise<SearchResult[]> {
    return this.provider.search(query);
  }
}

/* export class SearchTool {
  async search(query: string): Promise<SearchResult[]> {
    return [
      { id: "a", title: "Lightweight Jogging Suit", price: 49.99, rating: 4.2, uri: "" },
      { id: "b", title: "Premium Jogging Suit", price: 129.99, rating: 4.8, uri: "" },
      { id: "c", title: "Budget Jogging Suit", price: 29.99, rating: 3.9, uri: "" },
    ];
  }
} */
