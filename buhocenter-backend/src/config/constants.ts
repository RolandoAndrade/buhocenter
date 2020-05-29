export const STATUS = Object.freeze({
    ACTIVE: {
        id: 1,
    },
    INACTIVE: {
        id: 2,
    },
    TO_PROCESS: {
        id: 3,
    },
    PROCESSED: {
        id: 4,
    },
    REJECTED: {
        id: 5,
    },
    RESERVED: {
        id: 6,
    }
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
})

export const PLATFORM_PARAMETERS = Object.freeze({
    PAYMENT_COMMISSION: {
        id: 1
    },
    ECOMMERCE_SERVICE_COMMISSION: {
        id: 2
    },
})
export const SUCCESS = 'success';
