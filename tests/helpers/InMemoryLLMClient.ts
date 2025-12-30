// helpers/TestLLMClient.ts
import type { LLMClient } from "@llm/LLMClient.js";

export class InMemoryLLMClient implements LLMClient {
  public lastPrompt = "";
  private response: string;

  constructor(response: string = "") {
    this.response = response;
  }

  async complete(prompt: string): Promise<string> {
    this.lastPrompt = prompt;
    return this.response;
  }
}
