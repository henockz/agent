import type { AgentResult } from "../types/AgentResult.js";
import type { CommandHandler } from "../types/CommandHandler.js";

export const pingOpenAI: CommandHandler = {
  description: "Ping the LLM (sanity check)",

  run: async (_args, ctx) => {
    const result: AgentResult = {
      status: "ok",
      command: "ping-openai",
      output: {}
    };

    try {
      // simplest possible sanity check
      await ctx.llm.complete("Respond with the word OK.");

      result.output = {
        environment: ctx.environment,
        status: "LLM reachable"
      };
    }
    catch (err) {
      result.status = "error";
      result.output = {
        environment: ctx.environment,
        message: (err as Error).message
      };
    }

    return result;
  }
};
