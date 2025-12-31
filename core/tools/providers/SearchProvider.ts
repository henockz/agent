// core/tools/SearchProvider.ts
import { SearchResult } from "../../types/SearchResult.js";


export interface SearchProvider{

  search(query: string): Promise<SearchResult[]>;
}
