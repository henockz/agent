import OpenAI from "openai";
import { LLMClient } from "./LLMClient.js";

export class OpenAILLMClient implements LLMClient {
  private readonly client: OpenAI;

  constructor(apiKey: string) {
    this.client = new OpenAI({ apiKey });
  }

  async complete(prompt: string): Promise<string> {
    const response = await this.client.responses.create({
      model: "gpt-4.1-mini",
      input: prompt
    });

    return response.output_text ?? "";
  }
}
