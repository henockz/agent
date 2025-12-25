export class DefaultAgentContext {
    agentId;
    cwd;
    apiKey;
    command;
    constructor(argv, env, cwd) {
        this.agentId = "Default";
        this.command = argv.join(" ") ?? "help";
        if (!env.openAiApiKey)
            throw new Error("OPENAI_API_KEY is not set");
        this.apiKey = env.openAiApiKey;
        this.cwd = cwd;
    }
}
