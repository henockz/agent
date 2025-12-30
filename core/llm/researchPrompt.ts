// core/llm/prompts/researchPrompt.ts
export function buildResearchPrompt(
  intent: string,
  category: string,
  baseQuestions: string[],
  baseQueries: string[]
): string {
  return `
You are a research assistant.

Intent:
"${intent}"

Category:
"${category}"

Base research questions:
${baseQuestions.map(q => `- ${q}`).join("\n")}

Base search queries:
${baseQueries.map(q => `- ${q}`).join("\n")}

Rules:
- Expand the research questions to be clearer and more specific
- Generate search queries optimized for web search
- Do not invent new topics outside the category
- Return JSON ONLY in this exact shape:

{
  "researchQuestions": string[],
  "searchQueries": string[]
}
`;
}
