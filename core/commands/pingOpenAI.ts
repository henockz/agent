import OpenAI from "openai";
import type { AgentResult } from "../types/AgentResult.js";
import type { CommandHandler } from "../types/CommandHandler.js";

export const pingOpenAI: CommandHandler = {
  description: "Ping the OpenAI API (sanity check)",
  run: async (_args, ctx) =>
    {
      let result: AgentResult=
      {
          status:"ok",
          command: "ping-openai",
          output: {}
        };

      try {
        const client = new OpenAI({apiKey: ctx.openAiApiKey});

        const models = await client.models.list();
        result.output = {           
          environment: ctx.environment,
          modelCount: models.data.length,
        }
      }
      catch (err) {
        result.output = {
          status: "error",
          environment: ctx.environment,
          message: (err as Error).message
        }
      }
      return result;
    }
  } 
