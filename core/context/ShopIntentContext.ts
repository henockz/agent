import { CommandContext } from "../context/CommandContext.js";

const shopIntentContextKeys = [
    "confirmationToken",
    "shippingSpeed",
    "userPreferences",
    "idempotencyKey"
] as const;

export type ShopIntentContext = Pick<CommandContext,typeof shopIntentContextKeys[number]>;
