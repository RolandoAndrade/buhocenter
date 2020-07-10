import { Orders, ProductsOrder } from '@/modules/client/customers/interfaces/orders.interface';

export interface OrderStateInterface {
    orders: Orders[];
    productsOrder: ProductsOrder[];
}
