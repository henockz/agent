// core/llm/generateResearch.ts
import { LLMClient } from "./LLMClient.js";
import { buildResearchPrompt } from "./prompts/researchPrompt.js";

export interface ResearchResult {
  researchQuestions: string[];
  searchQueries: string[];
}

export async function generateResearch(
  llm: LLMClient,
  intent: string,
  category: string,
  baseQuestions: readonly string[],
  baseQueries: readonly string[]
): Promise<ResearchResult>
{

  const prompt = buildResearchPrompt(
    intent,
    category,
    baseQuestions,
    baseQueries
  );
  
  

  const content = await  llm.complete(prompt);
  if (!content) {
    throw new Error("LLM returned empty response");
  }

  let parsed;
  try {
    parsed = JSON.parse(content);
  } catch {
    throw new Error("LLM returned invalid JSON");
  }

  return {
    researchQuestions: parsed.researchQuestions,
    searchQueries: parsed.searchQueries
  };
}
