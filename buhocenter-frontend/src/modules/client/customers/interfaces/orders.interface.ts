import { Status } from '@/modules/common/interfaces/status.interface';
import { Product } from '@/modules/client/products/interfaces/products.interface';

export interface Orders {
    id: number;
    createdAt: Date;
    total: number;
    totalCryptocurrency: number;
    statusHistories: StatusHistory[];
    commission: {
        id: number;
        serviceFee: string;
        processorFee: string;
    };
    foreignExchange: {
        id: number;
        name: string;
        symbol: string;
        iso: string;
    };
    cryptocurrency: {
        id: number;
        name: string;
        iso: string;
    };
}

export interface StatusHistory {
    id: number;
    createdAt: string;
    updatedAt: string;
    status: Status;
}

export interface ProductsOrder {
    carts: Carts[];
}

export interface Carts {
    id: number;
    quantity: number;
    productPrice: number;
    offerPrice: number;
    productPoints: number;
    product: Product;
}
