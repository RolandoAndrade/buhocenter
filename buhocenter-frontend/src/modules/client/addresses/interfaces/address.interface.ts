export interface Address {
    id?: number;
    firstStreet?: string;
    secondStreet?: string;
    city?: string;
    state?: string;
    zipcode?: string;
    setDefault?: boolean;
    user?: {
        id: number;
    };
    status?: {
        id: number;
    };
}
