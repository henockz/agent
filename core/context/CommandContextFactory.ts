import type { CommandContext } from "@core/context/CommandContext.js";
import type { ExecutionMode } from "@core/types/ExecutionMode.js";

export class CommandContextFactory {
  static withDerivedFields(config: CommandContext): CommandContext {
    const mode: ExecutionMode =  config.providers?.commerce ? "execute" : "discover";
    return { ...config, mode };
  }
}
