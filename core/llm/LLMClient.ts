export interface LLMClient {
    complete(prompt: string):Promise<string>;

}