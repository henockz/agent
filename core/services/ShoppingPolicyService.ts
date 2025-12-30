import { ShoppingPolicyResult } from "../types/ShoppingPolicyResult.js";
import { IntentAnalyzer } from "./IntentAnalyer.js";

export class ShoppingPolicyService {
    private readonly analyzer: IntentAnalyzer;
    constructor() {
    this.analyzer = new IntentAnalyzer();
  }
  
    evaluate(input: string): ShoppingPolicyResult {
        const category = this.analyzer.analyze(input);
        if (category === 'unknown') {
            return {
                allowed: false,
                reason: `Intent ${input} is not shoppable`
            }
        }
        return {
          allowed:true,
          category
        }
    }
}