// core/llm/OpenAILLMClient.ts
import OpenAI from "openai";
import { LLMClient } from "./LLMClient.js";

export class OpenAILLMClient implements LLMClient {
  private client?: OpenAI;
  private readonly apiKey: string;

  constructor(apiKey: string) {
    this.apiKey = apiKey;
  }

  private getClient(): OpenAI {
    if (!this.client) {
      if (!this.apiKey) {
        throw new Error("OpenAI API key missing");
      }
      this.client = new OpenAI({ apiKey: this.apiKey });
    }
    return this.client;
  }

  async complete(prompt: string): Promise<string> {
    const client = this.getClient();

    const response = await client.chat.completions.create({
      model: "gpt-4.1-mini",
      temperature: 0,
      messages: [
        { role: "user", content: prompt }
      ]
    });

    return response.choices[0]?.message?.content ?? "";
  }
}
