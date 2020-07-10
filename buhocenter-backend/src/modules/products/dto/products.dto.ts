export class ProductDTO {
    readonly id: number;
    readonly quantity: number;
    readonly customerId: number;
}

export class ProductsAO {
    readonly id: number;
    readonly productName: string;
    readonly description: string;
    readonly price: number;
    readonly shippingPrice: number;
    readonly minimumQuantityAvailable: number;
    readonly provider: {
        readonly id: number[];
    };
    readonly brand: {
        readonly id: number;
    };
    readonly category: {
        id: number;
    };
    readonly catalogue: {
        id: number[];
    };
}

export class DimensionDto {
    readonly width: string;
    readonly height: string;
    readonly long: string;
}

export class IdArrayDto {
    readonly id: number[];
}

export class dimensionDto {
    readonly width: string;
    readonly height: string;
    readonly long: string;
}

export class ImageProductDto {
    readonly id: number;
    readonly imageName: string;
}

export class DimensionProductDto {
    dimension: {
        width: string;
        height: string;
        long: string;
    };
    id: number;
}

export class categoryDto {
    id: number;
    category: {
        id: number;
    };
    product: {
        id: number;
    };
}
export class InventoryProductDto {
    quantity: number;
    product: {
        id: number;
    };
}

export class idDto {
    id: number;
}
