export class DefaultAgentContext {
    agentId;
    cwd;
    apiKey;
    command;
    constructor(argv, env, cwd) {
        this.agentId = "Default";
        this.command = argv[0] ?? "help";
        if (!env.OPENAI_API_KEY)
            throw new Error("OPENAI_API_KEY is not set");
        this.apiKey = env.OPENAI_API_KEY;
        this.cwd = cwd;
    }
}
