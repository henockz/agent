export type IntentCategory =   "apparel"  | "vehicle"  | "food"  | "unknown";

export class IntentAnalyzer
{
    analyze(intent: string): IntentCategory
    {
        const normalized = intent.toLowerCase();
        
        if (normalized.includes("sweater") || normalized.includes("shirt"))
        {
            return "apparel";
        }

        if (normalized.includes("audi") || normalized.includes("car"))
        {
            return "vehicle";
        }

        if (normalized.includes("pasta") || normalized.includes("food"))
        {
            return "food";
        }

        return "unknown";
  }
}
