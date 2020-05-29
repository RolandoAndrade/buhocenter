export const ITEM_TYPE = Object.freeze({
    PRODUCT: 1,
    SERVICE: 2,
});

export const STATUS = Object.freeze({
    ACTIVE: 1,
});

export const CURRENCY = Object.freeze({
    USD: {
        id: 1,
        iso: 'USD'
    },
    EUR: {
        id: 2,
        iso: 'EUR',
    },
})
export const ROL = Object.freeze({
    customer: 1,
    ADMIN: 2,
});

export const SUCESS: string = 'success';
export const FETCHING: string = 'fetching';
export const FETCHED: string = 'fetched';
