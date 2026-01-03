import { CommandContext } from "../context/CommandContext.js";
import type { CommandHandler } from "../types/CommandHandler.js";


export const echo: CommandHandler = {
  description: "Echo back the provided text",
  run: async (args: string[], _ctx: CommandContext) => ({
    status: "ok",
    command: "echo",
    output: args.join(" "),
  }),
};
