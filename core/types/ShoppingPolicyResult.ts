import { IntentCategory } from "./IntentCategories.js";
export type ShoppingPolicyResult = {
  allowed: boolean;
  reason?: string;
  category?: IntentCategory;
};
