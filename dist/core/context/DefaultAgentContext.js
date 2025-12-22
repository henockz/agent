export class DefaultAgentContext {
    agentId;
    cwd;
    constructor(argv, _env, cwd) {
        this.agentId = argv[0] ?? "Default";
        this.cwd = cwd;
    }
}
