import { IntentAnalyzer } from "./IntentAnalyer.js";
export class ShoppingPlanBuilder {
    build(intent) {
        const analyzer = new IntentAnalyzer();
        const category = analyzer.analyze(intent);
        let researchQuestions = [];
        let evaluationCriteria = [];
        switch (category) {
            case "apparel":
                researchQuestions = [
                    "What materials indicate quality for this item?",
                    "What construction details affect durability and comfort?",
                    "What fit considerations matter?",
                    "What price range is typical for good quality?"
                ];
                evaluationCriteria = [
                    "Material quality",
                    "Construction and durability",
                    "Fit and comfort",
                    "Price-to-quality ratio"
                ];
                break;
            case "vehicle":
                researchQuestions = [
                    "What models or trims are available?",
                    "What reliability and safety factors matter?",
                    "What is the expected price range?",
                    "Are there known issues or recalls?"
                ];
                evaluationCriteria = [
                    "Reliability and safety",
                    "Performance and features",
                    "Price and total cost of ownership",
                    "Availability and warranty"
                ];
                break;
            case "food":
                researchQuestions = [
                    "What ingredients indicate quality?",
                    "What origin or sourcing matters?",
                    "What price range indicates good value?",
                    "How should freshness be evaluated?"
                ];
                evaluationCriteria = [
                    "Ingredient quality",
                    "Freshness",
                    "Origin or sourcing",
                    "Value for price"
                ];
                break;
            default:
                researchQuestions = [
                    "What factors determine quality for this item?",
                    "What price range indicates good value?"
                ];
                evaluationCriteria = [
                    "Overall quality",
                    "Value for price"
                ];
        }
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
