import { User } from '../../users/entities/user.entity';
import { Product } from '../../products/entities/product.entity';

export interface CustomerLoyaltyUpdateProductPoints {
    user: Partial<User>;
    products: Product[];
}
