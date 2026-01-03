import type { CommandContext } from "../context/CommandContext.js";
import type { CommandHandler } from "../types/CommandHandler.js";
import type { CommandMap } from "./types.js";



export function createHelpCommand(commands: CommandMap): CommandHandler {
  return {
    description: "List available commands",
    run: async(_args:string[],_ctx:CommandContext) => ({
      status: "ok",
      command: "help",
      output: Object.entries(commands)
        .map(([name, cmd]) => ({ name, description: cmd.description }))
        .sort((a, b) => a.name.localeCompare(b.name)),
    }),
  };
}
