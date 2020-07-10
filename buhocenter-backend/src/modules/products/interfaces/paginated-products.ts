import { Product } from '../entities/product.entity';

export interface PaginatedProducts {
    products: Product[];
    productsNumber: number;
}
