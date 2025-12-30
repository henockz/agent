//core/types/SearchResult.ts
export type SearchResult = {
    id: string;
    title: string;
    price: number;
    rating: number;
    uri: string;
    source?: string;        // merchant / site name
    reviewCount?: number;
    thumbnailUri?: string;
    currency?: string;      // e.g. "USD"
    raw?: Record<string, unknown>;
};