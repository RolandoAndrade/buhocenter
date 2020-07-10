import { BrandInterface } from '../../brand/interfaces/brand.interface';
import { Catalogue } from '../../catalogues/interfaces/catalogues.interface';
import { Provider } from '../../provider/interfaces/provider.interface';
import { Status } from '@/modules/common/interfaces/status.interface';

export interface ProductCreate {
    id?: number;
    name: string;
    description: string;
    canAccumulatePoints: boolean;
    fragile: boolean;
    price: number;
    shippingPrice: number;
    brand: {
        id: number;
    };
    provider: {
        id: number;
    };
    category: {
        id: number;
    };
    offer: {
        id: number;
    };
    status: {
        id: number;
    };
    productDimension: {
        width: number;
        height: number;
        long: number;
        weight: number;
    };
    productInventory: {
        availableQuantity: number;
        minimunAvailableQuantity: number;
    };
    productCatalogues: productCatalogues[];
    productPhotos: ProductPhotos[];
    photosFiles: photosFilesInterface[];
}

export interface ProductRatingCreate {
    id?: number;
    rating: number;
    comment: string;
    date: string;
    product: {
        id: number;
    };
    user: {
        id: number;
    };
}

export interface ProductProvider {
    createdAt?: string;
    id: number;
    provider: Provider;
    updatedAt?: string;
}

export interface Products {
    products?: Product;
    productsNumber?: number;
}

export interface Product {
    productPhotos: ProductPhotos[];
    description?: string;
    id?: number;
    brand?: BrandInterface;
    minimumQuantityAvailable?: number;
    tentativePoints?: number;
    name?: string;
    imageUrl?: string;
    //revisar offer y offerss
    offer?: any;
    offers?: any;
    price?: number;
    productProvider?: ProductProvider[];
    serviceProvider?: ProductProvider[]; // ELIMINAR
    shippingPrice?: string;
    productDimensions?: ProductDimentions;
    status?: Status;
    provider: {
        createdAt: string;
        id: number;
        name: string;
        updatedAt: string;
    };
    productDimension: {
        //
        width: string;
        height: string;
        long: string;
        weight: string;
    };
    rating?: string;
    questions?: Comment[];
    productInventory?: ProductInventorie;
    productCategories?: {
        createdAt?: string;
        id?: number;
        updatedAt?: string;
        productCatalogues?: {
            createdAt?: string;
            updatedAt?: string;
            id?: number;
            catalogue: Catalogue;
        }[];
    }[];
    productRatings?: ProductRating[];
    serviceRatings?: ProductRating[]; //Eliminar
    canAccumulatePoints?: boolean;
    updatedAt?: string;
    createdAt?: string;
    quantity?: number;
    //quitar
    type?: number;
    fragile?: boolean;
    hasInsurance?: boolean | undefined;
}

export interface ProductPhotos {
    imageUrl?: string | string;
    id?: number;
    createdAt?: string;
    updatedAt?: string;
    content?: string;
}

export interface ProductRating {
    rating?: number;
    total?: number;
}

export interface ProductDimentions {
    createdAt?: string;
    height?: string;
    id?: number;
    long?: string;
    updatedAt?: string;
    width?: string;
}

export interface Comment {
    comment: string;
    createdAt?: string;
    id: number;
    updatedAt?: string;
}

export interface ProductInventorie {
    availableQuantity: number;
    createdAt?: string;
    id: number;
    updatedAt?: string;
}

export interface InventoryProduct {
    quantity: number;
    product: {
        id: number;
    };
}

export interface dimensionDto {
    dimension: {
        width: number;
        height: number;
        long: number;
    };
    id: number;
}

export interface ProductPhotoDto {
    id: number;
    imageName: string;
}

export class ProductFilters {
    name?: string;
    rating?: number;
    new?: boolean;
    categoryId?: number;
    catalogueId?: number;
    limit?: number;
    start?: number;
    price?: number;
}

export interface productCatalogues {
    catalogue?: {
        id: number;
    };
}

export interface photosFilesInterface {
    url?: string;
    file?: any;
}
