import type { CommandHandler } from "../types/CommandHandler.js";


export const echo: CommandHandler = {
  description: "Echo back the provided text",
  run: (args) => ({
    status: "ok",
    command: "echo",
    output: args.join(" "),
  }),
};
