import { CartsStateInterface } from '@/store/carts/interfaces/carts.state.interface';

export const CARTS_EMPTY_STATE: CartsStateInterface = {
    err_cart: false,
    err_cart_message: '',
    cart: [],
    checkout: [],
    load_photo_cart: false,
    destination: '',
};
