//core/llm/LLMClient.ts
export interface LLMClient {
    complete(prompt: string): Promise<string>;
    readonly kind?:"real" | "test";
}