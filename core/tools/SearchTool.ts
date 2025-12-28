import { SearchResult } from "../types/SearchResult.js";


export class SearchTool {
  search(query: string): SearchResult[] {
    return [
      { id: "a", title: "Lightweight Jogging Suit", price: 49.99, rating: 4.2 ,uri:""},
      { id: "b", title: "Premium Jogging Suit", price: 129.99, rating: 4.8, uri:"" },
      { id: "c", title: "Budget Jogging Suit", price: 29.99, rating: 3.9 ,uri:"" },
    ];
  }
}