export interface ExecutionPolicy {
  allowPurchase(input: {
    provider: string;
    amount: number;
  }): { allowed: boolean; reason?: string };
}
