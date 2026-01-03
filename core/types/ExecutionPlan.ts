import type { ExecutionMode } from "./ExecutionMode.js";
import { ExecutionStepName } from "./ExecutionSteps.js";
export type ExecutionPlan = {
  intent: string;
  mode: ExecutionMode;
  steps: {
    name: ExecutionStepName;
    description?: string;
  }[];

  addStep(step: { name: ExecutionStepName; description?: string }): void;
};
