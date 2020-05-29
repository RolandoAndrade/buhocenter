export interface ServiceCart {
    quantity: number;
    service: {
        id: number;
    };
    customer: {
        id: number;
    };
};

export interface ProductCart {
    quantity: number;
    product: {
        id: number;
    };
    customer: {
        id: number;
    };
};