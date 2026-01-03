import type { CommandContext } from "../context/CommandContext.js";
import { IntentAnalyzer } from "../services/IntentAnalyer.js";
import type { AgentResult } from "../types/AgentResult.js";
import type { CommandHandler } from "../types/CommandHandler.js";

export const analyzeIntent: CommandHandler = {
      description: "Analyze text and classify intent",
  run: async (args:string[], _ctx:CommandContext) => {
    let result: AgentResult =
    { 
      status: "ok",
      command: "analyze-intent",
      output: {},     
      
    };
    try {
      if (args.length === 0) {
        result.output = "analyze-intent requires text input";
        result.status = "error";
        return result;
      } 

      const input = args.join(" ");
      const analyzer = new IntentAnalyzer();
      const category = analyzer.analyze(input);
      result.output = { input, category };
    }
    catch (err) {
      result.message = (err as Error).message;
      result.status = "error";
    }
    return result;
         
  }
}   
