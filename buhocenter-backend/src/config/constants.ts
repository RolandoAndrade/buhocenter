export const STATUS = Object.freeze({
    ACTIVE: {
        id: 1,
        name: 'active',
    },
    INACTIVE: {
        id: 2,
        name: 'inactive',
    },
    NEW: {
        id: 3,
        name: 'new',
    },
    PENDING: {
        id: 4,
        name: 'pending',
    },
    CONFIRMING: {
        id: 5,
        name: 'confirming',
    },
    PAID: {
        id: 6,
        name: 'paid',
    },
    INVALID: {
        id: 7,
        name: 'invalid',
    },
    EXPIRED: {
        id: 8,
        name: 'expired',
    },
    CANCELED: {
        id: 9,
        name: 'canceled',
    },
    RESERVED: {
        id: 10,
        name: 'reserved',
    },
});

export const ROLE = Object.freeze({
    CUSTOMER: {
        id: 1,
    },
    ADMIN: {
        id: 2,
    },
});

export const LANGUAGE = Object.freeze({
    ENGLISH: {
        id: 'en',
    },
    SPANISH: {
        id: 'es',
    },
});

export const ITEM_TYPE = Object.freeze({
    PRODUCT: 1,
    SERVICE: 2,
});

export const UTRUST_PAYMENT_STATUS = Object.freeze({
    CONFIRMED: {
        text: 'ORDER.PAYMENT.RECEIVED',
    },
    CANCELLED: {
        text: 'ORDER.PAYMENT.CANCELLED',
    },
});

export const PLATFORM_PARAMETERS = Object.freeze({
    PAYMENT_COMMISSION: {
        id: 1,
    },
    ECOMMERCE_SERVICE_COMMISSION: {
        id: 2,
    },
});
export const SUCCESS = 'success';

export const FOREIGN_EXCHANGES = Object.freeze({
    USD: {
        id: 1,
    },
});

export const BLOCKCHAIN_MODE = Object.freeze({
    TEST: 'TEST',
    MAIN: 'MAIN',
});

export const PREFIX = Object.freeze({
    ORDERS: '/api/v1/payments/orders',
});

export const URL = Object.freeze({
    CALLBACK: `${PREFIX.ORDERS}/callback`,
});

export const TITLE = Object.freeze({
    PAYMENT: 'New Order',
});

export const CURRENCY = Object.freeze({
    PRICE: 'USD',
    RECEIVE: 'BTC',
});

export const PAGINATE = Object.freeze({
    START: 1,
    LIMIT: 9,
});

export const SYNCHRONIZATION_STATUS = Object.freeze({
    WITHOUT_NOTIFICATION: 'NOT NOTIFIED',
    NOTIFIED: 'NOTIFIED',
});

export const PACKAGE_SYSTEM = Object.freeze({
    WAREHOUSE: 1,
    CHARACTERISTICS: {
        FRAGILE: 4,
        HAS_INSURANCE: 5,
    },
});
