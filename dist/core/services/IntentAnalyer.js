import { Categories } from "../../config/categories.js";
export class IntentAnalyzer {
    analyze(input) {
        const normalized = input.toLowerCase();
        for (const category in Categories) {
            const keywords = Categories[category];
            if (keywords.some(keyword => normalized.includes(keyword))) {
                return category;
            }
        }
        return "unknown";
    }
}
