// core/tools/providers/LLMSearchProvider.ts
import { ResponseCleaner } from "@helpers/ResponseCleaner.js";
import type { LLMClient } from "@llm/LLMClient.js";
import type { SearchResult } from "../../types/SearchResult.js";
import type { SearchProvider } from "./SearchProvider.js";
 
export class LLMSearchProvider implements SearchProvider {
  constructor(private readonly llm: LLMClient) {}

  async search(query: string): Promise<SearchResult[]> {
    const prompt = `
Return ONLY valid JSON (no markdown).
Generate an array of shopping items for:
"${query}"

Each item must have:
- id (string)
- title (string)
- price (number)
- rating (number 0-5)
- uri (string, may be empty)
`;

    const raw = await this.llm.complete(prompt);
    const json = ResponseCleaner.extractJson(raw);
    const parsed = JSON.parse(json);

    if (!Array.isArray(parsed)) {
      throw new Error("Search did not return an array");
    }

    return parsed as SearchResult[];
  }
}
