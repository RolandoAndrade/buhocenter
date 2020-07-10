export class CartProductDTO {
    readonly quantity: string;
    readonly product: {
        readonly id: number;
    };
    readonly user: {
        readonly id: number;
    };
}
