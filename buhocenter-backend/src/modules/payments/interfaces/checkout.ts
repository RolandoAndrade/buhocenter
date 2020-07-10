import { Cart } from 'src/modules/carts/entities/cart.entity';
import { Address } from 'src/modules/address/entities/address.entity';
import { ForeignExchange } from 'src/modules/users/entities/foreign-exchange.entity';

export interface Checkout {
    address: Address;
    foreignExchange: ForeignExchange;
    cartsForPayment: Cart[];
}
