// core/helpers/ResponseCleaner.ts
export class ResponseCleaner {
  static extractJson(text: string): string {
    return text
      .trim()
      .replace(/^```json\s*/i, "")
      .replace(/^```\s*/i, "")
      .replace(/\s*```$/, "")
      .trim();
  }
}
