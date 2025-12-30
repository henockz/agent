// core/agent/ExecutionContext.ts
export type ExecutionContext = {
  useResearch: boolean;
  useRanking: boolean;
  preference: "budget" | "premium";
  telemetry: boolean;
};
