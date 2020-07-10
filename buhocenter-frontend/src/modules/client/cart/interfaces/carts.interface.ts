import { Product } from '@/modules/client/products/interfaces/products.interface';

// se debe eliminar ServiceCart.
export interface ServiceCart {
    id?: number;
    quantity?: number;
    services?: { id: number }[];
    products?: Array<any>;
    productCarts?: Product[];
    customer?: {
        id: number;
    };
    createdAt?: string;
    updatedAt?: string;

    service?: {
        id: number;
    };
}

export class ProductCarts {
    createdAt?: string;
    id?: number;
    product?: Product;
    customer?: {
        id: number;
    };
    offerPrice?: number;
    status?: {
        createdAt?: string;
        description: string;
        id: number;
        name: string;
        updatedAt: string;
    };
    productPoints?: number;
    productPrice?: string;
    quantity?: number;
    updatedAt?: string;
    user?: {
        id: number;
    };
    hasInsurance?: boolean;
}

export interface CartInterface {
    createdAt?: string;
    id?: number;
    cart?: ProductCarts[];
    updatedAt?: string;
}
