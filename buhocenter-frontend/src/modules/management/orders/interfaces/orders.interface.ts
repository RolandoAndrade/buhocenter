export interface Orders {
    payments?: Order[];
    paymentsNumber?: number;
}

export interface Order {
    id?: number;
    createdAt?: string;
    updatedAt?: string;
    total?: string;
    totalCryptocurrency?: string;
    transaction?: number;
    address?: OrderAddress;
    commission?: OrderCommission;
    statusHistories?: OrderStatus[];
    foreignExchange?: OrderForeignExchange;
    cryptocurrency?: OrderCryptocurrency;
    carts?: OrderCart[];
}

export interface OrderAddress {
    id?: number;
    firstStreet?: string;
    secondStreet?: string;
    city?: string;
    state?: string;
    zipcode?: string;
    user?: OrderAddressUser;
}

export interface OrderAddressUser {
    id?: number;
    name?: string;
    lastName?: string;
    email?: string;
}

export interface OrderCommission {
    id?: number;
    serviceFee?: string;
    processorFee?: string;
}

export interface OrderStatus {
    id?: number;
    status?: {
        id?: number;
        name?: string;
    };
}

export interface OrderForeignExchange {
    id?: number;
    name?: string;
    symbol?: string;
    iso?: string;
}

export interface OrderCryptocurrency {
    id?: number;
    name?: string;
    iso?: string;
}

export interface OrderCart {
    id?: number;
    quantity?: number;
    productPrice?: string;
    productPoints?: number;
    offerPrice?: string;
    product?: {
        id?: number;
        name?: string;
        price?: string;
        productPhotos?: ProductPhoto[];
        brand?: {
            id?: number;
            name?: string;
        };
        provider?: {
            id?: number;
            name?: string;
        };
    };
}

export interface ProductPhoto {
    id?: number;
    content?: string;
}
