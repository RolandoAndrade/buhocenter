export interface ProductParameters {
    name?: string;
    rating?: number;
    price?: number;
    brandId?: number;
    providerId?: number;
    offerId?: number;
    catalogueId?: number;
    categoryId?: number;
    admin?: boolean;
    limit: number;
    start: number;
}
