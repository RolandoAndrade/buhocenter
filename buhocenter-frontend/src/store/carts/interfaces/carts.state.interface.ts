import { CartInterface, ProductCarts } from '@/modules/client/cart/interfaces/carts.interface';

export interface CartsStateInterface {
    err_cart: boolean;
    err_cart_message: string;
    cart: ProductCarts[];
    checkout: ProductCarts[];
    load_photo_cart: boolean;
    destination: string;
}
