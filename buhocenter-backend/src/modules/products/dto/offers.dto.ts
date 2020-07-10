export class OfferDto {
    readonly name: string;
    readonly description: string;
    readonly percentage: number;
}

export class OfferAssignProductDto {
    readonly offer: {
        readonly id: number;
    };
    readonly product: {
        readonly id: number;
    };
}
