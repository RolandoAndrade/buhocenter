export interface payObjectCheckoutInterfaces {
    cellphone: string | undefined;
    address: {
        id: number | undefined;
        firstStreet: string | undefined;
        secondStreet: string | undefined;
        city: string | undefined;
        state: string | undefined;
        zipcode: string | undefined;
    };
    cartsForPayment: {
        id: number | undefined;
        quantity: number;
        productPrice: number;
        offerPrice: number;
        productPoints: number | undefined;
        product: {
            id: number;
            hasInsurance: boolean | undefined;
            fragile: boolean | undefined;
            description: string | undefined;
            productDimensions: {
                width: string | undefined;
                height: string | undefined;
                long: string | undefined;
                weight: string | undefined;
            };
        };
    }[];
    foreignExchange: { id: number };
}
