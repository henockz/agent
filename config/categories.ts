// config/categories.ts
export const Categories = {
  apparel: {
    keywords: ["shirt", "sweater"],
    research: {
      baseQueries: [
        "material quality",
        "fit and sizing",
        "durability"
      ],
      baseQuestions: [
        "What materials indicate quality?",
        "How should fit be evaluated?",
        "What price range indicates good quality?"
      ]
    }
  },

  vehicle: {
    keywords: ["audi", "car"],
    research: {
      baseQueries: [
        "reliability ratings",
        "safety features",
        "ownership cost"
      ],
      baseQuestions: [
        "What reliability factors matter?",
        "What safety ratings should be considered?",
        "What is the total cost of ownership?"
      ]
    }
  },

  food: {
    keywords: ["pasta", "oil"],
    research: {
      baseQueries: [
        "ingredient quality",
        "origin sourcing",
        "freshness"
      ],
      baseQuestions: [
        "What ingredients indicate quality?",
        "How should freshness be evaluated?",
        "What sourcing matters?"
      ]
    }
  }
} as const;
