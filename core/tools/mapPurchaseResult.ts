import type { AgentResult } from "@core/types/AgentResult.js";
import type { PurchaseResult } from "@core/types/PurchaseResult.js";

export function mapPurchaseResult(result: PurchaseResult): AgentResult {
    let response: AgentResult = {
        status: "ok",
        command: "shop",
        output: {},
    };

    if (result.status === "success") {
        response.output = {
            orderId: result.orderId,
            chargedAmount: result.chargedAmount,
            currency: result.currency,
            estimatedDeliveryDate: result.estimatedDeliveryDate,
        };
    } else {
        response.status = "error";
        response.message = result.message ?? result.reason
    }
  

    return response;

}