// config/categories.ts
export const Categories = {
  apparel: {
    keywords: ["shirt", "sweater", "beanie", "coat", "jacket"],

    dimensions: {
      material_quality: {
        description: "Fabric type, construction quality, and feel",
      },
      insulation: {
        description: "Warmth retention and thermal performance",
      },
      durability: {
        description: "Resistance to wear and expected lifespan",
      },
      fit: {
        description: "Sizing accuracy and comfort",
      },
      price_value: {
        description: "Value relative to price",
      },
    },
  },

  vehicle: {
    keywords: ["car", "audi", "vehicle"],
    dimensions: {
      reliability: {},
      safety: {},
      ownership_cost: {},
    },
  },

  food: {
    keywords: ["pasta", "oil", "food"],
    dimensions: {
      ingredient_quality: {},
      freshness: {},
      sourcing: {},
    },
  },
} as const;

export type CategoryId = keyof typeof Categories;
