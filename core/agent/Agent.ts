// core/agent/Agent.ts
import type { AgentContext } from "@context/AgentContext.js";
import { IntentAnalyzer } from "../services/IntentAnalyer.js";

import OpenAI from "openai";
import { ShoppingPlanBuilder } from "../services/ShoppingPlanBuilder.js";

function printPlan(plan: {
  intent: string;
  category: string;
  researchQuestions: string[];
  searchQueries: string[];
  evaluationCriteria: string[];
}) {
  console.log("\n=== AGENT PLAN ===");
  console.log("Intent:", plan.intent);
  console.log("Category:", plan.category);

  console.log("\nResearch questions:");
  plan.researchQuestions.forEach((q, i) =>
    console.log(`  ${i + 1}. ${q}`)
  );

  console.log("\nPlanned search queries:");
  plan.searchQueries.forEach((q, i) =>
    console.log(`  ${i + 1}. ${q}`)
  );

  console.log("\nEvaluation criteria:");
  plan.evaluationCriteria.forEach((c, i) =>
    console.log(`  ${i + 1}. ${c}`)
  );

  console.log("==================\n");
}

export class Agent {
  private readonly context: AgentContext;
  private client?: OpenAI;

  constructor(context: AgentContext) {
    this.context = context;
  }

  private getClient(): OpenAI {
    if (!this.client) {
      this.client = new OpenAI({ apiKey: this.context.apiKey });
    }
    return this.client;
  }

  

  async run(): Promise<void> {
    const analyzer = new IntentAnalyzer();
    const intent = this.context.command;
    const category=analyzer.analyze(intent);
    console.log("[agent] intent:", intent);
    console.log("[agent] category:", category);
    const builder = new ShoppingPlanBuilder();
    const plan = builder.build(intent);
    printPlan(plan);
    




    const handlers: Record<string,() => Promise<{ kind: "static" | "model"; text: string }>> = {
      help: async () => ({
        kind: "static",
        text: `Available commands:
- intro   Introduce the agent
- help    Show this help message`,
      }),

      intro: async () => ({
        kind: "model",
        text: `You are an agent.
Your id is "${this.context.agentId}".
From here on out, your name is "GooZ".
Introduce yourself in one short sentence.`,
      }),
    };

    const command = this.context.command;
    const handler = handlers[command] ?? handlers["help"];
    const result = await handler();

    if (result.kind === "static") {
      console.log(result.text);
      return;
    }

    const client = this.getClient();

    const response = await client.responses.create({
      model: "gpt-4.1-mini",
      input: result.text,
    });

    console.log(response.output_text);
  }
}
