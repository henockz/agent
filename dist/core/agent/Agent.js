export class Agent {
    context;
    constructor(context) {
        this.context = context;
    }
    async run() {
        console.log(this.context, {
            agentId: this.context.agentId,
            cwd: this.context.cwd,
        });
    }
}
