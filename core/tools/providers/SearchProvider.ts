// core/tools/SearchProvider.ts
import { SearchResult } from "../../types/SearchResult.js";
import { Provider } from "./Provider.js";


export interface SearchProvider extends Provider{

  search(query: string): Promise<SearchResult[]>;
}
