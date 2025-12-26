export type AgentResult = {
  command: string;
  output: unknown;
  status: "ok" | "error";
  message?: string;
};
