import { Order } from '@/modules/management/orders/interfaces/orders.interface';

export interface OrdersStateInterface {
    orders: Order[];
    quantity: number;
}
