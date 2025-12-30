export type Money = {
  amount: number;
  currency?: string;
  display?: string;
};

export type ProductHit = {
  provider: "serpapi-google-shopping";
  title: string;
  url: string;

  productId?: string;
  merchant?: string;

  price?: Money;
  oldPrice?: Money;

  rating?: number;
  reviewCount?: number;

  thumbnailUrl?: string;

  raw?: Record<string, unknown>;
};

export type ProductSearchResponse = {
  query: string;
  hits: ProductHit[];
  providerMeta: {
    provider: ProductHit["provider"];
    fetchedAtIso: string;
  };
};
