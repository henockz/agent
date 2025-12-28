import { Categories } from "@config/categories.js";
import type { IntentCategory } from "../types/IntentCategories.js";

export class IntentAnalyzer {
  analyze(input: string): IntentCategory | "unknown" {
    const normalized = input.toLowerCase();

    for (const category in Categories) {
      const keywords = Categories[category as IntentCategory];

      if (keywords.some(keyword => normalized.includes(keyword))) {
        return category as IntentCategory;
      }
    }

    return "unknown";
  }
}
