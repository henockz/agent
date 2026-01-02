import { Categories } from "@config/categories.js";
import { IntentCategory } from "../types/IntentCategories.js";
import { IntentAnalyzer } from "./IntentAnalyer.js";
export type ShoppingPlan = {
  intent: string;
  category: IntentCategory;
  dimensions: string[];
  searchQueries: string[];
};

export class ShoppingPlanBuilder {
  build(intent: string): ShoppingPlan {
    const analyzer = new IntentAnalyzer();
    const category = analyzer.analyze(intent);

    if (category === "unknown") {
      throw new Error("Cannot build shopping plan for unknown intent");
    }

    const categoryConfig = Categories[category];

    const dimensions = Object.keys(categoryConfig.dimensions);

    const searchQueries = dimensions.map(
      d => `${intent} ${d.replace("_", " ")}`
    );

    return {
      intent,
      category,
      dimensions,
      searchQueries,
    };
  }
}