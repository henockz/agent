export class IntentAnalyzer {
    analyze(intent) {
        const normalized = intent.toLowerCase();
        if (normalized.includes("sweater") || normalized.includes("shirt")) {
            return "apparel";
        }
        if (normalized.includes("audi") || normalized.includes("car")) {
            return "vehicle";
        }
        if (normalized.includes("pasta") || normalized.includes("food")) {
            return "food";
        }
        return "unknown";
    }
}
