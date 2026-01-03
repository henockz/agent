export const ExecutionSteps = {
  ParseIntent: "parse-intent",
  Search: "search",
  Rank: "rank",
  Purchase: "purchase",
} as const;

export type ExecutionStepName =  typeof ExecutionSteps[keyof typeof ExecutionSteps];
