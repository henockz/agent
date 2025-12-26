import type { CommandHandler } from "../types/CommandHandler.js";
import { analyzeIntent } from "./analyzeIntent.js";
import { ask } from "./ask.js";
import { echo } from "./echo.js";
import { createHelpCommand } from "./help.js";
import { pingOpenAI } from "./pingOpenAI.js";

export const commands: Record<string, CommandHandler> = {
  echo,  
  ask,
  "analyze-intent": analyzeIntent,
  "ping-openai": pingOpenAI,
};
commands.help = createHelpCommand(commands);

Object.freeze(commands);
 