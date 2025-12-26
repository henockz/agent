import OpenAI from "openai";
import type { AgentResult } from "../types/AgentResult.js";
import type { CommandHandler } from "../types/CommandHandler.js";
export const ask: CommandHandler = {
  description: "Ask OpenAI a simple question",
  run: async (args, ctx) => {

    let result: AgentResult=
    {
          status:"ok",
          command: "ask",
          output: {}
        };
    try {
      if (args.length === 0) {
        result.status="error";
        result.message= "ask requires a prompt"
        
        return result;
      }

      const prompt = args.join(" ");

      const client = new OpenAI({apiKey: ctx.openAiApiKey});

      const response = await client.responses.create({
        model: "gpt-4.1-mini",
        input: prompt,
      });
      result.output = response.output_text
       
    }
    catch (err) {
      result.status = "error";
      result.message = (err as Error).message;      
    }
    return result;
  },
};
