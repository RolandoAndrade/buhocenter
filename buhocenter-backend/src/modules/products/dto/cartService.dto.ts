export class CartServiceDTO {
    readonly quantity: number;
    readonly service: {
        readonly id: number;
    };
    readonly customer: {
        readonly id: number;
    };
}
