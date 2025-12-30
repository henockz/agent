// core/services/IntentAnalyzer.ts
import { Categories } from "@config/categories.js";
import type { IntentCategory } from "../types/IntentCategories.js";

export class IntentAnalyzer {
  analyze(input: string | string[]): IntentCategory | "unknown" {
    const text = Array.isArray(input)
      ? input.join(" ")
      : input;

    const normalized = text.toLowerCase();

    for (const category in Categories) {
      const keywords = Categories[category as IntentCategory].keywords;

      if (keywords.some(keyword => normalized.includes(keyword))) {
        return category as IntentCategory;
      }
    }

    return "unknown";
  }
}
