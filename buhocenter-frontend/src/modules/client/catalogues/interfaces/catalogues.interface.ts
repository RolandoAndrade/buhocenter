export interface Catalogue {
    id?: number;
    name?: string;
    term?: string;
    createdAt?: string;
    description?: string;
    updatedAt?: string;
}

export interface Catalogues {
    catalogues: Catalogue[];
}

export interface ProductCatalogue {
    id: number;
    category: { id: number };
    product: { id: number };
}
