export interface CatalogueCreateI {
    name?: string;
    description?: string;
    term?: string;
    category: {
        id: number;
    };
    status: {
        id: number;
    };
    createdAt?: string;
    updatedAt?: string;
    id?: number;
}
