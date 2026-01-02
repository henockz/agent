import { ExecutionConfig } from "@config/ExecutionConfig.js";
import { ExecutionPolicy } from "./ExecutionPolicy.js";

export class MaxAmountExecutionPolicy implements ExecutionPolicy {
  constructor(private readonly config:ExecutionConfig) {}

  allowPurchase(input: { provider: string; amount: number }) {
    if (input.amount > this.config.maxPurchaseAmount) {
      return {
        allowed: false,
        reason: `Test budget exceeded: ${input.amount} > ${this.config.maxPurchaseAmount}`,
      };
    }

    return { allowed: true };
  }
}
