//core/tools/providers/CommerceProvider.ts
import type { ProductHit } from "@core/types/ProductHit.js";
import type { PurchaseRequest } from "@core/types/PurchaseRequest.js";
import { PurchaseResult } from "@core/types/PurchaseResult.js";
import type { ResolvedProduct } from "@core/types/ResolvedProduct.js";


export interface CommerceProvider {
  name: string;
  
  search(query: string): Promise<ProductHit[]>;
  getProduct(productId: string): Promise<ResolvedProduct>;
  
  purchase(request: PurchaseRequest): Promise<PurchaseResult>;
}
