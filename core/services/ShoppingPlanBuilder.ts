import { Categories } from "@config/categories.js";
import { IntentCategory } from "../types/IntentCategories.js";
import { IntentAnalyzer } from "./IntentAnalyer.js";
export type ShoppingPlan = {
  intent: string;
  category: IntentCategory;
  researchQuestions: string[];
  searchQueries: string[];
  evaluationCriteria: string[];
};

export class ShoppingPlanBuilder {
  build(intent: string): ShoppingPlan {
    const analyzer = new IntentAnalyzer();
    const category = analyzer.analyze(intent);

    if (category === "unknown") {
      throw new Error("Cannot build shopping plan for unknown intent");
    }
      const categoryConfig = Categories[category as IntentCategory];

const researchQuestions = [...categoryConfig.research.baseQuestions];
const evaluationCriteria = [...categoryConfig.research.baseQueries];

const searchQueries = researchQuestions.map(q => `${intent} ${q}`);

return {
  intent,
  category,
  researchQuestions,
  searchQueries,
  evaluationCriteria
};

  }
}
